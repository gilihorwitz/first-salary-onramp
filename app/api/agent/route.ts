import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 501 }
    );
  }

  try {
    const anthropic = new Anthropic();
    const { benefits, grossSalary } = await req.json();

    const systemPrompt = `You are a friendly financial advisor AI embedded in a paycheck-decoding app for new graduates entering the workforce. Your tone is warm, clear, and jargon-free — like a smart older sibling who happens to know about money.

You will receive a list of benefit elections for a new hire. Do two things:

1. **Babel Fish Translations**: For each benefit, write a 2-sentence plain-English explanation. First sentence: what it actually is. Second sentence: why it matters for a 22-25 year old.

2. **Optimization Check**: Look for uncaptured employer matches or free money being left on the table. The most common issue: contributing less than the employer 401(k) match cap. If you find an optimization, output a STAGED ACTION in this exact JSON format on its own line:

:::STAGED_ACTION:::
{"type":"401k_increase","currentPct":2,"recommendedPct":6,"annualGain":3400,"description":"Increase your 401(k) contribution from 2% to 6% to capture your full employer match"}
:::END_ACTION:::

Be specific with dollar amounts. The employee's gross salary is $${grossSalary}/year.

Format your response as:
- First, the staged action block (if any)
- Then a section titled "## Your Benefits, Explained" with each benefit as a ### heading followed by the 2-sentence explanation.`;

    const userMessage = `Here are my benefit elections:\n\n${benefits
      .map(
        (b: { name: string; employeeContribution: number; employerContribution: number; description: string }) =>
          `- **${b.name}**: Employee pays $${b.employeeContribution}/mo, Employer pays $${b.employerContribution}/mo. ${b.description}`
      )
      .join("\n")}`;

    const stream = anthropic.messages.stream({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        for await (const event of stream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (err) {
    console.error("Agent API error:", err);
    return NextResponse.json(
      { error: "Failed to run AI agent" },
      { status: 500 }
    );
  }
}
