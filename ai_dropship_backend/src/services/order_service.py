# Service for handling order processing and fulfillment logic

from sqlalchemy.orm import Session
import json

# Adjust import path based on actual project structure
from src import main as db_main, schemas
# Placeholder for other services
# from src.services import shopify_service, supplier_service # (supplier_service not created yet)

async def process_new_order_webhook(order_data: Dict[str, Any], db: Session):
    """Processes an incoming order webhook from Shopify."""
    shopify_order_id = str(order_data.get("id"))
    print(f"Processing webhook for Shopify Order ID: {shopify_order_id}")

    # Check if order already exists
    existing_order = db.query(db_main.Order).filter(db_main.Order.shopify_order_id == shopify_order_id).first()
    if existing_order:
        print(f"Order {shopify_order_id} already processed. Skipping.")
        # Optionally, update status if needed based on webhook data
        return

    # Extract necessary details (adjust based on actual Shopify webhook payload)
    customer_details = order_data.get("customer", {})
    line_items = order_data.get("line_items", [])
    total_price = float(order_data.get("total_price", 0.0))

    # Create new order record
    new_order = db_main.Order(
        shopify_order_id=shopify_order_id,
        customer_details=json.dumps(customer_details),
        items=json.dumps(line_items),
        total_revenue=total_price,
        status="received" # Initial status
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    print(f"Created new order record {new_order.internal_id} for Shopify Order {shopify_order_id}.")

    # Trigger fulfillment process (placeholder)
    await trigger_order_fulfillment(new_order.internal_id, db)

async def trigger_order_fulfillment(order_internal_id: int, db: Session):
    """Initiates the fulfillment process for an order."""
    order = db.query(db_main.Order).filter(db_main.Order.internal_id == order_internal_id).first()
    if not order or order.status != "received":
        print(f"Order {order_internal_id} not found or not in received state for fulfillment.")
        return

    print(f"Initiating fulfillment process for order {order_internal_id} (Shopify: {order.shopify_order_id}).")
    order.status = "fulfillment_pending"
    db.commit()

    # --- Fulfillment Logic Placeholder --- 
    # 1. Parse order.items (JSON)
    # 2. For each item, find the corresponding internal product and its supplier
    # 3. Group items by supplier
    # 4. For each supplier:
    #    a. Check supplier.integration_type (	"api	" or 	"scrape	")
    #    b. Call appropriate supplier_service function to place the order
    #    c. Handle success/failure, update order.status, order.supplier_order_ref, order.fulfillment_log
    # Example (pseudo-code):
    # try:
    #     supplier_order_ref = await supplier_service.place_order(supplier_id, order_items, order.customer_details)
    #     order.supplier_order_ref = supplier_order_ref
    #     order.status = "fulfillment_processing"
    #     order.fulfillment_log = "Order placed with supplier."
    # except Exception as e:
    #     order.status = "fulfillment_error"
    #     order.fulfillment_log = f"Failed to place order with supplier: {e}"
    # db.commit()
    # --- End Placeholder ---

    # Simulate fulfillment attempt
    order.status = "fulfillment_processing" # Simulate placing order
    order.fulfillment_log = "Simulated order placement with supplier."
    db.commit()
    print(f"Order {order_internal_id} status updated to fulfillment_processing (simulation).")

    # In a real scenario, another process/webhook would update tracking

async def update_tracking_info(order_internal_id: int, tracking_number: str, db: Session):
    """Updates tracking information for an order and potentially Shopify."""
    order = db.query(db_main.Order).filter(db_main.Order.internal_id == order_internal_id).first()
    if not order:
        print(f"Order {order_internal_id} not found for tracking update.")
        return

    print(f"Updating tracking for order {order_internal_id} to {tracking_number}.")
    order.tracking_number = tracking_number
    order.status = "fulfilled" # Assuming tracking means fulfilled
    order.fulfillment_log += f"\nTracking updated: {tracking_number}."
    db.commit()

    # Trigger Shopify update (placeholder)
    # await shopify_service.update_order_fulfillment(order.shopify_order_id, tracking_number)
    print(f"TODO: Trigger Shopify fulfillment update for order {order.shopify_order_id}.")


