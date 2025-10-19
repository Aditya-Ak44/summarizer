// app/api/summarize/route.ts
import { NextRequest, NextResponse } from 'next/server';

const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_MODEL = 'qwen2:7b';

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

    const prompt = summaryPrompts[summaryLength as keyof typeof summaryPrompts] || summaryPrompts.medium;
    const fullPrompt = `${prompt}\n\n${content}`;

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt: fullPrompt,
        stream: true,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API error: ${response.statusText}`);
    }

    const encoder = new TextEncoder();

    const customReadable = new ReadableStream({
      async start(controller) {
        try {
          const reader = response.body?.getReader();
          if (!reader) throw new Error('No response body');

          const decoder = new TextDecoder();
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              if (line.trim()) {
                try {
                  const json = JSON.parse(line);
                  if (json.response) {
                    controller.enqueue(encoder.encode(json.response));
                  }
                } catch (e) {
                  // Skip invalid JSON lines
                }
              }
            }
          }

          // Process remaining buffer
          if (buffer.trim()) {
            try {
              const json = JSON.parse(buffer);
              if (json.response) {
                controller.enqueue(encoder.encode(json.response));
              }
            } catch (e) {
              // Skip invalid JSON
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
      { error: 'Failed to summarize content. Make sure Ollama is running.' },
      { status: 500 }
    );
  }
}