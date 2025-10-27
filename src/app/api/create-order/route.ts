import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { phone, items, total, address } = await req.json();

  try {
    // 1. Create the order in Supabase
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        phone,
        items,
        total,
        status: 'pending', // Set initial status to pending
        address,
      })
      .select('id')
      .single();

    if (orderError) throw orderError;

    return NextResponse.json({ success: true, orderId: orderData.id });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
