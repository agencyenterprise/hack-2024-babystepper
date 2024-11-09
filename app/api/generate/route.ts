import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { problem } = await req.json();

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that breaks down problems into small, manageable steps. Provide a clear, specific, and actionable first step that takes 5 minutes or less to complete."
        },
        {
          role: "user",
          content: problem
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const solution = completion.choices[0].message.content;

    return NextResponse.json({ solution });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate solution' },
      { status: 500 }
    );
  }
} 