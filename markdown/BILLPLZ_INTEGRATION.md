# Billplz Integration Guide

## Current Status: PROTOTYPE MODE ⚠️

The app currently works without Billplz integration. Orders are created directly with "paid" status.

## Steps to Integrate Billplz Payment

### 1. Get Billplz Credentials

1. Sign up at https://www.billplz.com
2. Go to Settings > API Keys
3. Copy your API Secret Key
4. Create a Collection and copy the Collection ID

### 2. Update Environment Variables

Add to `.env.local`:
```env
BILLPLZ_API_KEY=your_secret_key_here
BILLPLZ_COLLECTION_ID=your_collection_id_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

For production, update `NEXT_PUBLIC_APP_URL` to your actual domain.

### 3. Enable Billplz Code

#### File: `src/lib/billplz.ts`

**Uncomment the actual API call:**
```typescript
export async function createBill(amount: number, phone: string, description: string) {
  // Remove mock code and uncomment:
  const auth = Buffer.from(process.env.BILLPLZ_API_KEY + ':').toString('base64');
  
  const response = await axios.post(
    `${BILLPLZ_API_URL}/bills`,
    {
      collection_id: process.env.BILLPLZ_COLLECTION_ID,
      description,
      email: `${phone}@placeholder.com`,
      name: phone,
      amount: Math.round(amount * 100), // Convert to cents
      callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/billCallback`,
      redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/customer/orderStatus`,
    },
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );
  return response.data;
}
```

#### File: `src/app/api/createBill/route.ts`

**Update to return payment URL:**
```typescript
// After creating bill
return NextResponse.json({
  success: true,
  url: billData.url, // Add this - redirect URL from Billplz
  orderId: order.id,
});
```

**Change initial order status:**
```typescript
const { data: order, error } = await supabase
  .from('orders')
  .insert({
    phone,
    items,
    total,
    status: 'pending', // Change from 'paid' to 'pending'
  })
  .select()
  .single();
```

#### File: `src/app/customer/cart/page.tsx`

**Update to redirect to Billplz:**
```typescript
const data = await res.json();
if (data.success && data.url) {
  localStorage.setItem('currentOrderId', data.orderId);
  localStorage.removeItem('cart');
  window.location.href = data.url; // Redirect to Billplz payment page
}
```

#### File: `src/app/api/billCallback/route.ts`

**Uncomment callback handler:**
```typescript
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const billId = formData.get('id') as string;
    const paid = formData.get('paid') === 'true';
    const paidAt = formData.get('paid_at') as string;

    if (paid) {
      await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('bill_id', billId);
      
      console.log(`✅ Order paid: ${billId} at ${paidAt}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
```

### 4. Configure Billplz Webhook

1. Go to Billplz Dashboard > Settings > Webhooks
2. Add callback URL: `https://yourdomain.com/api/billCallback`
3. Enable webhook for payment status updates

### 5. Test Payment Flow

1. Create an order
2. You'll be redirected to Billplz payment page
3. Use test credentials (provided by Billplz)
4. After payment, you'll be redirected back to order status page
5. Order status should update to "paid" via webhook

## Payment Methods Supported

- Touch 'n Go eWallet (TNG)
- FPX (Online Banking)
- DuitNow QR

## Testing

Billplz provides sandbox mode for testing. Check their documentation for test credentials.

## Security Notes

- Never commit API keys to git
- Use environment variables for all credentials
- Verify webhook signatures in production (add to callback handler)
- Use HTTPS in production for callback URLs
