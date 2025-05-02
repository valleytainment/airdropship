# AI Dropshipping Website - Tech Stack & Deployment Strategy

This document details the selected technology stack and deployment strategy for the AI dropshipping website, based on the architecture design and project goals.

## 1. Technology Stack Selection

*   **Admin Dashboard Frontend:**
    *   **Technology:** Next.js (React framework)
    *   **UI Libraries:** Tailwind CSS, shadcn/ui, Lucide Icons (Leveraging the `create_nextjs_app` template)
    *   **Rationale:** Provides a modern, component-based structure suitable for a complex dashboard. Offers features like routing and potential for server-side rendering if needed. Aligns with the "futuristic" UI goal and available templates.

*   **Backend Service (AI Orchestrator):**
    *   **Technology:** Python 3.11+ with FastAPI
    *   **Key Libraries:** `uvicorn` (ASGI server), `playwright` (scraping), `httpx` or `requests` (API calls), `sqlalchemy` or `sqlite3` (DB interaction), `ollama` (AI integration), `python-dotenv` (config), `apscheduler` or similar (task scheduling).
    *   **Rationale:** FastAPI offers high performance and asynchronous capabilities, ideal for handling API requests, background tasks (scraping, updates), and I/O-bound operations. Python has a rich ecosystem for AI, web scraping, and data handling.

*   **Database:**
    *   **Technology:** SQLite (initially)
    *   **Rationale:** Simple, file-based, zero-configuration, easy integration with Python. Suitable for initial development and deployment on Fly.io's free tier with persistent volumes. A clear migration path to PostgreSQL will be kept in mind for future scaling.

*   **AI - Content Generation:**
    *   **Technology:** Ollama running Mistral 7B (or a similar capable model)
    *   **Rationale:** Cost-effective self-hosted solution for generating product titles and descriptions. Integrates via a simple API call from the FastAPI backend.

*   **Web Scraping:**
    *   **Technology:** Playwright (Python library) + BrightData Proxy Service
    *   **Rationale:** Playwright provides robust browser automation for scraping complex sites. BrightData offers reliable rotating proxies essential for avoiding IP blocks during frequent scraping.

*   **Customer Storefront:**
    *   **Technology:** Shopify
    *   **Rationale:** As specified in requirements and resources. Provides a mature, feature-rich e-commerce platform with necessary APIs and webhooks.

## 2. Deployment Strategy

*   **Admin Dashboard Frontend (Next.js):**
    *   **Platform:** Netlify
    *   **Method:** Continuous Deployment via Git repository integration. Netlify handles build and deployment automatically on code pushes.
    *   **Rationale:** User preference, excellent support for Next.js, generous free tier, easy setup.

*   **Backend Service (FastAPI + SQLite):**
    *   **Platform:** Fly.io
    *   **Method:** Containerize the FastAPI application using Docker. Deploy the container image to Fly.io. Configure a persistent volume (`fly volumes create ...`) attached to the application for storing the SQLite database file.
    *   **Rationale:** Fly.io's free tier includes VMs and persistent volumes, suitable for hosting the backend and database cost-effectively. Docker provides environment consistency.

*   **AI Model (Ollama):**
    *   **Platform:** Fly.io
    *   **Method:** Deploy Ollama using its official Docker image (or a custom one) on a separate Fly.io VM. The FastAPI backend will communicate with this service via its internal Fly.io network address.
    *   **Rationale:** Keeps the AI model separate for resource management. Fly.io allows easy deployment of Docker containers.

*   **Shopify Storefront:**
    *   **Platform:** Shopify
    *   **Method:** Hosted directly by Shopify.
    *   **Rationale:** Standard Shopify hosting.

## 3. Project Setup Notes

*   The Admin Dashboard will be initialized using the `create_nextjs_app` command.
*   The Backend Service (FastAPI) project structure will be created manually, following best practices for FastAPI applications (e.g., separating routes, models, services). It will *not* use the `create_flask_app` template as Flask is not the chosen framework.
*   A Dockerfile will be created for the FastAPI backend service.
*   A separate Docker setup (likely using the official Ollama image) will be configured for Fly.io deployment.

This stack and strategy provide a balance of performance, cost-effectiveness, scalability, and alignment with modern development practices and the project's specific requirements.
