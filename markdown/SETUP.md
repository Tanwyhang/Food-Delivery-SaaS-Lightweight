# Mom's Delivery App - Setup Guide (Prototype Mode)

## Prerequisites
- Node.js 18+ installed
- Supabase account

## Setup Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Supabase
1. Run the migration:
```bash
supabase db push
```

2. Get your Supabase credentials from the dashboard:
   - Go to Project Settings > API
   - Copy the Project URL and anon/public key

3. Update `.env.local` with your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_ADMIN_PASSWORD=your_secure_password
```

### 3. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000`

## 🚧 Prototype Mode

This is currently running in **prototype mode** without actual payment integration:
- Orders are created directly in the database
- Payment is automatically marked as "successful"
- No redirect to external payment gateway
- Check console logs for payment placeholders

### To Add Billplz Payment Later:

1. **Get Billplz credentials:**
   - Sign up at https://www.billplz.com
   - Get API key from dashboard
   - Create a collection and get collection ID

2. **Update `.env.local`:**
```env
BILLPLZ_API_KEY=your_api_key
BILLPLZ_COLLECTION_ID=your_collection_id
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Uncomment code in:**
   - `src/lib/billplz.ts` - Uncomment actual API call
   - `src/app/api/billCallback/route.ts` - Uncomment callback handler

4. **Update cart flow:**
   - Modify `src/app/customer/cart/page.tsx` to redirect to `data.url` from Billplz

## App Structure

### Customer Flow
1. `/` - Choose role (Customer/Admin)
2. `/customer/phone` - Enter phone number
3. `/customer/menu` - Browse and add items to cart
4. `/customer/cart` - Review cart and pay
5. Payment redirect to Billplz
6. `/customer/orderStatus` - Track order status

### Admin Flow
1. `/` - Choose role (Customer/Admin)
2. `/admin/login` - Enter password
3. `/admin/orders` - View and update orders
4. `/admin/menu` - Add/edit/delete menu items
5. `/admin/dashboard` - View sales analytics

## Database Schema

### menu_items table
- `id` (UUID) - Primary key
- `title` (VARCHAR) - Item name
- `description` (TEXT) - Item description
- `price` (DECIMAL) - Item price
- `image_url` (TEXT) - Image URL
- `recommendation_level` (INTEGER) - 0-5 rating for recommendations
- `is_available` (BOOLEAN) - Availability status
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

### orders table
- `id` (UUID) - Primary key
- `phone` (VARCHAR) - Customer phone number
- `items` (JSONB) - Order items array
- `total` (DECIMAL) - Total amount
- `status` (VARCHAR) - Order status (paid/preparing/delivering/delivered)
- `bill_id` (VARCHAR) - Billplz bill ID
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

## Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
5. Update Billplz callback URL in Billplz dashboard

## Features
- ✅ Mobile-first responsive design
- ✅ Dynamic menu from database
- ✅ Menu management (add/edit/delete items)
- ✅ Image support for menu items
- ✅ Recommendation levels
- ✅ Real-time order status updates
- ✅ Multiple payment methods (TNG, FPX, DuitNow via Billplz)
- ✅ Admin order management
- ✅ Sales analytics dashboard
- ✅ Batch order status updates
