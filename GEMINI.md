## Technical Outline: BB-Delivery App

### Project Overview

The BB-Delivery App is a full-stack web application built with Next.js and Supabase. It's designed as a food delivery platform where customers can order food, and an admin can manage the menu and orders. The application is written in TypeScript.

### Folder Structure

*   `src`: Contains the main source code for the application.
    *   `app`: The core of the Next.js application, using the App Router. It's divided into `admin` and `customer` sections, representing the two main user roles.
    *   `components`: Holds reusable React components used throughout the application, such as `BottomNav.tsx`, `CartItemCard.tsx`, and `MenuItemCard.tsx`.
    *   `lib`: Contains helper functions and clients for external services. `supabaseClient.ts` configures the Supabase connection, and `hitpay.ts` will handle the payment integration.
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

### Payment Integration

*   The application is planned to use HitPay for payment processing.
*   The file `src/lib/hitpay.ts` is intended for the HitPay API integration.

## HitPay API Integration Plan

### 1. Analysis of Current State

- **Previous Plan:** The project was initially planned for Billplz integration, with existing documentation and placeholder files reflecting this.
- **New Direction:** The payment provider has been changed to HitPay.
- **File Renaming:** The files `src/lib/billplz.ts` and `markdown/BILLPLZ_INTEGRATION.md` have been renamed to `src/lib/hitpay.ts` and `markdown/HITPAY_INTEGRATION.md` respectively.
- **Action Required:** A new implementation plan is needed to integrate HitPay.

### 2. HitPay API - Key Information

- **Endpoint:** `POST /v1/payment-requests`
- **Sandbox URL:** `https://api.sandbox.hit-pay.com/v1/payment-requests`
- **Authentication:** A `X-BUSINESS-API-KEY` must be included in the request header.
- **Webhook Verification:** Webhooks are verified using a `hmac` signature provided in the webhook payload.

### 3. Implementation Plan

The integration will be executed in three phases.

#### Phase 1: Configuration & Backend Logic

1.  **Environment Setup:**
    - Update the `.env.local` file with the necessary HitPay credentials:
      ```
      HITPAY_API_KEY=your_api_key_here
      HITPAY_SALT=your_webhook_salt_here
      NEXT_PUBLIC_APP_URL=http://localhost:3000
      ```

2.  **Implement HitPay Client (`src/lib/hitpay.ts`):**
    - Overhaul the file to create a function, e.g., `createPaymentRequest`.
    - This function will take `amount`, `currency`, `email`, `name`, and an internal `orderId` as arguments.
    - It will make a `POST` request to the HitPay API (`/v1/payment-requests`) with the required payload, including `amount`, `currency`, `redirect_url`, `webhook`, and `reference_number` (for the internal order ID).
    - The function will return the payment `url` from the HitPay API response.

3.  **Create New API Route for Payment Creation (`/api/create-payment`):**
    - Create a new route handler at `src/app/api/create-payment/route.ts`.
    - This endpoint will receive cart/order details from the client.
    - It will first create an order in the Supabase database with a `status` of `'pending'`.
    - It will then call the `createPaymentRequest` function from `lib/hitpay.ts`.
    - Finally, it will return the `url` from the HitPay response to the client.

4.  **Create New Webhook Handler (`/api/hitpay-webhook`):**
    - Create a new route handler at `src/app/api/hitpay-webhook/route.ts`.
    - This endpoint will listen for `POST` requests from HitPay.
    - It must first **verify the HMAC signature** of the incoming request to ensure it's genuinely from HitPay.
    - If the signature is valid and the payment `status` is `completed`, it will update the corresponding order's status in the Supabase database to `'paid'` using the `reference_number`.

#### Phase 2: Frontend Integration

1.  **Initiate Payment on Checkout:**
    - In the customer checkout page (`src/app/customer/cart/page.tsx`), modify the order placement logic.
    - The "Pay Now" button will now send a request to the new `/api/create-payment` endpoint.
    - Upon receiving a successful response containing the HitPay payment `url`, the application will redirect the user to that URL to complete the payment.

#### Phase 3: Final Configuration & Testing

1.  **Configure HitPay Webhook:**
    - In the HitPay dashboard, set the webhook URL to point to the application's deployed `/api/hitpay-webhook` endpoint.

2.  **End-to-End Testing:**
    - Conduct a full test of the payment workflow using the HitPay sandbox environment.
    - Verify that an order is created as `'pending'`, the user is redirected to the HitPay payment page, and the order status correctly updates to `'paid'` after the webhook is successfully received and verified.