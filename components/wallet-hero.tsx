"use client"

import { Button } from "@/components/ui/button"

export default function WalletHeroSection() {
  return (
    <section className="w-full border-b border-[#E0DEDB] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E0DEDB] bg-white px-3 py-1 text-xs text-[#605A57]">
          <span className="h-1.5 w-1.5 rounded-full bg-[#37322F]" />
          Future of self‑custody
        </div>

        <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="font-serif text-balance text-3xl leading-tight text-[#37322F] md:text-5xl">
              A Phantom‑class wallet — with more power
            </h2>
            <p className="mt-4 max-w-prose text-pretty text-[#49423D]">
              ZipLink Wallet keeps users secure and dApps compatible while adding an adaptable adapter layer, sharded
              key storage, recovery, and seamless multi‑device support. No new standards required — just better safety
              and control.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button className="bg-[#37322F] text-white hover:bg-[#2E2A28]">Try demo swapper</Button>
              <Button variant="outline" className="border-[#E0DEDB] text-[#37322F] hover:bg-[#F7F6F5] bg-transparent">
                Read architecture
              </Button>
            </div>

            <ul className="mt-6 grid gap-2 text-sm text-[#605A57]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#37322F]" />
                dApp‑compatible API surface
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#37322F]" />
                Sharded secret sharing with recovery
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#37322F]" />
                Multi‑device sync without seed exposure
              </li>
            </ul>
          </div>

          <div className="rounded-xl border border-[#E0DEDB] bg-white p-4 md:p-6">
            <div className="rounded-lg border border-[#E0DEDB] bg-[#F9F8F7] p-4">
              <div className="mb-3 text-xs uppercase tracking-wide text-[#605A57]">Adapter pipeline</div>
              <div className="grid gap-3">
                <Row label="App request" value="signTransaction" />
                <Row label="Adapter routing" value="SolanaProviderAdapter" />
                <Row label="Policy checks" value="spending limits + origin trust" />
                <Row label="Key access" value="Shard quorum (2/3 threshold)" />
                <Row label="Result" value="Signature returned to dApp" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-[#E0DEDB] bg-white px-3 py-2 text-sm">
      <span className="text-[#605A57]">{label}</span>
      <span className="font-medium text-[#37322F]">{value}</span>
    </div>
  )
}
