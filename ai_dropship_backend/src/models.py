# SQLAlchemy Database Models

from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship, sessionmaker, declarative_base
from sqlalchemy.sql import func
import os

# Database URL - Use environment variable in production, fallback to SQLite for dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./ai_dropship.db")

engine = create_engine(
    DATABASE_URL,
    # Required for SQLite
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Supplier(Base):
    __tablename__ = "suppliers"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    website = Column(String, unique=True, index=True)
    api_endpoint = Column(String, nullable=True) # For direct integrations
    # Add other relevant supplier fields

class Product(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    cost = Column(Float, nullable=True)
    sku = Column(String, unique=True, index=True, nullable=True)
    supplier_product_id = Column(String, index=True, nullable=True) # ID on supplier platform
    image_url = Column(String, nullable=True)
    category = Column(String, index=True, nullable=True)
    tags = Column(String, nullable=True) # Comma-separated or JSON
    stock_level = Column(Integer, default=0)
    # Add variants relationship if needed
    supplier_id = Column(Integer, ForeignKey("suppliers.id"), nullable=True)
    supplier = relationship("Supplier")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    customer_email = Column(String, index=True, nullable=False)
    customer_name = Column(String, nullable=True)
    shipping_address = Column(Text, nullable=False)
    total_amount = Column(Float, nullable=False)
    status = Column(String, index=True, default="pending") # e.g., pending, processing, shipped, delivered, cancelled
    payment_status = Column(String, index=True, default="pending") # e.g., pending, paid, failed
    payment_gateway_txn_id = Column(String, nullable=True)
    fulfillment_status = Column(String, index=True, default="unfulfilled") # e.g., unfulfilled, fulfilled, partially_fulfilled
    tracking_number = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False) # Link to our product ID
    supplier_product_id = Column(String, nullable=True) # Denormalized for fulfillment
    quantity = Column(Integer, nullable=False)
    price_per_unit = Column(Float, nullable=False) # Price at time of order
    order = relationship("Order", back_populates="items")
    product = relationship("Product")

# Function to create tables
def create_db_and_tables():
    Base.metadata.create_all(bind=engine)


