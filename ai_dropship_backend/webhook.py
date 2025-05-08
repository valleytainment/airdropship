# ai_dropship_backend/webhook.py
# Implements Stripe webhook handling for order creation and auto-fulfillment.

import os
import stripe # Stripe Python library
import requests # For making HTTP requests to Spocket API
from fastapi import FastAPI, Request, HTTPException, Header
from typing import Optional

# Initialize FastAPI app if this file is meant to be a standalone service
# or integrate with an existing FastAPI app (e.g., in main.py)
# For now, let's assume it can be part of a larger FastAPI application.
# If it's standalone, you'd uncomment: app = FastAPI()

# Environment variables - these must be set in your deployment environment (e.g., Render)
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET") # Your Stripe webhook signing secret
SPOCKET_API_KEY = os.getenv("SPOCKET_API_KEY")

# Configure Stripe API key globally
if STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY
else:
    print("Warning: STRIPE_SECRET_KEY environment variable is not set. Stripe API calls will fail.")

if not STRIPE_WEBHOOK_SECRET:
    print("Warning: STRIPE_WEBHOOK_SECRET environment variable is not set. Webhook signature verification will fail.")

# Placeholder function for creating an order in your database
# This would typically interact with your database models
def create_order_in_database(stripe_session_data):
    """Creates an order record in the database based on Stripe session data."""
    print(f"Simulating order creation for session ID: {stripe_session_data.get(\'id\')}")
    # Example: Extract customer details, line items, amount, etc.
    customer_email = stripe_session_data.get("customer_details", {}).get("email")
    amount_total = stripe_session_data.get("amount_total")
    currency = stripe_session_data.get("currency")
    # In a real app, you would save this to a database and return an order object or ID.
    # For now, just returning a dictionary with some details.
    order_details = {
        "stripe_session_id": stripe_session_data.get("id"),
        "customer_email": customer_email,
        "amount_total": amount_total,
        "currency": currency,
        "status": "processing" # Initial order status
    }
    print(f"Order details: {order_details}")
    return order_details

# Placeholder function for auto-fulfilling order with Spocket
# This would typically interact with the Spocket API
def fulfill_order_with_spocket(order_data, stripe_session_data):
    """Sends order details to Spocket API for fulfillment."""
    if not SPOCKET_API_KEY:
        print("Error: SPOCKET_API_KEY is not set. Cannot fulfill order with Spocket.")
        return False

    spocket_order_url = "https://api.spocket.co/v1/orders" # Example URL, replace if different
    headers = {
        "Authorization": f"Bearer {SPOCKET_API_KEY}",
        "Content-Type": "application/json"
    }
    
    # Construct payload for Spocket API based on your order and line item structure
    # This is highly dependent on what Spocket expects and what your `stripe_session_data` contains
    # For example, you might need to retrieve line items from the Stripe session
    # line_items = stripe.checkout.Session.list_line_items(stripe_session_data.id, limit=5)
    
    payload = {
        "customer_email": order_data.get("customer_email"),
        "total_price": order_data.get("amount_total") / 100.0, # Assuming amount_total is in cents
        "currency": order_data.get("currency"),
        # Add line items, shipping address, etc., as required by Spocket
        # "line_items": [...],
        # "shipping_address": {...}
    }
    print(f"Attempting to fulfill order with Spocket. Payload: {payload}")
    
    try:
        response = requests.post(spocket_order_url, headers=headers, json=payload)
        response.raise_for_status()
        print(f"Order successfully sent to Spocket for fulfillment. Response: {response.json()}")
        return True
    except requests.exceptions.RequestException as e:
        print(f"Error fulfilling order with Spocket: {e}")
        if response is not None:
            print(f"Spocket API Response Text: {response.text}")
        return False

# This is the endpoint that Stripe will send webhook events to.
# It needs to be exposed publicly by your Render service.
# Example: @app.post("/stripe-webhook") if using an existing FastAPI app instance
async def handle_stripe_webhook(request: Request, stripe_signature: Optional[str] = Header(None)):
    """Handles incoming Stripe webhook events."""
    if not STRIPE_WEBHOOK_SECRET:
        print("Error: Stripe webhook secret is not configured. Cannot verify event.")
        raise HTTPException(status_code=500, detail="Webhook secret not configured.")

    payload = await request.body()
    
    try:
        event = stripe.Webhook.construct_event(
            payload, stripe_signature, STRIPE_WEBHOOK_SECRET
        )
    except ValueError as e:
        # Invalid payload
        print(f"Webhook ValueError: {e}")
        raise HTTPException(status_code=400, detail=str(e))
    except stripe.error.SignatureVerificationError as e:
        # Invalid signature
        print(f"Webhook SignatureVerificationError: {e}")
        raise HTTPException(status_code=400, detail=str(e))

    print(f"Received Stripe event: {event[\'type\']}")

    # Handle the checkout.session.completed event
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"] # This is the Stripe Checkout Session object
        print(f"Checkout session completed for ID: {session.get(\'id\')}")
        
        # Create an order in your database
        order = create_order_in_database(session)
        
        # Auto-fulfill the order with Spocket
        if order:
            fulfillment_success = fulfill_order_with_spocket(order, session)
            if fulfillment_success:
                print(f"Order {order.get(\'stripe_session_id\')} processed and sent for fulfillment.")
                # Update order status in your database to "fulfilled" or similar
            else:
                print(f"Failed to fulfill order {order.get(\'stripe_session_id\')} with Spocket.")
                # Handle fulfillment failure (e.g., notify admin, retry logic)
        else:
            print("Failed to create order in database from Stripe session.")

    # Add handling for other event types as needed
    # elif event["type"] == "payment_intent.succeeded":
    #     payment_intent = event["data"]["object"]
    #     print(f"PaymentIntent succeeded: {payment_intent.id}")
    # ... handle other event types

    return {"status": "success"}

# If you are creating a new FastAPI app in this file (e.g., for a dedicated webhook microservice):
# from fastapi import FastAPI
# app = FastAPI()
# app.post("/stripe-webhook")(handle_stripe_webhook)

# To run this (if standalone with uvicorn):
# 1. Install FastAPI, Uvicorn, Stripe, Requests: pip install fastapi uvicorn stripe requests
# 2. Set environment variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SPOCKET_API_KEY
# 3. Run: uvicorn webhook:app --reload (assuming app = FastAPI() is uncommented and endpoint registered)

