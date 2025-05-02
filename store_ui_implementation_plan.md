# AI Dropshipping Custom Storefront - UI Implementation Plan

## 1. Overview

This plan details the implementation strategy for the custom storefront UI, based on the architecture design (`custom_store_architecture.md`), component mapping (`v0_code_mapping.md`), tech stack selection (`store_tech_stack_deployment.md`), and e-commerce best practices research. The implementation will use Next.js (App Router), TypeScript, Tailwind CSS, and shadcn/ui components.

## 2. Project Structure (Next.js App Router)

```
/src
├── app/
│   ├── (storefront)/
│   │   ├── layout.tsx            # Main storefront layout (header, footer)
│   │   ├── page.tsx              # Homepage
│   │   ├── products/
│   │   │   ├── page.tsx          # Product Listing Page (PLP)
│   │   │   └── [slug]/page.tsx   # Product Detail Page (PDP)
│   │   ├── cart/page.tsx         # Cart Page (or handled via modal/sheet)
│   │   ├── checkout/page.tsx     # Checkout Page
│   │   ├── order-confirmation/[orderId]/page.tsx # Order Confirmation
│   │   ├── (static)/
│   │   │   ├── about/page.tsx
│   │   │   └── contact/page.tsx
│   │   └── ... (other static pages like policies)
│   └── api/                    # (Optional: API routes for server actions/simple endpoints)
├── components/
│   ├── ui/                     # shadcn/ui components (generated via CLI)
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── CartSheet.tsx       # (If using sheet for cart)
│   ├── store/
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── ProductGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── QuantityInput.tsx
│   │   ├── CartItem.tsx
│   │   ├── CheckoutForm.tsx
│   │   └── ... (other custom store components)
│   └── common/
│       └── ... (shared components)
├── lib/
│   ├── apiClient.ts            # Axios/fetch wrapper for backend API calls
│   ├── utils.ts                # Utility functions (e.g., formatting)
│   └── hooks/
│       └── useCart.ts          # Custom hook for cart state management
├── styles/
│   └── globals.css             # Global styles, Tailwind directives
└── types/
    └── index.ts                # TypeScript types (Product, CartItem, Order, etc.)
```

## 3. Page Implementation Details

**General Approach:**
*   Fetch data from the FastAPI backend using `apiClient` within Server Components (for initial load) or Client Components (for dynamic updates/interactions).
*   Utilize shadcn/ui components as mapped.
*   Ensure responsiveness using Tailwind CSS classes.
*   Prioritize performance (image optimization, minimal client-side JS).
*   Implement accessibility best practices.

**a. Homepage (`/app/(storefront)/page.tsx`)**
    *   **Layout:** Use Tailwind CSS grid/flexbox for hero, featured sections.
    *   **Components:** `Button`, `ProductCard` (custom), `ProductGrid` (custom).
    *   **Data:** Fetch featured/trending products from backend API.
    *   **Best Practices:** High-quality hero image, clear CTAs, trust signals.

**b. Product Listing Page (`/app/(storefront)/products/page.tsx`)**
    *   **Layout:** Main content area with `ProductGrid`, optional sidebar/dropdown for filters.
    *   **Components:** `ProductGrid`, `ProductCard`, `Input` (search), `Checkbox`/`RadioGroup`/`Slider` (filters), `Select` (sort), `Pagination`.
    *   **Data:** Fetch products based on search/filter/sort parameters from backend API.
    *   **Best Practices:** Responsive grid, intuitive filtering/sorting, fast loading.

**c. Product Detail Page (`/app/(storefront)/products/[slug]/page.tsx`)**
    *   **Layout:** Two-column layout (gallery left, info right) on desktop, stacking on mobile.
    *   **Components:** `ProductGallery` (custom, potentially using `Carousel`), `VariantSelector` (custom, using `Select`/`RadioGroup`), `QuantityInput` (custom), `Button` (Add to Cart), `Tabs`/`Accordion` (description/details).
    *   **Data:** Fetch detailed product data (including variants, description) for the specific `slug` from backend API.
    *   **Best Practices:** High-res images, clear variant/quantity selection, compelling description, trust signals.

**d. Shopping Cart (`/components/layout/CartSheet.tsx` or `/app/(storefront)/cart/page.tsx`)**
    *   **Layout:** If sheet/dialog: use `Sheet`/`Dialog`. If page: standard page layout.
    *   **Components:** `CartItem` (custom, using `img`, text, `QuantityInput`, `Button` for remove), `Button` (Checkout).
    *   **State:** Manage cart state using `useCart` hook (React Context/Zustand).
    *   **Best Practices:** Easy access, clear summary, simple item management.

**e. Checkout Page (`/app/(storefront)/checkout/page.tsx`)**
    *   **Layout:** Single-page or multi-step form layout using `Card` sections.
    *   **Components:** `CheckoutForm` (custom, using `Input`, `Label`, `Select`), Payment Element container (for Stripe/PayPal), `Button` (Place Order).
    *   **Data:** Send order details + payment token to backend API on submission.
    *   **Best Practices:** Minimize friction, guest checkout, clear steps, secure payment integration, trust badges.

**f. Order Confirmation (`/app/(storefront)/order-confirmation/[orderId]/page.tsx`)**
    *   **Layout:** Simple confirmation message and order summary.
    *   **Components:** `Card`, text elements.
    *   **Data:** Fetch basic order details using `orderId` from backend API (or pass data from checkout).
    *   **Best Practices:** Reassuring message, clear summary, next steps (e.g., email confirmation).

## 4. State Management

*   **Cart:** Global state managed via `useCart` hook (using React Context or Zustand) to persist across pages and components.
*   **Forms:** Local component state or libraries like `react-hook-form`.
*   **Server State:** Use libraries like `react-query` or Next.js built-in caching/revalidation for managing data fetched from the API.

## 5. Backend Integration

*   Define clear API contracts between frontend and backend (using OpenAPI spec from FastAPI if possible).
*   Use `apiClient` for all requests.
*   Handle loading states and errors gracefully in the UI.

This plan provides a structured approach to building the storefront UI, leveraging the chosen tech stack and incorporating best practices for a modern e-commerce experience.
