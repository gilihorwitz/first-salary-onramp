import { NextRequest, NextResponse } from "next/server";

/**
 * Mock Airwallex virtual card issuance endpoint.
 * In production this would call POST /api/v1/issuing/cards
 * with real Airwallex sandbox credentials.
 */
export async function POST(req: NextRequest) {
  const { cardholderName, spendLimit } = await req.json();

  // Simulate a brief network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  // Mock card response (sandbox-style)
  const card = {
    id: "card_sandbox_" + Math.random().toString(36).slice(2, 10),
    card_number: "4242424242421234",
    expiry_month: "09",
    expiry_year: "2028",
    cvv: "314",
    cardholder_name: cardholderName,
    currency: "USD",
    spending_limit: spendLimit,
    status: "ACTIVE",
    type: "VIRTUAL",
    created_at: new Date().toISOString(),
  };

  return NextResponse.json(card);
}
