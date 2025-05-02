# v0.dev Code Mapping to Custom Store Features

This document maps specific UI components and patterns, primarily from the shadcn/ui library (commonly used in v0.dev examples), to the features defined in the `custom_store_architecture.md`.

## Feature to Component Mapping

1.  **Homepage:**
    *   **Hero Section:** Use standard HTML/Tailwind for layout. `Button` for CTAs.
    *   **Featured Products Grid:** `Card` components within a responsive Tailwind CSS grid.
    *   **Navigation Header:** Custom flexbox layout with `Link` components (Next.js) or potentially `NavigationMenu`.
    *   **Footer:** Simple layout with `Link` components.
    *   **Trust Icons:** Use icons from `lucide-react` (included with shadcn/ui).

2.  **Product Listing Page (PLP):**
    *   **Product Grid:** `Card` components (containing `img`, title, price, `Button` for Add to Cart) arranged in a responsive Tailwind CSS grid.
    *   **Filtering Sidebar/Dropdown:** `Checkbox`, `RadioGroup`, `Slider` for filter options, potentially within a `Sheet` or `Collapsible` section. `Select` or `DropdownMenu` for sorting.
    *   **Search Bar:** `Input` component, potentially with a `Button` containing a search icon.
    *   **Pagination:** `Pagination` component.

3.  **Product Detail Page (PDP):**
    *   **Image Gallery:** `Carousel` component or a custom implementation with thumbnails.
    *   **Product Info:** Standard text elements (`h1`, `p`).
    *   **Variant Selection:** `Select` or `RadioGroup` for choosing size, color, etc.
    *   **Quantity Selector:** `Input` (type number) or custom +/- `Button` components.
    *   **Add to Cart Button:** `Button`.
    *   **Description/Specs/Reviews:** `Tabs` or `Accordion` components.
    *   **Reviews Display:** List of `Card` components, each containing rating (`Star` icons), author, and text.

4.  **Shopping Cart:**
    *   **Display Method:** `Sheet` (slide-out drawer) or `Dialog` (modal) for quick view, or a dedicated page.
    *   **Item List:** `Table` component or a list of custom components (using `img`, text, `Input`/`Button` for quantity).
    *   **Summary:** Text elements for subtotal, estimated shipping, total.
    *   **Action Buttons:** `Button` for "Proceed to Checkout", "Update Cart", "Remove Item".

5.  **Checkout Process:**
    *   **Layout:** Multi-step form using `Card` sections with `Stepper` (custom component or library) or a single-page layout.
    *   **Address Form:** `Input`, `Label`, `Select` components within a form structure.
    *   **Shipping Options:** `RadioGroup`.
    *   **Payment Section:** Integration point for Stripe Elements or PayPal SDK (will render their own UI components within designated containers).
    *   **Order Summary:** `Table` or simple list layout.
    *   **Submit Button:** `Button`.

6.  **Order Confirmation Page:**
    *   **Layout:** Simple page using `Card` to display order summary, confirmation message, and potentially tracking info placeholder.

7.  **(Optional) User Accounts:**
    *   **Login/Register Forms:** `Card` containing `Input`, `Label`, `Button`.
    *   **Dashboard/Order History:** `Table` or list of `Card` components to display past orders.

## Implementation Notes

*   This mapping relies heavily on the components provided by `shadcn/ui`, assuming it will be the chosen UI library, consistent with v0.dev's approach.
*   Specific v0.dev *community examples* can provide inspiration for the *layout and composition* of these components (e.g., how cards are arranged in a dashboard, how forms are structured), even if the exact code isn't directly copied.
*   Responsiveness will be handled primarily through Tailwind CSS utility classes.
*   State management (e.g., for the shopping cart) will likely use React Context, Zustand, or a similar library.

