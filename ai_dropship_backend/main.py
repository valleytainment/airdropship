from fastapi import FastAPI, Query, APIRouter, HTTPException, Body
from ai_dropship_backend.cj_client import search_products
import traceback
import stripe # Import the stripe library
import os
from typing import List, Dict, Any

# Configure Stripe API key (use placeholder, user will replace with actual key in env)
# In a real app, ensure this is securely managed, e.g., via environment variables
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "<your_stripe_secret_key_here>")

# Define the base URL for the frontend, needed for success/cancel URLs
# This should ideally come from an environment variable for flexibility
FRONTEND_BASE_URL = os.getenv("FRONTEND_BASE_URL", "http://localhost:3000") 

app = FastAPI(
    title="Airdropship API",
    description="API for the Airdropship platform, now powered by CJdropshipping and Stripe.",
    version="1.0.1" # Incremented version
)

@app.get("/healthz", tags=["Health Check"])
async def health_check():
    return {"status": "ok"}

# Products router
products_router = APIRouter()

@products_router.get("/api/products", tags=["Products"])
async def api_products(q: str = Query(..., title="Search Query", description="The product search term."), 
                     page: int = Query(1, title="Page Number", description="Page number for pagination."),
                     limit: int = Query(20, title="Page Size", description="Number of products per page.")):
    try:
        print(f"Received request for /api/products with query: {q}, page: {page}, limit: {limit}")
        products_data = search_products(query=q, page=page, limit=limit)
        print(f"Data from search_products: {products_data}")
        return {"products": products_data}
    except Exception as e:
        print(f"Error in api_products endpoint: {type(e).__name__} - {str(e)}")
        traceback.print_exc()
        return {"error": f"Server Error: {type(e).__name__} - {str(e)}", "products": []}

app.include_router(products_router)

# Stripe Checkout router
stripe_router = APIRouter()

# Define a Pydantic model for the cart items if not already defined elsewhere
# For now, assuming a list of dictionaries with 'id', 'name', 'price', 'quantity'

@stripe_router.post("/api/stripe/create-checkout-session", tags=["Stripe"])
async def create_checkout_session(cart_items: List[Dict[str, Any]] = Body(...)):
    """
    Create a Stripe Checkout session.
    Expects a list of cart items in the request body, e.g.:
    [
        {"id": "prod_123", "name": "Awesome T-Shirt", "price": 2000, "quantity": 1},
        {"id": "prod_456", "name": "Cool Mug", "price": 1500, "quantity": 2}
    ]
    Price should be in cents.
    """
    if not stripe.api_key or stripe.api_key == "<your_stripe_secret_key_here>":
        print("Stripe Secret Key is not configured or is using placeholder.")
        raise HTTPException(status_code=500, detail="Stripe payment processing is not configured.")

    line_items = []
    for item in cart_items:
        try:
            line_items.append({
                "price_data": {
                    "currency": "usd", # Or your desired currency
                    "product_data": {
                        "name": item["name"],
                        # Add more product details if needed, like images, description
                        "metadata": {"product_id": item.get("id", "unknown")}
                    },
                    "unit_amount": int(item["price"]), # Price in cents
                },
                "quantity": int(item["quantity"]),
            })
        except KeyError as e:
            raise HTTPException(status_code=400, detail=f"Missing key {e} in cart item: {item}")
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Invalid value for price or quantity in cart item: {item}. Error: {e}")

    if not line_items:
        raise HTTPException(status_code=400, detail="Cannot create checkout session with empty cart.")

    try:
        print(f"Creating Stripe Checkout session with line items: {line_items}")
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=line_items,
            mode="payment",
            success_url=f"{FRONTEND_BASE_URL}/order-confirmation/{{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{FRONTEND_BASE_URL}/checkout?status=cancelled",
            # automatic_tax={"enabled": True} # Enable if you have Stripe Tax configured
        )
        print(f"Stripe Checkout session created successfully: {checkout_session.id}")
        return {"sessionId": checkout_session.id}
    except stripe.error.StripeError as e:
        print(f"Stripe API Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Stripe Error: {str(e)}")
    except Exception as e:
        print(f"Unexpected error creating Stripe session: {str(e)}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail="Internal server error while creating payment session.")

app.include_router(stripe_router)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Airdropship API. See /docs for API documentation."}

