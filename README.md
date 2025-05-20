# Airdropship

A modern dropshipping platform built with Next.js, FastAPI, and CJ Dropshipping integration.

## Project Structure

This is a monorepo containing both frontend and backend components:

- `ai_dropship_frontend/`: Next.js frontend application
- `ai_dropship_backend/`: FastAPI backend application

## Getting Started

### Prerequisites

- Node.js 20.x or later
- PNPM 8.15.9 or later
- Python 3.11 or later
- Git

### Local Development Setup

#### Frontend

```bash
# Navigate to the frontend directory
cd ai_dropship_frontend

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The frontend will be available at http://localhost:3000.

#### Backend

```bash
# Navigate to the backend directory
cd ai_dropship_backend

# Create a virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the development server
uvicorn ai_dropship_backend.main:app --reload
```

The backend will be available at http://localhost:8000, with API documentation at http://localhost:8000/docs.

## Environment Variables

### Frontend Environment Variables

Create a `.env.local` file in the `ai_dropship_frontend` directory with the following variables:

```
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000

# Stripe Configuration
NEXT_PUBLIC_STRIPE_KEY=pk_test_your_stripe_publishable_key

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
NEXT_PUBLIC_META_PIXEL_ID=XXXXXXXXXX
NEXT_PUBLIC_TIKTOK_PIXEL_ID=XXXXXXXXXX
```

### Backend Environment Variables

Create a `.env` file in the `ai_dropship_backend` directory with the following variables:

```
# Database Configuration
DATABASE_URL=sqlite:///dropship.db

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# CJ Dropshipping Configuration
CJ_EMAIL=your_cj_email@example.com
CJ_API_KEY=your_cj_api_key

# Frontend URL (for CORS and redirects)
FRONTEND_BASE_URL=http://localhost:3000
```

## Deployment

### Frontend Deployment (Netlify)

The frontend is configured for deployment on Netlify. The `netlify.toml` file in the repository root contains the necessary configuration.

1. Connect your GitHub repository to Netlify
2. Configure the environment variables in the Netlify dashboard
3. Deploy using the Netlify UI or CLI

### Backend Deployment (Render)

The backend is designed to be deployed on Render.

1. Create a new Web Service in Render
2. Connect to your GitHub repository
3. Set the build command: `pip install -r requirements.txt`
4. Set the start command: `uvicorn ai_dropship_backend.main:app --host 0.0.0.0 --port $PORT`
5. Configure the environment variables in the Render dashboard

## Features

- Product catalog with CJ Dropshipping integration
- Shopping cart with Stripe Checkout
- Order management and fulfillment
- Responsive design for mobile and desktop

## Development Workflow

### Git Workflow

The repository is set up with GitHub Actions for CI and Husky for pre-commit hooks.

- Pull requests to `main` will trigger CI checks
- Pre-commit hooks ensure code quality before commits

### Running Tests

```bash
# Frontend tests
cd ai_dropship_frontend
pnpm test

# Backend tests
cd ai_dropship_backend
pytest
```

## License

This project is proprietary and confidential.
