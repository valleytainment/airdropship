# AI Dropshipping Website - Architecture & Feature Design

This document outlines the proposed architecture and key features for the fully automated AI dropshipping website, incorporating insights from resource analysis and best practices research, with a focus on rapid profitability and automation.

## 1. System Architecture

The system will consist of several interconnected components:

1.  **Shopify Storefront:** The customer-facing e-commerce platform. Handles product display, cart, checkout, and payments. Provides APIs and webhooks for integration.
2.  **Admin Dashboard (Frontend):** A custom-built web application (React/Next.js) serving as the central control panel for the dropshipping operations. Hosted on Netlify/Vercel.
3.  **Backend Service (AI Orchestrator):** A Python application built with FastAPI. This is the core engine handling automation, AI tasks, data processing, and integrations. Hosted on Fly.io.
4.  **Database:** Initially SQLite for simplicity and cost-effectiveness (fits Fly.io free tier), with a clear path for migration to PostgreSQL if scaling requires it. Stores operational data like product details, supplier info, pricing rules, and logs.
5.  **AI Models:** Primarily a locally hosted LLM (e.g., Ollama with Mistral 7B) for cost-effective content generation (titles, descriptions). Custom Python logic within the backend service will handle specific AI tasks like dynamic pricing algorithms and basic demand forecasting.
6.  **External Services & APIs:**
    *   **Shopify Admin API:** For product management, order retrieval, fulfillment updates.
    *   **Supplier APIs/Websites:** For product sourcing, order placement, and tracking (requires robust handling for both API and non-API suppliers via scraping).
    *   **Proxy Service (BrightData):** Used by the backend for reliable web scraping (product discovery, price/stock monitoring) while avoiding blocks.
    *   **POD Service API (Printful):** For managing print-on-demand products.
    *   **(Optional) Ads Intelligence APIs:** (e.g., Facebook Ads Library API, BigSpy/AdSpy) for competitive analysis.

```mermaid
graph TD
    A[Admin User] --> B(Admin Dashboard - Next.js @ Netlify);
    C[Customer] --> D(Shopify Storefront);
    B --> E{Backend Service - FastAPI @ Fly.io};
    D -- Webhooks/API --> E;
    E -- API --> D;
    E --> F[Database - SQLite/PostgreSQL @ Fly.io];
    E --> G[Local LLM - Ollama/Mistral];
    E --> H(Proxy Service - BrightData);
    E -- Scraping via Proxy --> I[Supplier Websites];
    E -- API --> J[Supplier APIs];
    E -- API --> K[POD API - Printful];
    E -- API --> L[(Optional) Ads Spy APIs];

    subgraph Backend Infrastructure
        E
        F
        G
    end

    subgraph External Services
        D
        H
        I
        J
        K
        L
    end
```

## 2. Core Features

Features are designed for automation and profitability, managed primarily through the Admin Dashboard.

### 2.1. Admin Dashboard Modules

*   **Dashboard Overview:** Key metrics (e.g., orders today, revenue, profit estimate), pending tasks, system status alerts.
*   **Product Research & Discovery:**
    *   Initiate scraping jobs for specific niches/suppliers.
    *   View discovered products: supplier data, estimated cost, potential retail price, profit margin analysis, sales velocity indicators (if available).
    *   Filter/sort/search discovered products.
    *   One-click import to internal DB, triggering AI content generation.
*   **Product Management:**
    *   View/edit products stored internally (title, description, images, variants, supplier info, cost).
    *   Review/edit AI-generated content.
    *   Set pricing rules (see below).
    *   Push/sync products to Shopify store.
    *   View Shopify sync status.
*   **Pricing & Stock Automation:**
    *   Dashboard showing current prices, costs, stock levels, and recent changes.
    *   Configure global and product-specific pricing rules (e.g., `cost * 1.5 + 2`, maintain 30% margin, match lowest competitor + $0.50).
    *   Enable/disable dynamic pricing adjustments based on rules.
    *   Set up A/B price testing parameters.
    *   View logs of automated price/stock updates.
    *   Manual price/stock override capabilities.
*   **Order Management & Fulfillment:**
    *   View incoming orders from Shopify (real-time via webhooks).
    *   Monitor automated fulfillment status (Pending -> Processing -> Fulfilled/Error).
    *   View fulfillment details (supplier order ID, tracking number, logs).
    *   Manual intervention tools for failed orders (e.g., retry fulfillment, update details).
*   **Supplier Integration Management:**
    *   Add/edit supplier details (name, website, API credentials/type).
    *   Configure scraping parameters for non-API suppliers.
    *   Test supplier connections/automation.
*   **POD Management (Printful):**
    *   Connect Printful account.
    *   Browse/select POD products.
    *   Upload designs.
    *   Configure pricing and push POD products to Shopify.
*   **Settings:**
    *   Manage API keys (Shopify, BrightData, Printful, etc.).
    *   Configure AI model settings (Ollama endpoint, prompts).
    *   Set notification preferences (e.g., low stock alerts, fulfillment errors).
*   **(Basic) Analytics:**
    *   Reports on sales, costs, estimated profit (data pulled/calculated from Shopify and internal DB).
    *   View top-performing products.

### 2.2. Backend Automation Services

*   **Product Scraper:** Periodically scrapes supplier sites/APIs for new products, price changes, and stock updates using Playwright and BrightData.
*   **AI Content Generator:** Uses Ollama/Mistral (or other configured LLM) to generate product titles and descriptions upon import.
*   **Pricing Engine:** Applies configured rules to calculate retail prices and triggers updates to Shopify via the API based on cost/stock changes.
*   **Order Fulfillment Bot:** Listens for new order webhooks from Shopify, identifies the supplier, and places the order via API or web automation.
*   **Tracking Updater:** Periodically checks suppliers (API/scraping) for tracking numbers for placed orders and updates Shopify.
*   **Shopify Sync Service:** Ensures product details (price, stock, description) are consistent between the internal database and the Shopify store.
*   **Task Scheduler:** Manages the timing and execution of recurring tasks (scraping, updates) using background task capabilities (e.g., FastAPI's BackgroundTasks or potentially Celery for more complex needs).

## 3. Data Models (Conceptual)

*   **Product:** `internal_id`, `shopify_product_id`, `supplier_id`, `supplier_product_ref`, `title`, `description`, `ai_description`, `images` (JSON/Text), `variants` (JSON), `supplier_url`, `cost_price`, `current_retail_price`, `pricing_rule_id`, `stock_level`, `status` (e.g., `discovered`, `imported`, `active`, `inactive`), `last_scraped_at`, `created_at`, `updated_at`.
*   **Supplier:** `id`, `name`, `website`, `api_details` (JSON, encrypted), `integration_type` (`api`, `scrape`), `notes`.
*   **Order:** `internal_id`, `shopify_order_id`, `customer_details` (JSON), `items` (JSON), `total_cost`, `total_revenue`, `status` (e.g., `received`, `fulfillment_pending`, `fulfillment_processing`, `fulfilled`, `error`), `supplier_order_ref`, `tracking_number`, `fulfillment_log` (Text), `created_at`, `updated_at`.
*   **PricingRule:** `id`, `name`, `rule_type` (`margin_percentage`, `margin_fixed`, `fixed_price`), `parameters` (JSON), `is_global` (Boolean), `created_at`, `updated_at`.
*   **ScrapingJob:** `id`, `job_type` (`product_discovery`, `price_stock_monitor`), `supplier_id` (optional), `status` (`pending`, `running`, `completed`, `failed`), `start_time`, `end_time`, `log` (Text).

## 4. Next Steps

*   Refine technology choices within this architecture (specific libraries, database choice confirmation).
*   Plan the detailed UI layout and components for the Admin Dashboard.
*   Begin implementation of core backend services and database schema.
