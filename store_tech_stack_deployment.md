# AI Dropshipping Custom Storefront - Tech Stack & Deployment

## 1. Technology Stack Selection

Based on the project requirements, analysis of v0.dev examples, and the custom store architecture design, the following technology stack is selected:

*   **Frontend (Custom Storefront):**
    *   **Framework:** Next.js (v14+ with App Router)
        *   *Rationale:* Industry standard for production-grade React applications, excellent performance features (SSR, ISR, SSG), strong community support, aligns well with Vercel/Netlify deployment, and is the foundation for v0.dev components.
    *   **Language:** TypeScript
        *   *Rationale:* Provides static typing for improved code quality, maintainability, and developer experience, especially in larger projects.
    *   **UI Library:** shadcn/ui
        *   *Rationale:* Directly aligns with v0.dev inspiration, provides beautifully designed, accessible, and customizable components built on Radix UI and Tailwind CSS. Accelerates UI development significantly.
    *   **Styling:** Tailwind CSS
        *   *Rationale:* Utility-first CSS framework, required by shadcn/ui, enables rapid styling and responsive design.
    *   **API Communication:** Axios or native `fetch`
        *   *Rationale:* Standard libraries for making HTTP requests to the backend API.
    *   **State Management:** React Context API (for simple state) / Zustand (for more complex global state like shopping cart)
        *   *Rationale:* Lightweight and effective solutions for managing application state in React.

*   **Backend (AI Orchestrator - Existing):**
    *   **Framework:** FastAPI (Python)
        *   *Rationale:* Existing backend provides the necessary AI automation and data management capabilities. High performance, easy to use, automatic docs.
    *   **Database ORM:** SQLAlchemy
        *   *Rationale:* Existing component of the backend.

*   **Database:**
    *   **Development:** SQLite
        *   *Rationale:* Simple file-based database, easy for local development.
    *   **Production:** PostgreSQL (Managed Service Recommended)
        *   *Rationale:* Robust, scalable, and feature-rich open-source relational database suitable for production e-commerce applications.

## 2. Deployment Strategy & Targets

*   **Frontend (Next.js Storefront):**
    *   **Target Platform:** Netlify or Vercel
        *   *Rationale:* Both platforms offer seamless integration with Next.js, automated CI/CD from Git repositories, global CDN, serverless functions, and generous free tiers. Netlify was used for the previous admin dashboard deployment, providing consistency. Vercel is the creator of Next.js and offers highly optimized hosting.
    *   **Method:** Connect Git repository (e.g., GitHub) for continuous deployment.

*   **Backend (FastAPI Service):**
    *   **Target Platform:** Fly.io (Recommended) or Heroku, AWS ECS/Fargate, Google Cloud Run.
        *   *Rationale:* Fly.io allows easy deployment of containerized applications globally, close to users, with integrated features like managed databases (Postgres) and scaling. It aligns well with deploying both the Python backend and potentially the Ollama AI service.
    *   **Method:** Containerization using Docker. A `Dockerfile` will be created for the FastAPI application.

*   **Database (PostgreSQL):**
    *   **Target Platform:** Managed service like Fly Postgres (if using Fly.io), Neon, Supabase, AWS RDS, Google Cloud SQL.
        *   *Rationale:* Managed services handle backups, scaling, maintenance, and security, reducing operational overhead.

*   **AI Model (Ollama):**
    *   **Target Platform:** Fly.io (Recommended) or dedicated GPU instance on cloud providers (AWS, GCP, Azure).
        *   *Rationale:* Fly.io can deploy containerized applications, including those requiring GPU resources (check specific plan availability). Deploying close to the backend service minimizes latency.
    *   **Method:** Containerization using Docker, potentially using an official Ollama image or a custom one with required models.

## 3. Configuration

*   **Environment Variables:** Critical for managing API keys (Stripe/PayPal, Shopify Admin, AutoDS, Proxy), database connection strings, AI endpoint URLs, and the backend API URL for the frontend.
*   **Build Settings:** Configure build commands and output directories in the deployment platform settings (e.g., `pnpm build` for Next.js on Netlify/Vercel).

This selection provides a modern, performant, and scalable stack suitable for the AI-powered dropshipping storefront, leveraging existing backend components and aligning with best practices for deployment.
