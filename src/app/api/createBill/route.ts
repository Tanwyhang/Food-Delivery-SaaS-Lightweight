import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { createBill } from '@/lib/billplz';

export async function POST(req: NextRequest) {
  try {
    const { phone, items, total } = await req.json();

    // Create order in database
    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        phone,
        items,
        total,
        status: 'paid', // Directly set as paid for prototype
      })
      .select()
      .single();

    if (error) throw error;

    // PROTOTYPE: Mock payment - call placeholder Billplz function
    const description = `Order #${order.id.slice(0, 8)} - ${items.length} items`;
    const billData = await createBill(total, phone, description);

    // Update order with mock bill ID
    await supabase
      .from('orders')
      .update({ bill_id: billData.id })
      .eq('id', order.id);

    console.log('✅ PROTOTYPE: Payment Success - Order created:', order.id);

    // Return success without redirect URL (no actual payment gateway)
    return NextResponse.json({
      success: true,
      orderId: order.id,
      message: 'Payment successful (prototype mode)',
    });
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
