"use client"

import * as React from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Quote = {
  inMint: string
  outMint: string
  inAmount: number
  outAmount: number
  priceImpactBps: number
  route: string
}

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export default function SwapperDemo() {
  const [from, setFrom] = React.useState("SOL")
  const [to, setTo] = React.useState("USDC")
  const [amount, setAmount] = React.useState("1")

  const { data, isLoading } = useSWR<Quote>(
    `/api/quotes?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}&amount=${encodeURIComponent(amount || "0")}`,
    fetcher,
    { revalidateOnFocus: false },
  )

  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      {/* Form */}
      <div className="rounded-lg border border-[#E0DEDB] bg-white p-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label className="text-[#605A57]">From</Label>
            <div className="flex items-center gap-3">
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="w-36 border-[#E0DEDB] text-[#37322F]">
                  <SelectValue placeholder="Token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="USDC">USDC</SelectItem>
                  <SelectItem value="BONK">BONK</SelectItem>
                </SelectContent>
              </Select>
              <Input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.0"
                className="border-[#E0DEDB] text-[#37322F]"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label className="text-[#605A57]">To</Label>
            <Select value={to} onValueChange={setTo}>
              <SelectTrigger className="w-36 border-[#E0DEDB] text-[#37322F]">
                <SelectValue placeholder="Token" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="SOL">SOL</SelectItem>
                <SelectItem value="BONK">BONK</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button disabled className="mt-2 bg-[#37322F] text-white hover:bg-[#2E2A28]">
            Swap (mock)
          </Button>
          <p className="text-xs text-[#605A57]">
            UI demo with mock quotes. Integrate Jupiter or your preferred router in production.
          </p>
        </div>
      </div>

      {/* Quote */}
      <div className="rounded-lg border border-[#E0DEDB] bg-white p-4">
        <h4 className="font-serif text-lg text-[#37322F]">Quote</h4>
        <div className="mt-3 rounded-md border border-[#E0DEDB] bg-[#F9F8F7] p-4">
          {isLoading ? (
            <p className="text-sm text-[#605A57]">Fetching quote…</p>
          ) : data ? (
            <ul className="grid gap-2 text-sm">
              <li className="flex justify-between">
                <span className="text-[#605A57]">Route</span>
                <span className="font-medium text-[#37322F]">{data.route}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#605A57]">Output</span>
                <span className="font-medium text-[#37322F]">
                  {data.outAmount} {data.outMint}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-[#605A57]">Price impact</span>
                <span className="font-medium text-[#37322F]">{(data.priceImpactBps / 100).toFixed(2)}%</span>
              </li>
            </ul>
          ) : (
            <p className="text-sm text-[#605A57]">Enter an amount to preview a quote.</p>
          )}
        </div>
        <div className="mt-4 text-xs text-[#605A57]">
          dApp‑compatible signing available via the adapter layer — expose connect/sign methods without leaking keys.
        </div>
      </div>
    </div>
  )
}
