# Pydantic Schemas for data validation

from pydantic import BaseModel, HttpUrl, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# --- Base Config ---
class BaseConfig(BaseModel):
    class Config:
        from_attributes = True # Use instead of orm_mode for Pydantic v2

# --- Supplier Schemas (Keep as is for admin dashboard) ---
class SupplierBase(BaseModel):
    name: str
    website: Optional[str] = None # Keep as string for flexibility
    api_endpoint: Optional[str] = None

class SupplierCreate(SupplierBase):
    pass

class SupplierUpdate(SupplierBase):
    name: Optional[str] = None
    website: Optional[str] = None
    api_endpoint: Optional[str] = None

class Supplier(SupplierBase, BaseConfig):
    id: int

# --- Product Schemas (Adjust for storefront needs) ---
class ProductBase(BaseModel):
    title: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    stock_level: Optional[int] = 0
    # Add variant info if needed, e.g., variants: Optional[List[Dict[str, Any]]] = None

class ProductCreate(ProductBase):
    cost: Optional[float] = None
    sku: Optional[str] = None
    supplier_product_id: Optional[str] = None
    supplier_id: Optional[int] = None

class ProductUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    cost: Optional[float] = None
    image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    stock_level: Optional[int] = None
    sku: Optional[str] = None
    supplier_product_id: Optional[str] = None
    supplier_id: Optional[int] = None

# Schema for displaying product on storefront (PLP/PDP)
class ProductPublic(ProductBase, BaseConfig):
    id: int
    # Exclude sensitive fields like cost

# Schema for product list response with pagination
class ProductListResponse(BaseModel):
    products: List[ProductPublic]
    total: int
    page: int
    size: int

# --- Order Schemas (Tailor for custom checkout) ---

# Schema for items in an incoming order from storefront
class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int
    price_per_unit: float # Price at time of order

# Schema for creating an order via API from storefront
class OrderCreate(BaseModel):
    customer_email: EmailStr
    customer_name: Optional[str] = None
    shipping_address: str # Simple text for now, could be structured
    items: List[OrderItemCreate]
    # Payment details (e.g., payment_method_token) will be handled separately
    # Total amount will be calculated on the backend based on items

# Schema for displaying order details (e.g., confirmation page)
class OrderItemPublic(OrderItemCreate, BaseConfig):
    id: int
    product: ProductPublic # Include product details

class OrderPublic(BaseConfig):
    id: int
    customer_email: EmailStr
    customer_name: Optional[str] = None
    shipping_address: str
    total_amount: float
    status: str
    payment_status: str
    fulfillment_status: str
    tracking_number: Optional[str] = None
    created_at: datetime
    items: List[OrderItemPublic]

# --- ScrapingJob Schemas (Keep as is for admin dashboard) ---
class ScrapingJobBase(BaseModel):
    job_type: str
    supplier_id: Optional[int] = None
    status: str = "pending"

class ScrapingJobCreate(ScrapingJobBase):
    pass

class ScrapingJobUpdate(BaseModel):
    status: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    log: Optional[str] = None

class ScrapingJob(ScrapingJobBase, BaseConfig):
    id: int
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    log: Optional[str] = None
    created_at: datetime

