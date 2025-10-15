# ⚡ Quick Start Guide

## 🎯 Get Running in 3 Steps

### 1️⃣ Setup Supabase
```bash
supabase db push
```

### 2️⃣ Configure `.env.local`
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
NEXT_PUBLIC_ADMIN_PASSWORD=admin123
```

### 3️⃣ Run
```bash
npm run dev
```

## ✅ What Works Now (Prototype Mode)

- ✅ Customer can browse menu (from database)
- ✅ Add items to cart with quantity & remarks
- ✅ Place orders (auto-marked as paid)
- ✅ Real-time order status tracking
- ✅ Admin can manage menu items (add/edit/delete)
- ✅ Admin can view all orders
- ✅ Admin can update order status
- ✅ Admin can batch update orders
- ✅ Sales analytics dashboard

## 🔧 What to Add Later

- 💳 Real Billplz payment integration
- 📧 Email/SMS notifications
- 🖼️ Menu item images
- 📍 Delivery address
- ⏰ Order scheduling

## 🎨 Test the App

### As Customer:
1. Go to `http://localhost:3000`
2. Click "Customer"
3. Enter phone: `0123456789`
4. Browse menu and add items
5. Go to cart and click "Pay Now"
6. See order status update in real-time

### As Admin:
1. Go to `http://localhost:3000`
2. Click "Admin"
3. Enter password from `.env.local`
4. Manage menu items (add/edit/delete)
5. View orders and update status
6. Check dashboard for analytics

## 📝 Notes

- Orders are stored in Supabase
- Cart is stored in localStorage
- Phone number is stored in localStorage
- Admin auth is stored in sessionStorage
- Real-time updates via Supabase Realtime

## 🐛 Troubleshooting

**Can't connect to Supabase?**
- Check your `.env.local` has correct credentials
- Make sure migration ran successfully
- Verify Supabase project is active

**Admin login not working?**
- Check `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Clear browser cache/sessionStorage

**Orders not showing?**
- Check browser console for errors
- Verify Supabase connection
- Check if orders table exists

## 📚 More Info

- Full setup: [SETUP.md](./SETUP.md)
- Payment integration: [BILLPLZ_INTEGRATION.md](./BILLPLZ_INTEGRATION.md)
- Project overview: [README.md](./README.md)
