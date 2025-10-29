import { CartItem } from '@/lib/types';
import { supabase } from '@/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

const token = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(req: NextRequest) {
  const { phone, items, total, address } = await req.json();

  const escapeMarkdownV2 = (text: string) => {
    return text.replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
  };

  const formatAddress = (address: any) => {
    if (!address) return 'N/A';
    const parts = [];
    if (address.block) parts.push(address.block);
    if (address.lorong) parts.push(`Lorong ${address.lorong}`);
    if (address.unit) parts.push(`Unit ${address.unit}`);
    if (parts.length === 0) return 'No address provided';
    return parts.join(', ');
  };

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

    // 2. Send Telegram notification using fetch
    const message = `
*NEW ORDER RECEIVED*

*Items:*
${items.map((item: CartItem) => `\\- ${escapeMarkdownV2(item.name)} \\(x${escapeMarkdownV2(item.quantity.toString())}\\)`).join('\n')}
      
📞*Phone:* ${escapeMarkdownV2(phone)}
🏠*Address:* ${escapeMarkdownV2(formatAddress(address))}
💰*Total:* RM ${escapeMarkdownV2(total.toString())}

[View order here](https://bb-food-delivery.vercel.app/admin/orders)

_Please confirm and process this order promptly_
    `;


    const telegramApiUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const telegramRequestBody = { chat_id: CHAT_ID, text: message, parse_mode: 'MarkdownV2' };

    console.log('Sending Telegram message:', JSON.stringify(telegramRequestBody, null, 2));

    const telegramResponse = await fetch(telegramApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(telegramRequestBody),
    });

    const telegramResponseData = await telegramResponse.json();
    console.log('Telegram response:', JSON.stringify(telegramResponseData, null, 2));

    return NextResponse.json({ success: true, orderId: orderData.id });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Failed to create order' }, { status: 500 });
  }
}
