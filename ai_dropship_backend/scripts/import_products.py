# ai_dropship_backend/scripts/import_products.py
# Implements product synchronization logic, now using CJdropshipping.

import os
import sys
import json

# Adjust sys.path to allow importing from the parent directory (ai_dropship_backend)
# This is necessary if cj_client.py is in the parent directory and this script is run directly.
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(SCRIPT_DIR)
sys.path.append(PARENT_DIR)

from cj_client import search_products # Assuming cj_client.py is in PARENT_DIR

# Environment variable to distinguish between production and development
ENVIRONMENT = os.getenv("ENV", "development") # Defaults to development

def get_mock_products():
    """Returns mock product data for development and testing."""
    return [
        {
            "id": "mock_1", 
            "name": "Wireless Bluetooth Earbuds Pro", 
            "price": 49.99, 
            "description": "High-fidelity sound, long battery life, and comfortable fit.",
            "category": "Electronics",
            "imageUrl": "https://via.placeholder.com/300x300.png?text=Earbuds+Pro",
            "stock": 150,
            "supplier": "MockSupplier"
        },
        {
            "id": "mock_2", 
            "name": "LED Desk Lamp with USB Charging Port", 
            "price": 29.99, 
            "description": "Adjustable brightness, eye-caring light, and convenient USB port.",
            "category": "Home Office",
            "imageUrl": "https://via.placeholder.com/300x300.png?text=LED+Desk+Lamp",
            "stock": 85,
            "supplier": "MockSupplier"
        },
        {
            "id": "mock_3", 
            "name": "Smart Fitness Tracker Watch", 
            "price": 79.50, 
            "description": "Monitors heart rate, sleep, steps, and multiple sport modes.",
            "category": "Wearables",
            "imageUrl": "https://via.placeholder.com/300x300.png?text=Fitness+Tracker",
            "stock": 120,
            "supplier": "MockSupplier"
        }
    ]

def sync_and_save_products():
    """Determines environment, fetches products from CJdropshipping or mock data, and saves them."""
    products = []
    if ENVIRONMENT == "production":
        print("Production environment: Fetching products from CJdropshipping API...")
        try:
            # For a general sync, you might search for popular categories or new items.
            # Here, we use a generic query "electronics" as an example.
            # You might want to loop through multiple queries or categories for a full sync.
            cj_products = search_products(query="electronics", page=1, limit=50) # Fetch up to 50 products
            if cj_products:
                print(f"Successfully fetched {len(cj_products)} products from CJdropshipping.")
                # TODO: Map CJ product fields to your desired database schema/JSON structure.
                # For now, we save the raw CJ product data.
                products = cj_products 
            else:
                print("No products returned from CJdropshipping for the query.")
        except Exception as e:
            print(f"Error fetching products from CJdropshipping: {e}")
            print("Falling back to mock data for this run due to API error.")
            products = get_mock_products()
    else:
        print("Development/Testing environment: Using mock product data...")
        products = get_mock_products()

    if products:
        # Add a supplier field for clarity if it doesn't exist
        for product in products:
            if "supplier" not in product:
                product["supplier"] = "CJdropshipping" if ENVIRONMENT == "production" and product in cj_products else product.get("supplier", "Unknown")

        print(f"Successfully prepared {len(products)} products.")
        output_file = os.path.join(SCRIPT_DIR, "products_data.json") # Save in the same directory as the script
        try:
            with open(output_file, "w") as f:
                json.dump(products, f, indent=2)
            print(f"Product data saved to {output_file}")
        except IOError as e:
            print(f"Error saving product data to file: {e}")
    else:
        print("No products were fetched or generated.")

if __name__ == "__main__":
    print("Starting product synchronization script (CJdropshipping integration)...")
    # Ensure CJ_API_KEY is set if in production
    if ENVIRONMENT == "production" and not os.getenv("CJ_API_KEY"):
        print("Error: CJ_API_KEY environment variable is not set for production. Aborting sync.")
    else:
        sync_and_save_products()
    print("Product synchronization script finished.")

