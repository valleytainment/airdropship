# AI Dropship Backend - Environment Configuration Guide

This document outlines the necessary environment variables required to run the AI Dropship backend application.

## Database Configuration

*   `DATABASE_URL`: The connection string for your database. The application is currently configured for MySQL using `pymysql`.
    *   **Format:** `mysql+pymysql://<DB_USERNAME>:<DB_PASSWORD>@<DB_HOST>:<DB_PORT>/<DB_NAME>`
    *   **Example:** `mysql+pymysql://admin:secretpassword@db.example.com:3306/airdropship_db`
    *   **Note:** Ensure the database specified (`<DB_NAME>`) exists before starting the application. The application uses SQLAlchemy and will create the necessary tables based on the models defined in `src/models.py`.

*   `DB_USERNAME`: (Optional, if using individual components instead of `DATABASE_URL`) Database username.
*   `DB_PASSWORD`: (Optional, if using individual components instead of `DATABASE_URL`) Database password.
*   `DB_HOST`: (Optional, if using individual components instead of `DATABASE_URL`) Database host address.
*   `DB_PORT`: (Optional, if using individual components instead of `DATABASE_URL`) Database port (default: `3306` for MySQL).
*   `DB_NAME`: (Optional, if using individual components instead of `DATABASE_URL`) Database name.

## AI Service Configuration (Ollama)

*   `OLLAMA_ENDPOINT`: The base URL for your Ollama API instance (used for generating product descriptions).
    *   **Default:** `http://localhost:11434`
    *   **Example (if running Ollama in another Docker container on the same network):** `http://ollama:11434`
    *   **Example (if using a remote Ollama service):** `https://your-ollama-service.com`
*   `OLLAMA_MODEL`: The specific Ollama model to use for generation.
    *   **Default:** `mistral:7b`
    *   **Note:** Ensure this model is available on your Ollama instance.

## Scraping Service Configuration (BrightData Proxy - Optional)

These are only required if you intend to use BrightData (or a similar rotating proxy service) for web scraping to avoid IP blocks.

*   `BRIGHTDATA_PROXY_SERVER`: The proxy server address and port provided by BrightData.
    *   **Example:** `brd.superproxy.io:22225`
*   `BRIGHTDATA_USERNAME`: Your BrightData proxy zone username.
    *   **Example:** `brd-customer-XXXX-zone-YYYY`
*   `BRIGHTDATA_PASSWORD`: Your BrightData proxy zone password.

## Shopify Integration (Optional)

These would be needed if you implement direct Shopify API interactions from the backend (e.g., for syncing fulfillment status back to Shopify). Currently, the integration is primarily via webhooks received *from* Shopify, but future enhancements might require these.

*   `SHOPIFY_API_KEY`: Your Shopify App's API Key.
*   `SHOPIFY_API_PASSWORD`: Your Shopify App's API Password (or Access Token).
*   `SHOPIFY_STORE_DOMAIN`: Your Shopify store's domain.
    *   **Example:** `your-store-name.myshopify.com`
*   `SHOPIFY_API_VERSION`: The Shopify API version you are targeting.
    *   **Example:** `2024-04`

## General Application Settings

*   `SECRET_KEY`: A secret key used for security purposes (e.g., signing tokens if JWT authentication is added later). Generate a strong random string.
    *   **Example:** `openssl rand -hex 32`
*   `CORS_ORIGINS`: A comma-separated list of allowed origins for Cross-Origin Resource Sharing (CORS). You **must** include your Netlify frontend URL here.
    *   **Example:** `https://astonishing-bavarois-368523.netlify.app,http://localhost:3000`

## Setting Environment Variables

How you set these variables depends on your deployment environment:

*   **Docker:** Use the `-e` flag or a `.env` file with `docker run` or `docker-compose`.
*   **Hosting Platforms (Fly.io, Render, Heroku, etc.):** Use the platform's dashboard or CLI to set secrets/environment variables.
*   **Local Development:** Create a `.env` file in the `ai_dropship_backend` directory and list the variables there (e.g., `DATABASE_URL=your_db_string`). The application uses `python-dotenv` to load this file automatically when run locally (but not typically in production containers).

