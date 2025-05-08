import requests
import os

CJ_KEY = os.getenv("CJ_API_KEY")
BASE = "https://developers.cjdropshipping.com/api/v1"

def get_access_token():
    resp = requests.post(f"{BASE}/authentication/getAccessToken", data={"key": CJ_KEY})
    resp.raise_for_status()
    return resp.json()["data"]["accessToken"]

def search_products(query, page=1, limit=20):
    token = get_access_token()
    payload = {
        "key": CJ_KEY,
        "accessToken": token,
        "productName": query,
        "pageSize": limit,
        "page": page
    }
    resp = requests.post(f"{BASE}/product/query", data=payload)
    resp.raise_for_status()
    return resp.json()["data"]["products"]

