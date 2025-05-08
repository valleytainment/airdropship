# Main FastAPI application
import os
import sys
from fastapi import FastAPI
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, Boolean, DateTime
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.sql import func
from dotenv import load_dotenv

# Ensure the src directory is in the Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

# Load environment variables from .env file
load_dotenv()

# Database Setup
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./dropship.db")
# For SQLite, connect_args is needed to allow usage across threads (FastAPI background tasks)
engine_args = {"connect_args": {"check_same_thread": False}} if DATABASE_URL.startswith("sqlite") else {}
engine = create_engine(DATABASE_URL, **engine_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# --- Database Models ---
# (Define models based on architecture_design.md)
class Product(Base):
    __tablename__ = "products"
    internal_id = Column(Integer, primary_key=True, index=True)
    shopify_product_id = Column(String, index=True, nullable=True)
    supplier_id = Column(Integer, index=True, nullable=True) # Foreign key placeholder
    supplier_product_ref = Column(String, index=True, nullable=True)
    title = Column(String, index=True)
    description = Column(Text, nullable=True)
    ai_description = Column(Text, nullable=True)
    images = Column(Text, nullable=True) # Store as JSON string or comma-separated
    variants = Column(Text, nullable=True) # Store as JSON string
    supplier_url = Column(String, nullable=True)
    cost_price = Column(Float, nullable=True)
    current_retail_price = Column(Float, nullable=True)
    pricing_rule_id = Column(Integer, nullable=True) # Foreign key placeholder
    stock_level = Column(Integer, nullable=True)
    status = Column(String, default="discovered", index=True)
    last_scraped_at = Column(DateTime(timezone=True), server_default=func.now())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, unique=True)
    website = Column(String, nullable=True)
    api_details = Column(Text, nullable=True) # Store as JSON string, consider encryption
    integration_type = Column(String, default="scrape") # api or scrape
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Order(Base):
    __tablename__ = "orders"
    internal_id = Column(Integer, primary_key=True, index=True)
    shopify_order_id = Column(String, unique=True, index=True)
    customer_details = Column(Text) # JSON string
    items = Column(Text) # JSON string
    total_cost = Column(Float, nullable=True)
    total_revenue = Column(Float)
    status = Column(String, default="received", index=True)
    supplier_order_ref = Column(String, nullable=True)
    tracking_number = Column(String, nullable=True)
    fulfillment_log = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PricingRule(Base):
    __tablename__ = "pricing_rules"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    rule_type = Column(String) # e.g., margin_percentage, margin_fixed, fixed_price
    parameters = Column(Text) # JSON string
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class ScrapingJob(Base):
    __tablename__ = "scraping_jobs"
    id = Column(Integer, primary_key=True, index=True)
    job_type = Column(String, index=True) # e.g., product_discovery, price_stock_monitor
    supplier_id = Column(Integer, nullable=True) # Foreign key placeholder
    status = Column(String, default="pending", index=True)
    start_time = Column(DateTime(timezone=True), nullable=True)
    end_time = Column(DateTime(timezone=True), nullable=True)
    log = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# Create database tables
Base.metadata.create_all(bind=engine)

# FastAPI App Instance
app = FastAPI(title="AI Dropshipping Backend", version="0.1.0")

# Dependency for getting DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Dropshipping Backend API"}

# Import and include routers
from src.routers import suppliers, products, scraping_jobs # Added scraping_jobs
app.include_router(suppliers.router)
app.include_router(products.router)
app.include_router(scraping_jobs.router) # Added scraping_jobs router

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


