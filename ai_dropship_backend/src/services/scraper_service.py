# Service for web scraping tasks using Playwright

import os
import json
from playwright.async_api import async_playwright, Playwright
from sqlalchemy.orm import Session
from typing import Dict, Any, Optional

# Adjust import path based on actual project structure
from src import main as db_main, schemas

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

            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=60000) # Increased timeout

                # --- IMPORTANT: Selector logic needs to be adapted per supplier site --- 
                # This is a generic placeholder example
                title_selector = ".product-title" # Example selector
                price_selector = ".product-price" # Example selector
                description_selector = ".product-description" # Example selector
                image_selector = ".image-view-item img" # Example selector for multiple images
                stock_selector = ".product-stock-count" # Example selector

                await page.wait_for_selector(title_selector, timeout=15000) # Wait for title

                title = await page.inner_text(title_selector)
                price_text = await page.inner_text(price_selector)
                # Basic price cleaning - enhance as needed
                price = float("".join(filter(lambda c: c.isdigit() or c == ".", price_text)))

                description = await page.inner_text(description_selector)

                images = []
                image_elements = await page.query_selector_all(image_selector)
                for img in image_elements:
                    src = await img.get_attribute("src")
                    if src:
                        # Basic check for valid URL format
                        if src.startswith("http://") or src.startswith("https://") or src.startswith("//"):
                           if src.startswith("//"): # Handle protocol-relative URLs
                               src = "https:" + src
                           images.append(src)
                        else:
                            print(f"Skipping invalid image src: {src}")

                stock_level = None
                try:
                    stock_text = await page.inner_text(stock_selector, timeout=5000) # Shorter timeout for optional element
                    stock_level = int("".join(filter(str.isdigit, stock_text)))
                except Exception:
                    print(f"Stock level selector 	'{stock_selector}	' not found or timed out for {url}. Assuming in stock.")
                    # Decide default behavior: None, 0, or a high number? Assume available if not found.
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
                # Consider saving page source or screenshot for debugging
                # await page.screenshot(path=f"/home/ubuntu/error_{datetime.now().isoformat()}.png")
            finally:
                await browser.close()

    except Exception as e:
        print(f"General scraping error for {url}: {e}")

    return product_data

async def run_scraping_job(job_id: int, db: Session):
    """Runs a specific scraping job (e.g., product discovery or price monitoring)."""
    job = db.query(db_main.ScrapingJob).filter(db_main.ScrapingJob.id == job_id).first()
    if not job:
        print(f"Scraping job {job_id} not found.")
        return

    job.status = "running"
    job.start_time = db_main.func.now()
    db.commit()
    log_messages = [f"Starting job {job_id} ({job.job_type})."]

    try:
        if job.job_type == "product_discovery":
            # Placeholder: Get URLs to scrape based on supplier or criteria
            urls_to_scrape = ["https://example.com/product1", "https://example.com/product2"] # Replace with actual logic
            log_messages.append(f"Found {len(urls_to_scrape)} URLs for discovery.")

            for url in urls_to_scrape:
                scraped_data = await scrape_product_data(url)
                if scraped_data:
                    # Check if product already exists (based on URL or other identifier)
                    existing_product = db.query(db_main.Product).filter(db_main.Product.supplier_url == url).first()
                    if not existing_product:
                        # Create new product in 'discovered' state
                        new_product = db_main.Product(
                            title=scraped_data["title"],
                            supplier_url=scraped_data["supplier_url"],
                            cost_price=scraped_data["price"],
                            images=json.dumps(scraped_data["images"]),
                            stock_level=scraped_data["stock_level"],
                            description=scraped_data["description"], # Initial description from scrape
                            status="discovered",
                            supplier_id=job.supplier_id # Associate with the supplier if provided
                        )
                        db.add(new_product)
                        log_messages.append(f"Discovered and added new product: {url}")
                    else:
                        log_messages.append(f"Product already exists: {url}")
                else:
                    log_messages.append(f"Failed to scrape: {url}")
                db.commit() # Commit after each product

        elif job.job_type == "price_stock_monitor":
            # Get products to monitor (e.g., all active products or specific supplier)
            products_to_monitor = db.query(db_main.Product).filter(db_main.Product.status == "active").all()
            log_messages.append(f"Monitoring {len(products_to_monitor)} active products.")

            for product in products_to_monitor:
                if not product.supplier_url:
                    log_messages.append(f"Skipping product {product.internal_id} (no supplier URL).")
                    continue

                scraped_data = await scrape_product_data(product.supplier_url)
                if scraped_data:
                    updated = False
                    if product.cost_price != scraped_data["price"]:
                        log_messages.append(f"Price change for {product.internal_id}: {product.cost_price} -> {scraped_data['price']}")
                        product.cost_price = scraped_data["price"]
                        updated = True
                    if product.stock_level != scraped_data["stock_level"]:
                        log_messages.append(f"Stock change for {product.internal_id}: {product.stock_level} -> {scraped_data['stock_level']}")
                        product.stock_level = scraped_data["stock_level"]
                        updated = True

                    if updated:
                        product.last_scraped_at = db_main.func.now()
                        # Trigger pricing engine update (placeholder)
                        print(f"TODO: Trigger pricing engine for product {product.internal_id}")
                        db.commit()
                    else:
                         log_messages.append(f"No changes detected for product {product.internal_id}.")
                else:
                    log_messages.append(f"Failed to scrape monitor data for: {product.supplier_url}")

        else:
            log_messages.append(f"Unknown job type: {job.job_type}")

        job.status = "completed"

    except Exception as e:
        print(f"Error during scraping job {job_id}: {e}")
        log_messages.append(f"Error: {e}")
        job.status = "failed"
    finally:
        job.end_time = db_main.func.now()
        job.log = "\n".join(log_messages)
        db.commit()
        print(f"Scraping job {job_id} finished with status: {job.status}")

# Add functions for specific supplier scraping logic if needed

