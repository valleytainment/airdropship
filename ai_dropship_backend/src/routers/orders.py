# API Router for Orders (Storefront Checkout)

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List

# Adjust import path based on actual project structure
from src import schemas, models
from src.models import get_db

# Placeholder for service functions (e.g., payment processing, fulfillment)
# from src.services import payment_service, fulfillment_service

router = APIRouter(
    prefix="/orders",
    tags=["orders"],
    responses={404: {"description": "Not found"}},
)

@router.post("/storefront", response_model=schemas.OrderPublic, status_code=status.HTTP_201_CREATED)
def create_storefront_order(order_data: schemas.OrderCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    """
    Endpoint for the custom storefront to submit a new order.
    Handles order creation, calculates total, (simulates) payment processing,
    and triggers fulfillment.
    """
    total_amount = 0.0
    db_order_items = []

    # Validate products and calculate total amount
    for item in order_data.items:
        db_product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        # Use price from DB to prevent manipulation, could also use item.price_per_unit if needed
        item_total = db_product.price * item.quantity
        total_amount += item_total

        # Prepare OrderItem DB object
        db_order_items.append(models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_per_unit=db_product.price, # Use current price from DB
            supplier_product_id=db_product.supplier_product_id # For fulfillment
        ))
        
        # Optional: Check stock levels
        # if db_product.stock_level is not None and db_product.stock_level < item.quantity:
        #     raise HTTPException(status_code=400, detail=f"Insufficient stock for product {db_product.title}")

    # --- Simulate Payment Processing --- 
    # In a real app, you would integrate with Stripe/PayPal here using a token from the frontend
    # payment_successful = payment_service.process_payment(token=order_data.payment_token, amount=total_amount)
    # if not payment_successful:
    #     raise HTTPException(status_code=400, detail="Payment failed")
    payment_status = "paid" # Assume payment is successful for now
    payment_gateway_txn_id = f"simulated_txn_{datetime.utcnow().timestamp()}" # Placeholder
    # --- End Payment Simulation ---

    # Create the Order in the database
    db_order = models.Order(
        customer_email=order_data.customer_email,
        customer_name=order_data.customer_name,
        shipping_address=order_data.shipping_address,
        total_amount=round(total_amount, 2),
        status="processing", # Set initial status after payment
        payment_status=payment_status,
        payment_gateway_txn_id=payment_gateway_txn_id,
        items=db_order_items # Associate the items
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Optional: Update stock levels after order confirmation
    # for item in db_order.items:
    #     db.query(models.Product).filter(models.Product.id == item.product_id).update({models.Product.stock_level: models.Product.stock_level - item.quantity})
    # db.commit()

    # --- Trigger Fulfillment --- 
    # background_tasks.add_task(fulfillment_service.process_order, db_order.id)
    print(f"Background task scheduled for fulfillment of order {db_order.id}")
    # --- End Fulfillment Trigger ---

    # Need to reload the order with items and products for the response model
    # This ensures relationships are loaded correctly for OrderPublic schema
    db.refresh(db_order)
    for item in db_order.items:
        db.refresh(item)
        if item.product: # Eager load or refresh product if needed by schema
             db.refresh(item.product)

    # Return the created order details
    return schemas.OrderPublic.model_validate(db_order)

# Add other order-related endpoints if needed (e.g., get order status by ID for customer)
@router.get("/storefront/{order_id}", response_model=schemas.OrderPublic)
def get_storefront_order_status(order_id: int, db: Session = Depends(get_db)):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Ensure relationships are loaded for the response model
    db.refresh(db_order)
    for item in db_order.items:
        db.refresh(item)
        if item.product:
             db.refresh(item.product)
             
    # Add security check here: ensure the requestor owns this order (e.g., check email or session)
    # For now, returning directly
    return schemas.OrderPublic.model_validate(db_order)

