# AI Dropshipping Website - UI Implementation Plan

This document outlines the plan for implementing the Admin Dashboard UI using Next.js, Tailwind CSS, and shadcn/ui components, based on the architecture design and feature requirements. While the provided v0.dev links offered limited visual detail and specific "Versa AI code package links" were not supplied, the UI will adopt a modern, clean, and functional aesthetic suitable for a futuristic dashboard, leveraging the capabilities of the chosen stack.

## 1. Overall Layout & Navigation

*   **Framework:** Next.js App Router.
*   **Layout:** A persistent sidebar navigation layout.
    *   **Sidebar:** Contains links to all main modules (Dashboard, Products, Orders, Pricing, Suppliers, POD, Settings, Analytics). Uses shadcn/ui `NavigationMenu` or a custom sidebar component styled with Tailwind.
    *   **Main Content Area:** Displays the content for the selected module. Uses shadcn/ui `Card` components for sectioning content.
*   **Styling:** Tailwind CSS for utility-first styling, adhering to a consistent design system (colors, typography, spacing). shadcn/ui components will provide the base styling, customized as needed.

## 2. Module-Specific UI Components (using shadcn/ui where applicable)

*   **Dashboard Overview:**
    *   `Card` components for key metrics (e.g., Revenue Today, Orders Today, Profit Estimate) using `CardHeader`, `CardTitle`, `CardContent`.
    *   `Table` component for recent activity or pending tasks.
    *   Potentially a simple `LineChart` (using Recharts, included in template) for recent sales trends.
*   **Product Research & Discovery:**
    *   `Input` fields and `Button` to initiate scraping jobs.
    *   `Table` (using `DataTable` component from shadcn/ui examples) to display discovered products with columns for image, title, supplier, cost, potential price, margin, status. Include filtering (`Input`, `Select`) and sorting capabilities.
    *   `Button` within the table rows for "Import" action, potentially opening a `Dialog` for confirmation or quick edits.
*   **Product Management:**
    *   `Tabs` component to switch between views (e.g., "Internal DB", "Shopify Sync Status").
    *   `DataTable` to list products with filtering and sorting.
    *   `Dialog` or separate page for detailed product editing, using `Input`, `Textarea`, `Select`, image upload components.
    *   `Button` for "Push to Shopify" or "Sync" actions.
*   **Pricing & Stock Automation:**
    *   `Card` sections for displaying current status and configuration.
    *   `DataTable` showing products with current cost, price, stock, and applied rules.
    *   `Dialog` or form section using `Input`, `Select`, `Switch` to define/edit pricing rules.
    *   `Switch` components to enable/disable dynamic pricing per product or globally.
    *   `DataTable` or log viewer for displaying update history.
*   **Order Management & Fulfillment:**
    *   `DataTable` to display incoming orders with columns for Order ID, Customer, Items, Total, Status.
    *   Real-time updates indicated visually (e.g., status badges).
    *   `Dialog` or expandable row to show detailed order info, fulfillment logs, and tracking numbers.
    *   `Button` components for manual actions (Retry Fulfillment, View on Shopify).
*   **Supplier Integration Management:**
    *   `DataTable` listing configured suppliers.
    *   `Dialog` or form using `Input`, `Select`, `PasswordInput` (custom component) to add/edit supplier details and API keys.
    *   `Button` to test connection/scraping for a supplier.
*   **POD Management (Printful):**
    *   `Button` to initiate Printful connection (OAuth flow or API key input in a `Dialog`).
    *   Grid or list view (`Card` components) displaying available POD base products from Printful.
    *   Form/`Dialog` for uploading designs and configuring POD product details (pricing, variants).
    *   `DataTable` showing created POD products and their Shopify sync status.
*   **Settings:**
    *   Forms using `Input`, `PasswordInput`, `Select` grouped within `Card` components for managing API keys, AI model endpoints, notification preferences.
    *   `Button` for saving settings.
*   **(Basic) Analytics:**
    *   `Card` components displaying key reports (Total Sales, Total Profit).
    *   `DataTable` for top-performing products.
    *   Simple charts (e.g., `BarChart`, `LineChart` from Recharts) for visualizing trends.

## 3. Implementation Notes

*   Components will be built with reusability in mind.
*   State management will primarily use React's built-in hooks (`useState`, `useContext`, `useEffect`). For more complex global state, Zustand or Jotai might be considered if needed.
*   Data fetching will utilize `fetch` API or libraries like `swr` or `react-query` for caching and state synchronization with the backend.
*   Forms will be handled using libraries like `react-hook-form` integrated with shadcn/ui components.

This plan provides a clear roadmap for developing an intuitive and functional admin dashboard UI that aligns with the project's technical stack and goals.
