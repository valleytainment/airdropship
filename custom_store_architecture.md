# AI Dropshipping Custom Storefront - Architecture & Feature Design

## 1. Overview

This document outlines the architecture and feature set for the custom e-commerce storefront for the AI-powered dropshipping system. This storefront will replace the need for a platform like Shopify for the customer-facing interface, directly interacting with the previously developed FastAPI backend to display AI-discovered products and manage the customer purchase journey.

## 2. Architecture

The proposed architecture consists of:

1.  **Custom Storefront (Frontend):**
    *   **Technology:** Next.js (React framework), leveraging TypeScript, Tailwind CSS, and shadcn/ui components (inspired by v0.dev examples).
    *   **Responsibilities:**
        *   Displaying product information fetched from the backend API.
        *   Providing user interface for browsing, searching, viewing products, managing the cart, and completing checkout.
        *   Handling user interactions and client-side state.
        *   Communicating with the backend API for data retrieval and order submission.
    *   **Deployment:** Netlify / Vercel (or user preference).

2.  **AI Dropshipping Backend (Existing):**
    *   **Technology:** FastAPI (Python).
    *   **Responsibilities:**
        *   AI-driven product discovery and management.
        *   Storing product data, supplier information, pricing rules.
        *   Providing API endpoints for the frontend to fetch products, submit orders, etc.
        *   Automated order fulfillment integration (e.g., via AutoDS API).
        *   Managing admin tasks via the separate admin dashboard (previously developed).
    *   **Deployment:** Fly.io / Heroku / AWS (or user preference).

3.  **Database (Existing):**
    *   **Technology:** PostgreSQL (recommended for production) or SQLite (for development).
    *   **Responsibilities:** Storing product details, orders, user data (if accounts are implemented), etc.

4.  **External Services:**
    *   **Payment Gateway:** Stripe / PayPal (to be integrated directly into the custom checkout flow).
    *   **Supplier APIs/Websites:** Accessed by the backend for product info and order fulfillment.
    *   **AI Models:** Accessed by the backend.

**Interaction Flow:**
*   Frontend fetches product data from the Backend API.
*   User adds items to the cart (managed client-side or server-side via API).
*   User proceeds to checkout; Frontend collects details and sends order information + payment token (from Stripe/PayPal) to the Backend API.
*   Backend API validates the order, processes payment via the gateway API, stores the order, and triggers the fulfillment process (e.g., calling AutoDS).
*   Backend API provides order status updates to the frontend (if implemented).

## 3. Key Storefront Features

Based on the blueprint and e-commerce best practices:

*   **Homepage:**
    *   Visually appealing hero section (using high-quality imagery/video).
    *   Featured products/collections (e.g., "Trending Now" sourced from AI backend).
    *   Clear calls-to-action (CTAs).
    *   Trust signals (e.g., security badges, brief policy highlights).
    *   Simple header navigation and footer with essential links (About, Contact, Policies).
*   **Product Listing Page (PLP):**
    *   Grid or list view of products (using `Card` components).
    *   High-quality product images.
    *   Clear pricing and product titles.
    *   Filtering and sorting options (by category, price, relevance/trending score from AI).
    *   Search functionality.
    *   Pagination or infinite scroll.
*   **Product Detail Page (PDP):**
    *   Multiple high-resolution product images with zoom.
    *   Compelling, AI-generated product description (fetched from backend).
    *   Clear price, variant selection (size, color if applicable).
    *   Prominent "Add to Cart" CTA.
    *   Trust signals (e.g., estimated delivery, return policy snippet).
    *   Customer reviews/ratings (if implemented).
*   **Shopping Cart:**
    *   Accessible via header icon.
    *   Displays items, quantities, prices, subtotal (using `Table` or `Card` list).
    *   Ability to update quantities or remove items.
    *   Clear CTA to proceed to checkout.
    *   Can be implemented as a slide-out drawer/modal (`Dialog`) or a dedicated page.
*   **Checkout Process:**
    *   Simplified, multi-step or single-page flow.
    *   Guest checkout option strongly recommended.
    *   Clear progress indicator.
    *   Form for shipping address (using `Input`, `Select`).
    *   Shipping method selection (if applicable).
    *   Payment integration (e.g., Stripe Elements / PayPal SDK).
    *   Order summary.
    *   Secure and trustworthy design.
*   **Order Confirmation Page:**
    *   Displays order summary and confirmation details.
    *   Provides estimated delivery information.
*   **(Optional) User Accounts:**
    *   Allow users to register/login.
    *   View order history.
    *   Save addresses.
*   **(Optional) Static Pages:**
    *   About Us
    *   Contact Us
    *   Return Policy
    *   Terms of Service
    *   Privacy Policy

## 4. UI/UX & Best Practice Considerations

*   **Mobile-First & Responsive Design:** Ensure seamless experience across all devices.
*   **Performance:** Optimize images, leverage Next.js features (SSR/ISR/SSG), minimize JavaScript bundle size for fast load times (< 3 seconds target).
*   **Visual Appeal:** Clean, uncluttered layout, consistent branding (colors, fonts), high-quality visuals.
*   **Trust Signals:** Prominently display security badges, clear contact info, return policies, and customer reviews (if available).
*   **Clear Navigation:** Intuitive menus, breadcrumbs, effective search.
*   **Accessibility (a11y):** Follow WCAG guidelines (semantic HTML, keyboard navigation, ARIA attributes, sufficient color contrast).
*   **Compelling CTAs:** Use action-oriented language and visually distinct buttons.
*   **Minimize Friction:** Streamline the path to purchase, especially the checkout process.

## 5. Reusable Component Strategy

Leverage shadcn/ui components (built on Radix UI and Tailwind CSS) as identified in the mapping phase (`reusable_components_mapping.md`) to accelerate development and ensure consistency:

*   `Card` for product display.
*   `Button` for CTAs.
*   `Input`, `Label`, `Select`, `Checkbox`, `RadioGroup` for forms.
*   `Dialog` / `Sheet` for cart preview or modals.
*   `Table` for cart details or order history.
*   `NavigationMenu` / Custom implementation for header.
*   `Carousel` for image galleries on PDP.

This design provides a robust foundation for the custom storefront, integrating modern e-commerce best practices with the power of the AI backend.
