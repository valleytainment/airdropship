import requests
import os
import json

CJ_API_KEY = os.getenv("CJ_API_KEY")
CJ_EMAIL = "valleytainment@gmail.com"  # As provided by user
BASE_URL_V2 = "https://developers.cjdropshipping.com/api2.0/v1"

def get_cj_access_token():
    endpoint = f"{BASE_URL_V2}/authentication/getAccessToken"
    payload = {
        "email": CJ_EMAIL,
        "password": CJ_API_KEY
    }
    headers = {
        "Content-Type": "application/json"
    }
    print(f"Attempting to get CJ Dropshipping access token from {endpoint} for email: {CJ_EMAIL}")
    try:
        resp = requests.post(endpoint, json=payload, headers=headers)
        print(f"Access token response status: {resp.status_code}")
        # print(f"Access token response content: {resp.text}") # Uncomment for full response debugging
        resp.raise_for_status()
        response_json = resp.json()

        if response_json.get("result") is True and response_json.get("data") and response_json["data"].get("accessToken"):
            access_token = response_json["data"]["accessToken"]
            print("CJ Access token received successfully.")
            return access_token
        else:
            error_message = response_json.get("message", "Unknown error during token retrieval")
            print(f"Failed to get CJ access token: {error_message}. Response: {response_json}")
            raise Exception(f"CJ API Error: {error_message}")
    except requests.exceptions.RequestException as e:
        print(f"RequestException while getting CJ access token: {e}")
        raise Exception(f"Network error while contacting CJ API: {e}")
    except Exception as e:
        print(f"Unexpected error in get_cj_access_token: {e}")
        raise

def search_products(query, page=1, limit=20):
    access_token = get_cj_access_token()
    # Using the product/list endpoint as suggested by the new documentation (GET request)
    endpoint = f"{BASE_URL_V2}/product/list"
    params = {
        "productName": query,
        "pageSize": str(limit),
        "pageNum": str(page)
    }
    headers = {
        "CJ-Access-Token": access_token,
        "Content-Type": "application/json" # Though it's a GET, some APIs still like this header
    }
    print(f"Searching CJ Dropshipping products using GET {endpoint} with query: '{query}', page: {page}, limit: {limit}")
    try:
        resp = requests.get(endpoint, params=params, headers=headers)
        print(f"Product search response status: {resp.status_code}")
        # print(f"Product search response content: {resp.text}") # Uncomment for full response debugging
        resp.raise_for_status()
        response_json = resp.json()

        if response_json.get("result") is True and response_json.get("data") and "list" in response_json["data"]:
            products = response_json["data"]["list"]
            print(f"Successfully fetched {len(products)} products from CJ Dropshipping.")
            return products
        elif response_json.get("result") is False:
            error_message = response_json.get("message", "CJ API returned error during product search")
            print(f"Failed to search products on CJ: {error_message}. Response: {response_json}")
            return [] # Return empty list on API-level error
        else:
            print(f"Unexpected product search response structure from CJ. Response: {response_json}")
            return []
    except requests.exceptions.RequestException as e:
        print(f"RequestException during CJ product search: {e}")
        raise Exception(f"Network error while searching CJ products: {e}")
    except Exception as e:
        print(f"Unexpected error in search_products: {e}")
        raise

