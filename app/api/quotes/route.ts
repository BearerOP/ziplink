import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const from = searchParams.get("from") || "SOL"
  const to = searchParams.get("to") || "USDC"
  const amount = Number(searchParams.get("amount") || "0")

  // Mock quote logic — replace with an aggregator (e.g., Jupiter) in production.
  const rateTable: Record<string, number> = {
    "SOL/USDC": 140,
    "USDC/SOL": 1 / 140,
    "SOL/BONK": 100000,
    "BONK/SOL": 1 / 100000,
    "USDC/BONK": 80000,
    "BONK/USDC": 1 / 80000,
  }
  const key = `${from}/${to}`
  const rate = rateTable[key] ?? 1
  const outAmount = Number((amount * rate).toFixed(6))
  const priceImpactBps = 25 // mock 0.25%

  return NextResponse.json({
    inMint: from,
    outMint: to,
    inAmount: amount,
    outAmount,
    priceImpactBps,
    route: "MockRouter",
  })
}
