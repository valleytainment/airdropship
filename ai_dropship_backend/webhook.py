# ai_dropship_backend/webhook.py
# Implements Stripe webhook handling for order creation.

import os
import stripe # Stripe Python library
from fastapi import FastAPI, Request, HTTPException, Header
from typing import Optional, Dict, Any, List
import logging
import json
import sqlalchemy as sa
from sqlalchemy import create_engine, Column, Integer, String, Float, JSON, Boolean, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime
from ai_dropship_backend.cj_client import get_cj_access_token
import requests

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app if this file is meant to be a standalone service
# or integrate with an existing FastAPI app (e.g., in main.py)
# For now, let's assume it can be part of a larger FastAPI application.
# If it's standalone, you'd uncomment: app = FastAPI()

# Environment variables - these must be set in your deployment environment (e.g., Render)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET") # Your Stripe webhook signing secret
CJ_API_KEY = os.getenv("CJ_API_KEY") # For CJdropshipping API, if needed for fulfillment
CJ_EMAIL = os.getenv("CJ_EMAIL", "valleytainment@gmail.com")
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///dropship.db")

# Configure Stripe API key globally
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY
else:
    logger.warning("STRIPE_SECRET_KEY environment variable is not set. Stripe API calls will fail.")

if not STRIPE_WEBHOOK_SECRET:
    logger.warning("STRIPE_WEBHOOK_SECRET environment variable is not set. Webhook signature verification will fail.")

# Database setup
Base = declarative_base()

class Order(Base):
    __tablename__ = "orders"
    
    id = Column(Integer, primary_key=True)
    stripe_session_id = Column(String(255), unique=True, index=True)
    customer_email = Column(String(255))
    amount_total = Column(Float)
    currency = Column(String(10))
    status = Column(String(50))
    line_items = Column(JSON)
    shipping_address = Column(JSON)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    cj_order_id = Column(String(255), nullable=True)
    cj_tracking_number = Column(String(255), nullable=True)
    fulfillment_status = Column(String(50), default="pending")
    notes = Column(Text, nullable=True)
    
    def to_dict(self):
        return {
            "id": self.id,
            "stripe_session_id": self.stripe_session_id,
            "customer_email": self.customer_email,
            "amount_total": self.amount_total,
            "currency": self.currency,
            "status": self.status,
            "line_items": self.line_items,
            "shipping_address": self.shipping_address,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "cj_order_id": self.cj_order_id,
            "cj_tracking_number": self.cj_tracking_number,
            "fulfillment_status": self.fulfillment_status,
            "notes": self.notes
        }

# Create database engine and session
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(engine)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        return db
    finally:
        db.close()

def order_exists(stripe_session_id: str) -> bool:
    """Checks if an order with the given Stripe session ID already exists."""
    logger.info(f"Checking for existing order with Stripe session ID: {stripe_session_id}")
    db = get_db()
    try:
        order = db.query(Order).filter(Order.stripe_session_id == stripe_session_id).first()
        return order is not None
    except Exception as e:
        logger.error(f"Error checking if order exists: {e}", exc_info=True)
        return False
    finally:
        db.close()

def create_order_in_database(stripe_session_data):
    """Creates an order record in the database based on Stripe session data."""
    logger.info(f"Creating order in database for session ID: {stripe_session_data.get('id')}")
    
    # Extract customer and order details from Stripe session
    stripe_session_id = stripe_session_data.get("id")
    customer_email = stripe_session_data.get("customer_details", {}).get("email")
    amount_total = stripe_session_data.get("amount_total", 0) / 100  # Convert from cents to dollars
    currency = stripe_session_data.get("currency", "usd")
    shipping_address = stripe_session_data.get("shipping", {}).get("address", {})
    
    # Retrieve line items from Stripe session
    try:
        line_items_stripe = stripe.checkout.Session.list_line_items(stripe_session_id, limit=100)
        line_items = []
        
        for item in line_items_stripe.data:
            product_id = item.price.product
            
            # Get product details
            try:
                product = stripe.Product.retrieve(product_id)
                product_name = product.name
                product_images = product.images
                product_metadata = product.metadata
            except Exception as e:
                logger.warning(f"Could not retrieve product details for {product_id}: {e}")
                product_name = item.description
                product_images = []
                product_metadata = {}
            
            line_items.append({
                "product_id": product_id,
                "product_name": product_name,
                "quantity": item.quantity,
                "unit_price": item.price.unit_amount / 100,  # Convert from cents to dollars
                "total_price": (item.price.unit_amount * item.quantity) / 100,
                "currency": item.currency,
                "product_images": product_images,
                "product_metadata": product_metadata
            })
    except Exception as e:
        logger.error(f"Error retrieving line items from Stripe: {e}", exc_info=True)
        line_items = []
    
    # Create new order in database
    db = get_db()
    try:
        new_order = Order(
            stripe_session_id=stripe_session_id,
            customer_email=customer_email,
            amount_total=amount_total,
            currency=currency,
            status="processing",
            line_items=line_items,
            shipping_address=shipping_address,
            fulfillment_status="pending"
        )
        
        db.add(new_order)
        db.commit()
        db.refresh(new_order)
        
        logger.info(f"Order created successfully: {new_order.id}")
        return new_order.to_dict()
    except Exception as e:
        db.rollback()
        logger.error(f"Error creating order in database: {e}", exc_info=True)
        raise
    finally:
        db.close()

def fulfill_order_with_cjdropshipping(order_data, stripe_session_data):
    """Sends order details to CJdropshipping API for fulfillment."""
    if not CJ_API_KEY:
        logger.warning("CJ_API_KEY is not set. Cannot fulfill order with CJdropshipping.")
        return False, "CJ_API_KEY not set"

    logger.info(f"Attempting to fulfill order {order_data.get('stripe_session_id')} with CJdropshipping.")
    
    try:
        # Get CJ Dropshipping access token
        access_token = get_cj_access_token()
        if not access_token:
            return False, "Failed to get CJ Dropshipping access token"
        
        # Extract shipping address from order data
        shipping_address = order_data.get("shipping_address", {})
        if not shipping_address:
            shipping_address = stripe_session_data.get("shipping", {}).get("address", {})
            
        if not shipping_address:
            return False, "No shipping address found in order data"
        
        # Extract customer details
        customer_name = stripe_session_data.get("customer_details", {}).get("name", "")
        customer_email = order_data.get("customer_email", "")
        
        # Extract line items
        line_items = order_data.get("line_items", [])
        if not line_items:
            return False, "No line items found in order data"
        
        # Prepare CJ Dropshipping order payload
        cj_order_payload = {
            "orderNumber": f"ADS-{order_data.get('id')}-{datetime.datetime.now().strftime('%Y%m%d%H%M%S')}",
            "shippingAddress": {
                "name": customer_name,
                "phone": stripe_session_data.get("customer_details", {}).get("phone", ""),
                "email": customer_email,
                "address1": shipping_address.get("line1", ""),
                "address2": shipping_address.get("line2", ""),
                "city": shipping_address.get("city", ""),
                "province": shipping_address.get("state", ""),
                "country": shipping_address.get("country", ""),
                "zip": shipping_address.get("postal_code", "")
            },
            "products": []
        }
        
        # Add products to CJ order
        for item in line_items:
            # In a real implementation, you would map your product IDs to CJ product IDs
            # For now, we'll use a placeholder approach
            product_id = item.get("product_metadata", {}).get("cj_product_id", "")
            if not product_id:
                logger.warning(f"No CJ product ID found for item: {item.get('product_name')}")
                continue
                
            cj_order_payload["products"].append({
                "vid": product_id,  # CJ product variant ID
                "quantity": item.get("quantity", 1),
                "shippingName": "Standard"  # Or other shipping method as needed
            })
        
        if not cj_order_payload["products"]:
            return False, "No valid CJ products found in order"
        
        # Send order to CJ Dropshipping API
        endpoint = "https://developers.cjdropshipping.com/api2.0/v1/shopping/order/create"
        headers = {
            "CJ-Access-Token": access_token,
            "Content-Type": "application/json"
        }
        
        response = requests.post(endpoint, json=cj_order_payload, headers=headers)
        response.raise_for_status()
        response_data = response.json()
        
        if response_data.get("result") is True and response_data.get("data"):
            cj_order_id = response_data["data"].get("orderId")
            
            # Update order in database with CJ order ID
            db = get_db()
            try:
                order = db.query(Order).filter(Order.id == order_data.get("id")).first()
                if order:
                    order.cj_order_id = cj_order_id
                    order.fulfillment_status = "submitted_to_cj"
                    order.notes = f"Order submitted to CJ Dropshipping: {datetime.datetime.now().isoformat()}"
                    db.commit()
            except Exception as e:
                logger.error(f"Error updating order with CJ order ID: {e}", exc_info=True)
            finally:
                db.close()
                
            return True, f"Order successfully submitted to CJ Dropshipping. CJ Order ID: {cj_order_id}"
        else:
            error_message = response_data.get("message", "Unknown error from CJ Dropshipping API")
            return False, f"CJ Dropshipping API error: {error_message}"
            
    except requests.exceptions.RequestException as e:
        logger.error(f"Network error while contacting CJ Dropshipping API: {e}", exc_info=True)
        return False, f"Network error while contacting CJ Dropshipping API: {str(e)}"
    except Exception as e:
        logger.error(f"Unexpected error during CJ Dropshipping fulfillment: {e}", exc_info=True)
        return False, f"Unexpected error during CJ Dropshipping fulfillment: {str(e)}"

# This is the endpoint that Stripe will send webhook events to.
async def handle_stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    """Handles incoming Stripe webhook events."""
    if not STRIPE_WEBHOOK_SECRET:
        logger.error("Stripe webhook secret is not configured. Cannot verify event.")
        raise HTTPException(status_code=500, detail="Webhook secret not configured on server.")

    payload = await request.body()
    event_id = None
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
        event_id = event.id
    except ValueError as e:
        logger.error(f"Webhook payload processing error: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid payload: {e}")
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"Webhook signature verification failed: {e}")
        raise HTTPException(status_code=400, detail=f"Invalid signature: {e}")
    except Exception as e:
        logger.error(f"Unexpected error constructing webhook event: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {e}")

    logger.info(f"Received Stripe event: ID={event_id}, Type={event['type']}")

    # Handle specific event types
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        stripe_session_id = session.get("id")
        logger.info(f"Processing checkout.session.completed for ID: {stripe_session_id}")

        # Idempotency check: Has this session already been processed?
        if order_exists(stripe_session_id):
            logger.info(f"Order for session ID {stripe_session_id} already processed. Skipping.")
            return {"status": "success", "message": "Event already processed", "event_id": event_id}

        try:
            order = create_order_in_database(session)
            if not order:
                logger.error(f"Failed to create order in database for session {stripe_session_id}. Order data was empty.")
                return {"status": "error", "message": "Failed to create order in database", "event_id": event_id}

            logger.info(f"Order created in database for session {stripe_session_id}: {order}")
            
            # Attempt to fulfill the order with CJdropshipping
            fulfillment_success, fulfillment_message = fulfill_order_with_cjdropshipping(order, session)
            if fulfillment_success:
                logger.info(f"Order {stripe_session_id} processed and fulfillment initiated with CJdropshipping: {fulfillment_message}")
                
                # Update order status in database
                db = get_db()
                try:
                    db_order = db.query(Order).filter(Order.stripe_session_id == stripe_session_id).first()
                    if db_order:
                        db_order.status = "awaiting_fulfillment"
                        db.commit()
                except Exception as e:
                    logger.error(f"Error updating order status: {e}", exc_info=True)
                finally:
                    db.close()
            else:
                logger.error(f"Failed to initiate fulfillment for order {stripe_session_id} with CJdropshipping: {fulfillment_message}")
                
                # Update order with failure notes
                db = get_db()
                try:
                    db_order = db.query(Order).filter(Order.stripe_session_id == stripe_session_id).first()
                    if db_order:
                        db_order.notes = f"Fulfillment failed: {fulfillment_message}"
                        db.commit()
                except Exception as e:
                    logger.error(f"Error updating order with failure notes: {e}", exc_info=True)
                finally:
                    db.close()
                
                # In a production environment, you might want to:
                # 1. Send notification to admin
                # 2. Add to a retry queue
                # 3. Mark for manual intervention
        
        except Exception as e:
            logger.error(f"Error processing checkout.session.completed for {stripe_session_id}: {e}", exc_info=True)
            # Acknowledge receipt to avoid repeated retries during development
            # In production, you might want to return a 500 to trigger Stripe's retry mechanism
            return {
                "status": "error", 
                "message": f"Internal error processing event: {e}",
                "event_id": event_id
            }

    elif event["type"] == "payment_intent.succeeded":
        payment_intent = event["data"]["object"]
        logger.info(f"PaymentIntent succeeded: {payment_intent.id}")
        # Handle other relevant events if necessary

    else:
        logger.info(f"Received unhandled event type: {event['type']}")
        # We'll acknowledge receipt of all event types to avoid unnecessary retries

    return {"status": "success", "event_id": event_id}

# Register the webhook endpoint with the main FastAPI app
def register_webhook_endpoint(app):
    """Registers the Stripe webhook endpoint with the provided FastAPI app."""
    app.post("/stripe-webhook")(handle_stripe_webhook)
    logger.info("Stripe webhook endpoint registered at /stripe-webhook")
