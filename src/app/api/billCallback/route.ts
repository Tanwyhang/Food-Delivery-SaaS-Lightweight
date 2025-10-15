import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

// PLACEHOLDER: Billplz callback handler
// This will be called by Billplz after payment completion
export async function POST(req: NextRequest) {
  try {
    console.log('🔔 BILLPLZ CALLBACK PLACEHOLDER');
    
    // TODO: Implement actual Billplz callback handling
    /*
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
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Callback error:', error);
    return NextResponse.json({ error: 'Callback failed' }, { status: 500 });
  }
}
