# 🍱 Mom's Delivery App

A mobile-first food delivery web app built with Next.js, Supabase, and Tailwind CSS.

## ✨ Features

- 📱 Mobile-first responsive design
- 🛒 Simple cart management (no login required)
- 📞 Phone number-based orders
- 📊 Real-time order status tracking
- 👨‍💼 Admin dashboard for order management
- 📈 Sales analytics
- 💳 Payment integration ready (Billplz)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Supabase account

### Installation

1. **Clone and install:**
```bash
cd bb-delivery
npm install
```

2. **Setup Supabase:**
```bash
supabase db push
```

3. **Configure environment variables:**

Create/update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_ADMIN_PASSWORD=your_password
```

4. **Run development server:**
```bash
npm run dev
```

Visit `http://localhost:3000`

## 📖 Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup instructions
- **[QUICK_START.md](./QUICK_START.md)** - Get running in 3 steps
- **[BILLPLZ_INTEGRATION.md](./BILLPLZ_INTEGRATION.md)** - Payment integration guide
- **[MENU_MANAGEMENT.md](./MENU_MANAGEMENT.md)** - Menu items guide
- **[IMAGE_UPLOAD_GUIDE.md](./IMAGE_UPLOAD_GUIDE.md)** - Complete image upload guide
- **[SUPABASE_STORAGE_SETUP.md](./SUPABASE_STORAGE_SETUP.md)** - 5-minute storage setup
- **[IMAGE_UPLOAD_FLOW.md](./IMAGE_UPLOAD_FLOW.md)** - Visual flow diagram

## 🏗️ Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page (role selection)
│   ├── customer/                   # Customer flow
│   │   ├── phone/page.tsx         # Phone entry
│   │   ├── menu/page.tsx          # Menu browsing
│   │   ├── cart/page.tsx          # Cart & checkout
│   │   └── orderStatus/page.tsx   # Order tracking
│   ├── admin/                      # Admin flow
│   │   ├── login/page.tsx         # Admin authentication
│   │   ├── orders/page.tsx        # Order management
│   │   └── dashboard/page.tsx     # Analytics
│   └── api/                        # API routes
│       ├── createBill/route.ts    # Order creation
│       └── billCallback/route.ts  # Payment callback
├── components/                     # Reusable components
├── lib/                           # Utilities & config
└── supabase/migrations/           # Database schema
```

## 🎯 User Flows

### Customer Journey
1. Choose "Customer" role
2. Enter phone number
3. Browse menu and add items to cart
4. Review cart and checkout
5. Track order status in real-time

### Admin Journey
1. Choose "Admin" role
2. Enter password
3. View and manage orders by status
4. View sales analytics

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS 4
- **Database:** Supabase (PostgreSQL)
- **Payment:** Billplz (ready to integrate)
- **Language:** TypeScript
- **Deployment:** Vercel-ready

## 🚧 Current Status: Prototype Mode

The app is fully functional but runs in **prototype mode**:
- ✅ All features working
- ✅ Database integration complete
- ✅ Real-time updates working
- ⚠️ Payment gateway not yet integrated (orders auto-marked as paid)

See [BILLPLZ_INTEGRATION.md](./BILLPLZ_INTEGRATION.md) to add real payment processing.

## 📝 Environment Variables

### Required (Prototype)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anon key
- `NEXT_PUBLIC_ADMIN_PASSWORD` - Admin login password

### Optional (For Payment)
- `BILLPLZ_API_KEY` - Billplz API secret key
- `BILLPLZ_COLLECTION_ID` - Billplz collection ID
- `NEXT_PUBLIC_APP_URL` - App URL for callbacks

## 🚀 Deployment

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

The app is optimized for Vercel deployment with zero configuration needed.

## 📊 Database Schema

### orders table
- `id` - UUID primary key
- `phone` - Customer phone number
- `items` - JSONB array of order items
- `total` - Order total amount
- `status` - Order status (paid/preparing/delivering/delivered)
- `bill_id` - Payment reference ID
- `created_at` - Timestamp
- `updated_at` - Timestamp

## 🔐 Security

- Row Level Security (RLS) enabled on Supabase
- Admin password protection
- Environment variables for sensitive data
- HTTPS required for production

## 📄 License

Private project for Mom's Delivery business.
