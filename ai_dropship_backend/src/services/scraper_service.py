# Service for web scraping tasks using Playwright

import os
import json
from playwright.async_api import async_playwright, Playwright
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional
from datetime import datetime

# Adjust import path based on actual project structure
from src import models, schemas
from src.services import ai_service # Import AI service

# Get BrightData proxy details from environment variables
BRIGHTDATA_PROXY_SERVER = os.getenv("BRIGHTDATA_PROXY_SERVER") # e.g., brd.superproxy.io:22225
BRIGHTDATA_USERNAME = os.getenv("BRIGHTDATA_USERNAME") # e.g., brd-customer-XXXX-zone-YYYY
BRIGHTDATA_PASSWORD = os.getenv("BRIGHTDATA_PASSWORD")

async def get_browser(playwright: Playwright, use_proxy: bool = True) -> Any:
    """Launches a Chromium browser instance, optionally configured with BrightData proxy."""
    proxy_config = None
    if use_proxy and BRIGHTDATA_PROXY_SERVER and BRIGHTDATA_USERNAME and BRIGHTDATA_PASSWORD:
        proxy_config = {
            "server": BRIGHTDATA_PROXY_SERVER,
            "username": BRIGHTDATA_USERNAME,
            "password": BRIGHTDATA_PASSWORD
        }
        print("Using BrightData proxy for scraping.")
    else:
        print("Proxy not configured or disabled. Scraping without proxy.")

    try:
        # Consider adding browser launch arguments for stability/performance if needed
        # args=["--disable-gpu", "--no-sandbox"]
        browser = await playwright.chromium.launch(proxy=proxy_config)
        return browser
    except Exception as e:
        print(f"Error launching browser: {e}")
        raise

async def scrape_product_data(url: str) -> Optional[Dict[str, Any]]:
    """Scrapes product data from a given URL (Example for a generic structure)."""
    print(f"Attempting to scrape product data from: {url}")
    product_data = None
    try:
        async with async_playwright() as p:
            browser = await get_browser(p)
            if not browser:
                return None
            page = await browser.new_page()
            # Block unnecessary resources like images/css for faster scraping if needed
            # await page.route("**/*", lambda route: route.abort() if route.request.resource_type in ["image", "stylesheet", "font"] else route.continue_())

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=60000)

                # --- IMPORTANT: Selector logic needs to be adapted per supplier site --- 
                title_selector = ".product-title" # Example selector
                price_selector = ".product-price" # Example selector
                description_selector = ".product-description" # Example selector
                image_selector = ".image-view-item img" # Example selector for multiple images
                stock_selector = ".product-stock-count" # Example selector

                # Use Promise.all to wait for multiple selectors concurrently if possible
                await page.wait_for_selector(title_selector, timeout=15000)

                title = await page.locator(title_selector).first.inner_text()
                price_text = await page.locator(price_selector).first.inner_text()
                price = float("".join(filter(lambda c: c.isdigit() or c == ".", price_text)))

                description = await page.locator(description_selector).first.inner_text()

                images = []
                image_elements = await page.locator(image_selector).all()
                for img in image_elements:
                    src = await img.get_attribute("src")
                    if src:
                        if src.startswith("//"): src = "https:" + src
                        if src.startswith("http://") or src.startswith("https://"):
                           images.append(src)
                        else:
                            print(f"Skipping invalid image src: {src}")

                stock_level = None
                try:
                    stock_text = await page.locator(stock_selector).first.inner_text(timeout=5000)
                    stock_level = int("".join(filter(str.isdigit, stock_text)))
                except Exception:
                    print(f"Stock level selector 	'{stock_selector}	' not found or timed out for {url}. Assuming in stock.")
                    stock_level = 999 # Placeholder for 'in stock'

                product_data = {
                    "title": title.strip(),
                    "price": price,
                    "description": description.strip(),
                    "images": images,
                    "stock_level": stock_level,
                    "supplier_url": url
                }
                print(f"Successfully scraped data for: {url}")

            except Exception as page_error:
                print(f"Error scraping page {url}: {page_error}")
            finally:
                await browser.close()

    except Exception as e:
        print(f"General scraping error for {url}: {e}")

    return product_data

async def run_scraping_job(job_id: int, db: Session):
    """Runs a specific scraping job and triggers subsequent actions like AI enrichment."""
    job = db.query(models.ScrapingJob).filter(models.ScrapingJob.id == job_id).first()
    if not job:
        print(f"Scraping job {job_id} not found.")
        return

    job.status = "running"
    job.start_time = datetime.utcnow()
    db.commit()
    log_messages = [f"{job.start_time.isoformat()}: Starting job {job_id} ({job.job_type})."]

    try:
        if job.job_type == "product_discovery":
            # Placeholder: Get URLs to scrape based on supplier or criteria
            # TODO: Implement logic to find URLs (e.g., scrape category pages)
            urls_to_scrape = ["https://example.com/product1", "https://example.com/product2"] # Replace with actual logic
            log_messages.append(f"{datetime.utcnow().isoformat()}: Found {len(urls_to_scrape)} URLs for discovery.")

            newly_added_product_ids = []
            for url in urls_to_scrape:
                scraped_data = await scrape_product_data(url)
                if scraped_data:
                    existing_product = db.query(models.Product).filter(models.Product.supplier_url == url).first()
                    if not existing_product:
                        new_product = models.Product(
                            title=scraped_data["title"],
                            supplier_url=scraped_data["supplier_url"],
                            cost_price=scraped_data["price"],
                            images=json.dumps(scraped_data["images"]),
                            stock_level=scraped_data["stock_level"],
                            description=scraped_data["description"], 
                            status="discovered",
                            supplier_id=job.supplier_id,
                            last_scraped_at=datetime.utcnow()
                        )
                        db.add(new_product)
                        db.flush() # Assign an ID to new_product before commit
                        newly_added_product_ids.append(new_product.internal_id)
                        log_messages.append(f"{datetime.utcnow().isoformat()}: Discovered and added new product (ID: {new_product.internal_id}): {url}")
                    else:
                        log_messages.append(f"{datetime.utcnow().isoformat()}: Product already exists: {url}")
                else:
                    log_messages.append(f"{datetime.utcnow().isoformat()}: Failed to scrape: {url}")
                db.commit() # Commit after each product processing
            
            # Trigger AI description for newly added products
            if newly_added_product_ids:
                log_messages.append(f"{datetime.utcnow().isoformat()}: Triggering AI description generation for {len(newly_added_product_ids)} new products.")
                for product_id in newly_added_product_ids:
                    try:
                        await ai_service.generate_product_description(product_id, db)
                        log_messages.append(f"{datetime.utcnow().isoformat()}: AI description task started for product {product_id}.")
                    except Exception as ai_err:
                         log_messages.append(f"{datetime.utcnow().isoformat()}: Error triggering AI description for product {product_id}: {ai_err}")

        elif job.job_type == "price_stock_monitor":
            products_to_monitor = db.query(models.Product).filter(models.Product.status == "active").all()
            log_messages.append(f"{datetime.utcnow().isoformat()}: Monitoring {len(products_to_monitor)} active products.")

            for product in products_to_monitor:
                if not product.supplier_url:
                    log_messages.append(f"{datetime.utcnow().isoformat()}: Skipping product {product.internal_id} (no supplier URL).")
                    continue

                scraped_data = await scrape_product_data(product.supplier_url)
                if scraped_data:
                    updated = False
                    if product.cost_price != scraped_data["price"]:
                        log_messages.append(f"{datetime.utcnow().isoformat()}: Price change for {product.internal_id}: {product.cost_price} -> {scraped_data['price']}")
                        product.cost_price = scraped_data["price"]
                        updated = True
                    if product.stock_level != scraped_data["stock_level"]:
                        log_messages.append(f"{datetime.utcnow().isoformat()}: Stock change for {product.internal_id}: {product.stock_level} -> {scraped_data['stock_level']}")
                        product.stock_level = scraped_data["stock_level"]
                        updated = True

                    if updated:
                        product.last_scraped_at = datetime.utcnow()
                        # --- Trigger Pricing Engine Update --- 
                        try:
                            # new_price = await ai_service.suggest_retail_price(product.internal_id, db)
                            # product.current_retail_price = new_price
                            # log_messages.append(f"{datetime.utcnow().isoformat()}: Pricing engine updated retail price for {product.internal_id} to {new_price}.")
                            # --- Simulation --- 
                            log_messages.append(f"{datetime.utcnow().isoformat()}: SIMULATED: Pricing engine triggered for product {product.internal_id}.")
                            # --- End Simulation ---
                        except Exception as pricing_err:
                            log_messages.append(f"{datetime.utcnow().isoformat()}: Error triggering pricing engine for product {product.internal_id}: {pricing_err}")
                        # --- End Pricing Engine Update ---
                        db.commit()
                    else:
                         log_messages.append(f"{datetime.utcnow().isoformat()}: No changes detected for product {product.internal_id}.")
                else:
                    log_messages.append(f"{datetime.utcnow().isoformat()}: Failed to scrape monitor data for: {product.supplier_url}")
                db.commit() # Commit after each product monitoring attempt

        else:
            log_messages.append(f"{datetime.utcnow().isoformat()}: Unknown job type: {job.job_type}")

        job.status = "completed"

    except Exception as e:
        print(f"Error during scraping job {job_id}: {e}")
        log_messages.append(f"{datetime.utcnow().isoformat()}: Error: {e}")
        job.status = "failed"
    finally:
        job.end_time = datetime.utcnow()
        job.log = "\n".join(log_messages)
        db.commit()
        print(f"Scraping job {job_id} finished with status: {job.status}")

# Add functions for specific supplier scraping logic if needed

