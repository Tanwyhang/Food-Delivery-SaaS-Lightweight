## Technical Outline: BB-Delivery App

### Project Overview

The BB-Delivery App is a full-stack web application built with Next.js and Supabase. It's designed as a food delivery platform where customers can order food, and an admin can manage the menu and orders. The application is written in TypeScript.

### Folder Structure

*   `src`: Contains the main source code for the application.
    *   `app`: The core of the Next.js application, using the App Router. It's divided into `admin` and `customer` sections, representing the two main user roles.
    *   `components`: Holds reusable React components used throughout the application, such as `BottomNav.tsx`, `CartItemCard.tsx`, and `MenuItemCard.tsx`.
    *   `lib`: Contains helper functions and clients for external services. `supabaseClient.ts` configures the Supabase connection.
*   `public`: Stores static assets like images (`logo.png`), icons, and other files that are served directly.
*   `supabase`: Manages the Supabase project, including database migrations in the `migrations` directory. This allows for version control of the database schema.
*   `markdown`: Contains project documentation in Markdown files, such as `QUICK_START.md` and `SETUP.md`.

### Frontend

*   **Framework:** Next.js 15 with Turbopack for development and builds.
*   **Language:** TypeScript
*   **UI:**
    *   **Styling:** Tailwind CSS with PostCSS.
    *   **Components:** A mix of custom components and UI components from `radix-ui`. `lucide-react` is used for icons.
    *   **Fonts:** `Geist` and `Geist Mono`.

### Backend

*   **Platform:** Next.js API routes.
*   **Database:** Supabase (PostgreSQL) is used for the database. The connection is managed through `src/lib/supabaseClient.ts`, which uses the `supabase-js` library.
*   **Database Schema:**
    *   The database schema is defined in `supabase/migrations/20240101000000_initial_schema.sql`.
    *   It includes two main tables:
        *   `menu_items`: Stores information about food items, including title, description, price, and availability.
        *   `orders`: Stores order details, including customer phone number, items ordered, total price, and order status.
    *   Row Level Security (RLS) is enabled on the tables, but the current policies allow all operations, indicating that a more robust authentication and authorization system may be planned for the future.

### Key Features

*   **Customer Facing:**
    *   Browse menu items.
    *   Place orders.
    *   (Presumably) track order status.
*   **Admin Facing:**
    *   Admin login.
    *   (Presumably) manage menu items (add, edit, delete).
    *   (Presumably) view and manage orders.

### Authentication

*   The home page has separate links for "Customer" and "Admin", suggesting different user roles.
*   The customer flow seems to be identified by a phone number.
*   The admin section has a login page at `/admin/login`.
*   The database schema has policies that are currently open, but are set up for more granular control once a full authentication system is in place.

### Manual Payment Flow

The application uses a manual payment confirmation flow.

1.  **Customer Checkout:**
    *   Instead of redirecting to a payment gateway, the app will display a QR code for payment.
    *   The QR code image will be stored in a Supabase bucket. For now, a placeholder will be used.
    *   The page will also display a phone number.
    *   The QR code and phone number will be configurable via environment variables.
    *   A button labeled "I have completed the payment" will be present.

2.  **Order Placement:**
    *   When the customer clicks "I have completed the payment", the order is created in the database with a `pending` status.

3.  **Admin Order Management:**
    *   The admin sees a list of pending orders.
    *   The admin can manually confirm a payment by clicking a "Confirm" button on a pending order.
    *   This action updates the order status from `pending` to `paid`.

4.  **Real-time Updates:**
    *   The customer's order status page should update in real-time to reflect the change from `pending` to `paid`.
