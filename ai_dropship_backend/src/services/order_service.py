# Service for handling order processing and fulfillment logic

from sqlalchemy.orm import Session
from sqlalchemy import select
import json
from datetime import datetime

# Adjust import path based on actual project structure
from src import models, schemas
from src.models import get_db

# Placeholder for other services
# from src.services import shopify_service
# Import a hypothetical supplier service (needs creation)
# from src.services import supplier_service 

async def process_new_order_webhook(order_data: dict[str, any], db: Session):
    """Processes an incoming order webhook from Shopify."""
    shopify_order_id = str(order_data.get("id"))
    print(f"Processing webhook for Shopify Order ID: {shopify_order_id}")

    # Check if order already exists
    existing_order = db.query(models.Order).filter(models.Order.shopify_order_id == shopify_order_id).first()
    if existing_order:
        print(f"Order {shopify_order_id} already processed. Skipping.")
        # Optionally, update status if needed based on webhook data
        return

    # Extract necessary details (adjust based on actual Shopify webhook payload)
    customer_details = order_data.get("customer", {})
    line_items_data = order_data.get("line_items", [])
    total_price = float(order_data.get("total_price", 0.0))
    financial_status = order_data.get("financial_status", "pending")

    # Basic validation - only process paid orders for fulfillment trigger
    if financial_status not in ["paid", "partially_paid"]:
         print(f"Order {shopify_order_id} financial status is {financial_status}. Not triggering fulfillment yet.")
         # Still create the order record, but don't trigger fulfillment
         status = "pending_payment"
    else:
        status = "received" # Ready for fulfillment

    # Prepare OrderItem DB objects (assuming line_items have variant_id or sku)
    db_order_items = []
    calculated_total = 0.0
    for item_data in line_items_data:
        # Find internal product based on SKU or variant ID from Shopify line item
        # This requires products to be synced with Shopify IDs/SKUs
        sku = item_data.get("sku")
        variant_id_shopify = str(item_data.get("variant_id"))
        product_id_shopify = str(item_data.get("product_id"))
        
        # Attempt to find the internal product (this logic needs refinement based on sync strategy)
        # Simplistic lookup by title for now - NEEDS IMPROVEMENT
        db_product = db.query(models.Product).filter(models.Product.title == item_data.get("title")).first()
        
        if not db_product:
            print(f"Warning: Could not find internal product for Shopify item: {item_data.get('title')} (SKU: {sku}). Skipping item.")
            # Handle this case - maybe mark order as requiring manual intervention
            continue
            
        item_price = float(item_data.get("price", 0.0))
        quantity = int(item_data.get("quantity", 0))
        calculated_total += item_price * quantity

        db_order_items.append(models.OrderItem(
            product_id=db_product.internal_id,
            quantity=quantity,
            price_per_unit=item_price,
            supplier_product_ref=db_product.supplier_product_ref, # For fulfillment
            # Store shopify refs for potential future use
            shopify_line_item_id=str(item_data.get("id")),
            shopify_variant_id=variant_id_shopify,
            shopify_product_id=product_id_shopify,
        ))

    # Create new order record
    new_order = models.Order(
        shopify_order_id=shopify_order_id,
        customer_email=customer_details.get("email", "N/A"),
        customer_name=f"{customer_details.get('first_name', '')} {customer_details.get('last_name', '')}".strip(),
        shipping_address=json.dumps(order_data.get("shipping_address", {})),
        total_amount=total_price, # Use Shopify's total
        calculated_items_total=round(calculated_total, 2),
        status=status,
        payment_status=financial_status,
        fulfillment_status=order_data.get("fulfillment_status", "unfulfilled") or "unfulfilled",
        items=db_order_items
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    print(f"Created new order record {new_order.id} for Shopify Order {shopify_order_id}.")

    # Trigger fulfillment only if paid
    if status == "received":
        await trigger_order_fulfillment(new_order.id, db)

async def trigger_order_fulfillment(order_internal_id: int, db: Session):
    """Initiates the fulfillment process for an order by grouping items by supplier and calling supplier service."""
    order = db.query(models.Order).options(select(models.Order.items).select(models.OrderItem.product)).filter(models.Order.id == order_internal_id).first()
    
    if not order:
        print(f"Order {order_internal_id} not found for fulfillment.")
        return
        
    if order.status not in ["received", "fulfillment_error", "fulfillment_pending"]:
        print(f"Order {order_internal_id} status is {order.status}. Not triggering fulfillment.")
        return

    print(f"Initiating fulfillment process for order {order_internal_id} (Shopify: {order.shopify_order_id}).")
    order.status = "fulfillment_pending"
    order.fulfillment_log = f"{datetime.utcnow().isoformat()}: Fulfillment process initiated.\n"
    db.commit()

    # Group items by supplier
    items_by_supplier: dict[int, list[models.OrderItem]] = {}
    for item in order.items:
        if not item.product or not item.product.supplier_id:
            order.status = "fulfillment_error"
            order.fulfillment_log += f"{datetime.utcnow().isoformat()}: Error - Product ID {item.product_id} or its supplier is missing.\n"
            db.commit()
            print(f"Error processing order {order_internal_id}: Product {item.product_id} or supplier missing.")
            return # Stop processing this order
            
        supplier_id = item.product.supplier_id
        if supplier_id not in items_by_supplier:
            items_by_supplier[supplier_id] = []
        items_by_supplier[supplier_id].append(item)

    # Process each supplier group
    all_supplier_orders_placed = True
    for supplier_id, supplier_items in items_by_supplier.items():
        supplier = db.query(models.Supplier).filter(models.Supplier.id == supplier_id).first()
        if not supplier:
            order.status = "fulfillment_error"
            order.fulfillment_log += f"{datetime.utcnow().isoformat()}: Error - Supplier ID {supplier_id} not found.\n"
            all_supplier_orders_placed = False
            print(f"Error processing order {order_internal_id}: Supplier {supplier_id} not found.")
            continue # Process next supplier if possible, but mark order as error

        print(f"Processing {len(supplier_items)} items for supplier {supplier.name} (ID: {supplier_id}) for order {order_internal_id}.")
        
        # --- Call Hypothetical Supplier Service --- 
        try:
            # supplier_order_ref = await supplier_service.place_order(
            #     supplier=supplier,
            #     items=supplier_items, 
            #     shipping_details=json.loads(order.shipping_address), # Pass parsed shipping details
            #     order_ref=f"AI_DS_{order.id}" # Internal reference
            # )
            
            # --- Simulation --- 
            supplier_order_ref = f"SIM_{supplier_id}_{order.id}_{datetime.utcnow().timestamp()}"
            print(f"SIMULATED: Placed order with {supplier.name}. Ref: {supplier_order_ref}")
            # --- End Simulation ---
            
            order.supplier_order_ref = (order.supplier_order_ref or "") + f"{supplier.name}:{supplier_order_ref};"
            order.fulfillment_log += f"{datetime.utcnow().isoformat()}: Order placed successfully with supplier {supplier.name}. Ref: {supplier_order_ref}\n"

        except Exception as e:
            print(f"Error placing order with supplier {supplier.name} for order {order_internal_id}: {e}")
            order.status = "fulfillment_error"
            order.fulfillment_log += f"{datetime.utcnow().isoformat()}: Error placing order with supplier {supplier.name}: {e}\n"
            all_supplier_orders_placed = False
            # Continue to next supplier if any
            
    # Update final order status
    if all_supplier_orders_placed and order.status != "fulfillment_error":
        order.status = "fulfillment_processing"
        order.fulfillment_log += f"{datetime.utcnow().isoformat()}: All supplier orders placed successfully.\n"
        print(f"Order {order_internal_id} status updated to fulfillment_processing.")
    else:
         print(f"Order {order_internal_id} encountered errors during fulfillment placement.")
         # Status is already set to fulfillment_error if any part failed

    db.commit()

async def update_tracking_info(order_internal_id: int, tracking_number: str, db: Session):
    """Updates tracking information for an order and potentially Shopify."""
    order = db.query(models.Order).filter(models.Order.id == order_internal_id).first()
    if not order:
        print(f"Order {order_internal_id} not found for tracking update.")
        return

    print(f"Updating tracking for order {order_internal_id} to {tracking_number}.")
    order.tracking_number = (order.tracking_number or "") + f"{tracking_number};"
    order.status = "fulfilled" # Assuming tracking means fulfilled
    order.fulfillment_status = "fulfilled"
    order.fulfillment_log += f"\n{datetime.utcnow().isoformat()}: Tracking updated: {tracking_number}."
    db.commit()

    # Trigger Shopify update (placeholder)
    # await shopify_service.update_order_fulfillment(order.shopify_order_id, tracking_number)
    print(f"TODO: Trigger Shopify fulfillment update for order {order.shopify_order_id}.")

# Function called by the /orders/storefront endpoint
async def create_and_process_storefront_order(order_data: schemas.OrderCreate, db: Session):
    """Creates an order from storefront data and triggers fulfillment."""
    total_amount = 0.0
    db_order_items = []

    # Validate products and calculate total amount
    for item in order_data.items:
        db_product = db.query(models.Product).filter(models.Product.internal_id == item.product_id).first()
        if not db_product:
            raise HTTPException(status_code=404, detail=f"Product with id {item.product_id} not found")
        
        item_total = db_product.current_retail_price * item.quantity # Use current price
        total_amount += item_total

        db_order_items.append(models.OrderItem(
            product_id=item.product_id,
            quantity=item.quantity,
            price_per_unit=db_product.current_retail_price, 
            supplier_product_ref=db_product.supplier_product_ref
        ))

    # --- Simulate Payment Processing --- 
    payment_status = "paid" 
    payment_gateway_txn_id = f"simulated_storefront_txn_{datetime.utcnow().timestamp()}"
    # --- End Payment Simulation ---

    # Create the Order in the database
    db_order = models.Order(
        customer_email=order_data.customer_email,
        customer_name=order_data.customer_name,
        shipping_address=order_data.shipping_address, # Store as plain text from checkout
        total_amount=round(total_amount, 2), # Use calculated total
        status="received", # Set initial status after payment
        payment_status=payment_status,
        payment_gateway_txn_id=payment_gateway_txn_id,
        fulfillment_status="unfulfilled",
        items=db_order_items 
    )

    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # --- Trigger Fulfillment --- 
    await trigger_order_fulfillment(db_order.id, db)
    # --- End Fulfillment Trigger ---

    # Reload the order with items and products for the response model
    db.refresh(db_order)
    for item in db_order.items:
        db.refresh(item)
        if item.product: 
             db.refresh(item.product)

    return db_order


