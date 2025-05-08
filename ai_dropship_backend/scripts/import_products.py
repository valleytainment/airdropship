# ai_dropship_backend/scripts/import_products.py
# Implements product synchronization logic as per the launch package.

import os
import requests
import json

# Environment variable to distinguish between production and development
# This should be set in your deployment environment (e.g., Render)
ENVIRONMENT = os.getenv("ENV", "development") # Defaults to development
SPOCKET_API_KEY = os.getenv("SPOCKET_API_KEY")

def get_products_from_spocket():
    """Fetches products from the Spocket API."""
    if not SPOCKET_API_KEY:
        print("Error: SPOCKET_API_KEY environment variable is not set.")
        return [] # Return empty list or raise an error

    api_url = "https://api.spocket.co/v1/products" # Example URL, replace with actual if different
    headers = {
        "Authorization": f"Bearer {SPOCKET_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        response = requests.get(api_url, headers=headers)
        response.raise_for_status() # Raises an HTTPError for bad responses (4XX or 5XX)
        return response.json().get("data", []) # Assuming products are in a "data" key
    except requests.exceptions.RequestException as e:
        print(f"Error fetching products from Spocket: {e}")
        return []

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
            "stock": 150
        },
        {
            "id": "mock_2", 
            "name": "LED Desk Lamp with USB Charging Port", 
            "price": 29.99, 
            "description": "Adjustable brightness, eye-caring light, and convenient USB port.",
            "category": "Home Office",
            "imageUrl": "https://via.placeholder.com/300x300.png?text=LED+Desk+Lamp",
            "stock": 85
        },
        {
            "id": "mock_3", 
            "name": "Smart Fitness Tracker Watch", 
            "price": 79.50, 
            "description": "Monitors heart rate, sleep, steps, and multiple sport modes.",
            "category": "Wearables",
            "imageUrl": "https://via.placeholder.com/300x300.png?text=Fitness+Tracker",
            "stock": 120
        }
    ]

def sync_and_save_products():
    """Determines environment, fetches products, and saves them (e.g., to a file or database)."""
    products = []
    if ENVIRONMENT == "production":
        print("Production environment: Fetching products from Spocket API...")
        products = get_products_from_spocket()
    else:
        print("Development/Testing environment: Using mock product data...")
        products = get_mock_products()

    if products:
        print(f"Successfully fetched/generated {len(products)} products.")
        # In a real application, you would save these products to your database.
        # For this example, we will print them or save to a JSON file.
        output_file = "products_data.json"
        try:
            with open(output_file, "w") as f:
                json.dump(products, f, indent=2)
            print(f"Product data saved to {output_file}")
        except IOError as e:
            print(f"Error saving product data to file: {e}")
        
        # Example: Print product names
        # for product in products:
        #     print(f"- {product.get(\'name\')}")
    else:
        print("No products were fetched or generated.")

if __name__ == "__main__":
    print("Starting product synchronization script...")
    sync_and_save_products()
    print("Product synchronization script finished.")

# To run this script:
# 1. Ensure `requests` library is installed: pip install requests
# 2. Set environment variables if needed (SPOCKET_API_KEY, ENV).
# 3. Execute: python ai_dropship_backend/scripts/import_products.py

