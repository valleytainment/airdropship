# API Router for Suppliers

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
import json # Import json for handling api_details

# Adjust import path based on actual project structure
from src import schemas, main as db_main # Use db_main to avoid naming conflict

router = APIRouter(
    prefix="/suppliers",
    tags=["suppliers"],
    responses={404: {"description": "Not found"}},
)

# Dependency to get DB session (re-importing for clarity)
def get_db():
    db = db_main.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Supplier, status_code=status.HTTP_201_CREATED)
def create_supplier(supplier: schemas.SupplierCreate, db: Session = Depends(get_db)):
    db_supplier = db_main.Supplier(
        name=supplier.name,
        website=str(supplier.website) if supplier.website else None,
        integration_type=supplier.integration_type,
        # Store api_details as JSON string in the database
        api_details=json.dumps(supplier.api_details) if supplier.api_details else None,
        notes=supplier.notes
    )
    db.add(db_supplier)
    db.commit()
    db.refresh(db_supplier)
    # Convert api_details back to dict for response model
    if db_supplier.api_details:
        try:
            db_supplier.api_details = json.loads(db_supplier.api_details)
        except json.JSONDecodeError:
            db_supplier.api_details = {} # Handle potential decode error
    return db_supplier

@router.get("/", response_model=List[schemas.Supplier])
def read_suppliers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    suppliers = db.query(db_main.Supplier).offset(skip).limit(limit).all()
    # Convert api_details back to dict for response model
    for sup in suppliers:
        if sup.api_details:
            try:
                sup.api_details = json.loads(sup.api_details)
            except json.JSONDecodeError:
                sup.api_details = {}
    return suppliers

@router.get("/{supplier_id}", response_model=schemas.Supplier)
def read_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(db_main.Supplier).filter(db_main.Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    # Convert api_details back to dict for response model
    if db_supplier.api_details:
        try:
            db_supplier.api_details = json.loads(db_supplier.api_details)
        except json.JSONDecodeError:
            db_supplier.api_details = {}
    return db_supplier

@router.put("/{supplier_id}", response_model=schemas.Supplier)
def update_supplier(supplier_id: int, supplier: schemas.SupplierUpdate, db: Session = Depends(get_db)):
    db_supplier = db.query(db_main.Supplier).filter(db_main.Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")

    update_data = supplier.model_dump(exclude_unset=True) # Use model_dump for Pydantic v2

    # Handle api_details specifically: convert dict to JSON string for DB
    if "api_details" in update_data and update_data["api_details"] is not None:
        update_data["api_details"] = json.dumps(update_data["api_details"])
    elif "api_details" in update_data and update_data["api_details"] is None:
         update_data["api_details"] = None # Allow setting to null

    for key, value in update_data.items():
        # Handle HttpUrl conversion to string if necessary
        if key == "website" and value is not None:
             setattr(db_supplier, key, str(value))
        else:
             setattr(db_supplier, key, value)

    db.commit()
    db.refresh(db_supplier)
    # Convert api_details back to dict for response model
    if db_supplier.api_details:
        try:
            db_supplier.api_details = json.loads(db_supplier.api_details)
        except json.JSONDecodeError:
            db_supplier.api_details = {}
    return db_supplier

@router.delete("/{supplier_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_supplier(supplier_id: int, db: Session = Depends(get_db)):
    db_supplier = db.query(db_main.Supplier).filter(db_main.Supplier.id == supplier_id).first()
    if db_supplier is None:
        raise HTTPException(status_code=404, detail="Supplier not found")
    db.delete(db_supplier)
    db.commit()
    return None

