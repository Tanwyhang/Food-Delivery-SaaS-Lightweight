// TODO: Implement Billplz API integration
// import axios from 'axios';

// const BILLPLZ_API_URL = 'https://www.billplz.com/api/v3';

export async function createBill(amount: number, phone: string, description: string) {
  // PLACEHOLDER: Replace with actual Billplz API call
  console.log('🔔 BILLPLZ PLACEHOLDER - Create Bill');
  console.log('Amount:', amount);
  console.log('Phone:', phone);
  console.log('Description:', description);
  
  // TODO: Uncomment and configure when ready
  /*
  const auth = Buffer.from(process.env.BILLPLZ_API_KEY + ':').toString('base64');
  
  const response = await axios.post(
    `${BILLPLZ_API_URL}/bills`,
    {
      collection_id: process.env.BILLPLZ_COLLECTION_ID,
      description,
      email: `${phone}@placeholder.com`,
      name: phone,
      amount: Math.round(amount * 100),
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
  */
  
  // Mock response for prototype
  return {
    id: `MOCK_BILL_${Date.now()}`,
    url: null, // No redirect for prototype
  };
}
