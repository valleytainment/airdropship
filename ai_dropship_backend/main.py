from fastapi import FastAPI, Query, APIRouter
from .cj_client import search_products # Use absolute import for cj_client

app = FastAPI(
    title="Airdropship API",
    description="API for the Airdropship platform, now powered by CJdropshipping.",
    version="1.0.0"
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
    """
    Search for products using the CJdropshipping API.
    """
    # In a real app, you might want to add error handling here
    # For example, if search_products raises an exception
    try:
        products_data = search_products(query=q, page=page, limit=limit)
        return {"products": products_data}
    except Exception as e:
        # Log the exception e
        # Consider returning a more specific HTTP error code and message
        return {"error": str(e), "products": []} # Basic error response

app.include_router(products_router)

# Placeholder for Stripe Webhook if it needs to be in the same app
# from .webhook import handle_stripe_webhook # Assuming webhook.py is in the same directory
# app.post("/stripe-webhook")(handle_stripe_webhook)

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Welcome to the Airdropship API. See /docs for API documentation."}

# To run this app (ensure cj_client.py is in the same directory or adjust import):
# 1. Install FastAPI and Uvicorn: pip install fastapi uvicorn[standard]
# 2. Set CJ_API_KEY environment variable.
# 3. Run: uvicorn ai_dropship_backend.main:app --reload

