import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { data } = await req.json();

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "openai/gpt-3.5-turbo",
        "messages": [
          {"role": "system", "content": "You are an expert business analyst. Provide a short, valuable insight and a suggestion based on the following sales data. The insight should be concise and easy to understand for a restaurant owner."},
          {"role": "user", "content": JSON.stringify(data)}
        ]
      })
    });

    const completion = await response.json();
    const insight = completion.choices[0].message.content;

    return NextResponse.json({ insight });

  } catch (error) {
    console.error('Error generating AI insight:', error);
    return NextResponse.json({ error: 'Failed to generate AI insight' }, { status: 500 });
  }
}
