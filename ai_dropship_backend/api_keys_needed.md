# AI Dropship Backend - Required API Keys & Credentials

This document lists the external services and corresponding credentials/API keys potentially required for the full functionality of the AI Dropship backend. Refer to `env_config_guide.md` for how to configure these in the application environment.

## 1. Database Credentials

*   **Service:** Your chosen database provider (e.g., MySQL, PostgreSQL).
*   **Credentials Needed:** Hostname, Port, Database Name, Username, Password.
*   **Purpose:** Storing all application data (products, orders, suppliers, jobs).
*   **Where to get:** Provided by your database hosting service (e.g., AWS RDS, Google Cloud SQL, DigitalOcean Managed Databases, Railway, Render) or configured during local setup.

## 2. AI Model Service (Ollama / Other)

*   **Service:** Ollama (or alternative like OpenAI, Anthropic, Google AI).
*   **Credentials Needed:**
    *   **Ollama (Self-hosted/Local):** API Endpoint URL (e.g., `http://localhost:11434`). No API key is typically required for local instances.
    *   **Cloud AI Services (OpenAI, etc.):** API Key.
*   **Purpose:** Generating product descriptions, potentially pricing suggestions, and other AI tasks.
*   **Where to get:**
    *   **Ollama:** Set up according to Ollama documentation: [https://ollama.com/](https://ollama.com/)
    *   **OpenAI:** [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
    *   **(Other providers):** Refer to their specific documentation.

## 3. Web Scraping Proxy (Optional - Recommended)

*   **Service:** BrightData (or similar rotating proxy service like Oxylabs, Smartproxy).
*   **Credentials Needed:** Proxy Server Address (Host:Port), Username, Password.
*   **Purpose:** To avoid getting blocked while scraping supplier websites for product discovery and price/stock monitoring.
*   **Where to get:**
    *   **BrightData:** Sign up and create a proxy zone: [https://brightdata.com/](https://brightdata.com/)
    *   **(Other providers):** Refer to their specific documentation.

## 4. Shopify (Optional - For Deeper Integration)

*   **Service:** Shopify.
*   **Credentials Needed:** Shopify App API Key, API Password (or Admin API Access Token), Store Domain (`your-store.myshopify.com`).
*   **Purpose:** Needed if implementing direct backend-to-Shopify communication (e.g., updating fulfillment status, syncing products *from* backend *to* Shopify). The current setup primarily relies on webhooks *from* Shopify.
*   **Where to get:** Create a Custom App or Private App within your Shopify Admin dashboard:
    *   Navigate to Apps -> Develop apps for your store -> Create an app.
    *   Configure required Admin API scopes (e.g., `read_products`, `write_products`, `read_orders`, `write_orders`, `read_fulfillments`, `write_fulfillments`).
    *   Install the app to get the API credentials/token.
    *   Shopify Dev Docs: [https://shopify.dev/docs/apps/getting-started](https://shopify.dev/docs/apps/getting-started)

**Note:** Ensure you store and manage these credentials securely. Do not commit them directly into your codebase. Use environment variables as described in `env_config_guide.md`.
