import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const summaryPrompts = {
  short: 'Summarize the following content in 2-3 sentences, capturing only the key points:',
  medium: 'Summarize the following content in 4-5 sentences, covering the main ideas and important details:',
  long: 'Summarize the following content in 8-10 sentences, including key points, supporting details, and conclusions:',
};

export async function POST(request: NextRequest) {
  try {
    const { content, summaryLength } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const prompt = summaryPrompts[summaryLength as keyof typeof summaryPrompts] || summaryPrompts.medium;
    const fullPrompt = `${prompt}\n\n${content}`;

    const stream = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: fullPrompt,
        },
      ],
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    const encoder = new TextEncoder();
    let buffer = '';

    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content || '';
            if (delta) {
              buffer += delta;
              controller.enqueue(encoder.encode(delta));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new NextResponse(customReadable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Summarization error:', error);
    return NextResponse.json(
      { error: 'Failed to summarize content' },
      { status: 500 }
    );
  }
}