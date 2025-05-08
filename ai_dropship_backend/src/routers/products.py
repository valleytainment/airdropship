# API Router for Products (Storefront & Admin)

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import json

# Adjust import path based on actual project structure
from src import schemas, models # Use models directly
from src.models import get_db # Import get_db from .models

# Placeholder for service functions (e.g., AI generation)
# from src.services import ai_service, shopify_service

router = APIRouter(
    prefix="/products",
    tags=["products"],
    responses={404: {"description": "Not found"}},
)

# Placeholder: Function to trigger AI description generation
async def trigger_ai_description(product_id: int, db: Session):
    # In a real scenario, this would call an AI service
    # For now, just simulate updating the product
    print(f"Simulating AI description generation for product {product_id}")
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product and not db_product.description: # Assuming AI populates description
        # Placeholder AI description
        db_product.description = f"AI-generated description for {db_product.title}. Category: {db_product.category}. Tags: {db_product.tags}."
        db.commit()
        print(f"AI description updated for product {product_id}")

# --- Storefront Endpoints ---

@router.get("/storefront", response_model=schemas.ProductListResponse)
def read_storefront_products(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    sort_by: Optional[str] = Query("created_at"), # e.g., price_asc, price_desc, created_at
    db: Session = Depends(get_db)
):
    query = db.query(models.Product)

    # Filtering
    if category:
        query = query.filter(models.Product.category == category)
    if search:
        query = query.filter(models.Product.title.ilike(f"%{search}%"))
        # Add description search if needed: or_(models.Product.title.ilike(f"%{search}%"), models.Product.description.ilike(f"%{search}%")))

    total = query.count()

    # Sorting
    if sort_by == "price_asc":
        query = query.order_by(models.Product.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(models.Product.price.desc())
    else: # Default to newest first
        query = query.order_by(models.Product.created_at.desc())

    products = query.offset(skip).limit(limit).all()

    return schemas.ProductListResponse(
        products=[schemas.ProductPublic.model_validate(p) for p in products],
        total=total,
        page=(skip // limit) + 1,
        size=limit
    )

@router.get("/storefront/{product_id}", response_model=schemas.ProductPublic)
def read_storefront_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return schemas.ProductPublic.model_validate(db_product)

# --- Admin Endpoints (CRUD for internal management) ---

@router.post("/admin", response_model=schemas.ProductPublic, status_code=status.HTTP_201_CREATED)
def create_admin_product(product: schemas.ProductCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_product = models.Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    # Trigger AI description generation in the background
    background_tasks.add_task(trigger_ai_description, db_product.id, db)

    return schemas.ProductPublic.model_validate(db_product)

@router.get("/admin", response_model=List[schemas.ProductPublic]) # Use ProductPublic or a more detailed admin schema
def read_admin_products(skip: int = 0, limit: int = 100, status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Product)
    if status:
        query = query.filter(models.Product.status == status)
    products = query.offset(skip).limit(limit).all()
    return [schemas.ProductPublic.model_validate(p) for p in products]

@router.get("/admin/{product_id}", response_model=schemas.ProductPublic) # Use ProductPublic or a more detailed admin schema
def read_admin_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return schemas.ProductPublic.model_validate(db_product)

@router.put("/admin/{product_id}", response_model=schemas.ProductPublic)
def update_admin_product(product_id: int, product: schemas.ProductUpdate, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)
    return schemas.ProductPublic.model_validate(db_product)

@router.delete("/admin/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_admin_product(product_id: int, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    db.delete(db_product)
    db.commit()
    return None

# Placeholder for triggering Shopify sync (Keep for admin use)
@router.post("/admin/{product_id}/sync-shopify", status_code=status.HTTP_202_ACCEPTED)
def sync_product_to_shopify(product_id: int, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_product = db.query(models.Product).filter(models.Product.id == product_id).first()
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")

    # Placeholder: Add task to sync with Shopify
    # background_tasks.add_task(shopify_service.sync_product, product_id)
    print(f"Background task scheduled to sync product {product_id} to Shopify.")

    return {"message": "Shopify sync task scheduled"}

