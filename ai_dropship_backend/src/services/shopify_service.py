# Service for interacting with the Shopify Admin API

import os
import httpx
from typing import Dict, Any, Optional

# Get Shopify details from environment variables
SHOPIFY_STORE_DOMAIN = os.getenv("SHOPIFY_STORE_DOMAIN") # e.g., your-store.myshopify.com
SHOPIFY_API_VERSION = os.getenv("SHOPIFY_API_VERSION", "2024-04") # Use a recent, stable version
SHOPIFY_ACCESS_TOKEN = os.getenv("SHOPIFY_ACCESS_TOKEN") # Admin API access token

API_BASE_URL = f"https://{SHOPIFY_STORE_DOMAIN}/admin/api/{SHOPIFY_API_VERSION}"
HEADERS = {
    "X-Shopify-Access-Token": SHOPIFY_ACCESS_TOKEN,
    "Content-Type": "application/json"
}

async def _make_shopify_request(method: str, endpoint: str, payload: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
    """Helper function to make requests to the Shopify Admin API."""
    if not SHOPIFY_STORE_DOMAIN or not SHOPIFY_ACCESS_TOKEN:
        print("Shopify credentials not configured. Skipping Shopify API call.")
        return None

    url = f"{API_BASE_URL}/{endpoint}.json"
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            if method.upper() == "GET":
                response = await client.get(url, headers=HEADERS)
            elif method.upper() == "POST":
                response = await client.post(url, headers=HEADERS, json=payload)
            elif method.upper() == "PUT":
                response = await client.put(url, headers=HEADERS, json=payload)
            elif method.upper() == "DELETE":
                response = await client.delete(url, headers=HEADERS)
            else:
                raise ValueError(f"Unsupported HTTP method: {method}")

            response.raise_for_status() # Raise exceptions for 4xx/5xx errors
            return response.json()
    except httpx.RequestError as e:
        print(f"Error connecting to Shopify API: {e}")
    except httpx.HTTPStatusError as e:
        print(f"Shopify API request failed: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        print(f"An unexpected error occurred during Shopify API call: {e}")
    return None

async def create_product_in_shopify(product_data: Dict[str, Any]) -> Optional[str]:
    """Creates a product in Shopify."""
    # Adapt product_data to Shopify's product structure
    shopify_payload = {
        "product": {
            "title": product_data.get("title"),
            "body_html": product_data.get("ai_description") or product_data.get("description"),
            "vendor": "AI Dropship", # Or get from supplier info
            "product_type": "", # Categorize if possible
            "status": "draft", # Start as draft, publish manually or via another call
            "variants": [
                {
                    "price": product_data.get("current_retail_price", 0.0),
                    "sku": product_data.get("supplier_product_ref", f"SKU-{product_data.get('internal_id')}"),
                    "inventory_management": "shopify", # Let Shopify track
                    # Add other variant details if available (size, color etc.)
                }
            ],
            "images": [{"src": img} for img in product_data.get("images", [])[:10]] # Limit images initially
            # Add tags, metafields etc. as needed
        }
    }
    result = await _make_shopify_request("POST", "products", payload=shopify_payload)
    if result and "product" in result:
        print(f"Successfully created product in Shopify: ID {result['product']['id']}")
        return str(result["product"]["id"])
    return None

async def update_product_in_shopify(shopify_product_id: str, update_data: Dict[str, Any]):
    """Updates specific fields of a product in Shopify."""
    # Only include fields that need updating
    shopify_payload = {"product": { "id": shopify_product_id, **update_data }}
    result = await _make_shopify_request("PUT", f"products/{shopify_product_id}", payload=shopify_payload)
    if result:
        print(f"Successfully updated product {shopify_product_id} in Shopify.")
    return result

async def update_inventory_level(inventory_item_id: str, location_id: str, quantity: int):
    """Updates the inventory level for an item at a specific location."""
    # First, get the inventory item ID and location ID if not already known
    # This usually requires querying the product variants first
    # Placeholder - assumes IDs are known
    payload = {
        "location_id": location_id,
        "inventory_item_id": inventory_item_id,
        "available": quantity
    }
    result = await _make_shopify_request("POST", "inventory_levels/set", payload=payload)
    if result:
        print(f"Successfully updated inventory for item {inventory_item_id} at location {location_id}.")
    return result

async def update_order_fulfillment(shopify_order_id: str, tracking_number: str, location_id: str):
    """Marks an order as fulfilled in Shopify and adds tracking info."""
    # 1. Get fulfillment orders for the order
    fulfillment_orders_data = await _make_shopify_request("GET", f"orders/{shopify_order_id}/fulfillment_orders")
    if not fulfillment_orders_data or not fulfillment_orders_data.get("fulfillment_orders"):
        print(f"Could not find fulfillment orders for Shopify order {shopify_order_id}.")
        return None

    # Assume fulfilling the first open fulfillment order
    open_fulfillment_order = next((fo for fo in fulfillment_orders_data["fulfillment_orders"] if fo["status"] == "open"), None)
    if not open_fulfillment_order:
        print(f"No open fulfillment orders found for Shopify order {shopify_order_id}.")
        return None

    # 2. Create the fulfillment
    fulfillment_payload = {
        "fulfillment": {
            "location_id": location_id, # Need to know the location ID managing inventory
            "tracking_info": {
                "number": tracking_number,
                # "url": "https://tracking.example.com", # Optional tracking URL
                # "company": "Example Carrier" # Optional carrier name
            },
            "line_items_by_fulfillment_order": [
                {
                    "fulfillment_order_id": open_fulfillment_order["id"]
                    # Optionally specify quantity if doing partial fulfillment
                }
            ],
            "notify_customer": True
        }
    }
    result = await _make_shopify_request("POST", "fulfillments", payload=fulfillment_payload)
    if result and "fulfillment" in result:
        print(f"Successfully created fulfillment for Shopify order {shopify_order_id}.")
    return result

# Add other necessary Shopify interactions (e.g., getting location IDs)

