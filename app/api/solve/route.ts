import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      console.error('OpenAI API key is missing');
      throw new Error('OpenAI API key is not configured');
    }

    const { problem } = await request.json();
    console.log('Received problem:', problem);

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are BabyStepper, an AI assistant that generates small, specific, and immediately actionable steps. Your responses should be concise and focus on a single, concrete action that can be taken today. Avoid general advice or multiple steps. Frame the response as Your baby step: [specific action] followed by a brief explanation of why this step is valuable."
        },
        {
          role: "user",
          content: problem
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('OpenAI response received:', completion.choices[0].message);

    return NextResponse.json({ 
      solution: completion.choices[0].message.content 
    });
    
  } catch (error: any) {
    console.error('Detailed API error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });

    return NextResponse.json(
      { 
        error: 'Failed to generate baby step',
        details: error.message 
      },
      { status: 500 }
    );
  }
} 