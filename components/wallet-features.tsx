"use client"

import type React from "react"
import SwapperDemo from "./swapper-demo"
import SolanaProviderShim from "./solana-provider-shim"

type FeatureGroup = {
  title: string
  points: string[]
}

const groups: FeatureGroup[] = [
  {
    title: "Wallet features",
    points: [
      "Create & manage Solana accounts (keypairs)",
      "Local, hardware, and sharded key storage",
      "Wallet Adapter interface to connect dApps",
      "Backup & recovery via SSS or threshold signatures",
      "Multi‑device login with encrypted node shards",
    ],
  },
  {
    title: "Swap features",
    points: [
      "Native token swap via SPL Token Swap / AMMs",
      "Balances, history, and confirmations",
      "Fee transparency and slippage controls",
    ],
  },
  {
    title: "Adapter & connectivity",
    points: [
      "Solana Wallet Adapter Standard compatibility",
      "Extension, mobile wallet, and web flows",
      "Consistent transaction signing UX",
    ],
  },
  {
    title: "Security & key management",
    points: [
      "Threshold recovery (e.g., 3 of 5 shards)",
      "Shards encrypted before storage—never raw",
      "Optional WebAuthn / 2FA for reconstruction",
      "Signing in secure enclave/HSM (no raw key exposure)",
    ],
  },
  {
    title: "Infrastructure & nodes",
    points: [
      "Distributed shard storage (multi‑region/cloud)",
      "Reconstruction service with policy & rate‑limits",
      "Audit logs and access monitoring",
    ],
  },
  {
    title: "User experience",
    points: [
      "Easy connect & sign flow (Phantom‑like)",
      "Recovery via shards, social, or hardware fallback",
      "Intuitive swap UI with real‑time pricing",
    ],
  },
]

// Local badge to match site style
function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-[14px] py-[6px] bg-white shadow-[0px_0px_0px_4px_rgba(55,50,47,0.05)] overflow-hidden rounded-[90px] inline-flex items-center gap-[8px] border border-[rgba(2,6,23,0.08)]">
      <span className="w-[14px] h-[14px] grid place-items-center">
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
          <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
          <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
        </svg>
      </span>
      <span className="text-[#37322F] text-xs font-medium leading-3 font-sans">{children}</span>
    </div>
  )
}

export default function WalletFeaturesSection() {
  return (
    <section className="w-full border-b border-[rgba(55,50,47,0.12)] flex flex-col items-center bg-[#F7F5F3]">
      {/* Header */}
      <div className="self-stretch px-4 sm:px-6 md:px-8 lg:px-0 lg:max-w-[1060px] lg:w-[1060px] py-10 sm:py-12 md:py-16 border-b border-[rgba(55,50,47,0.12)] flex justify-center items-center">
        <div className="w-full max-w-[720px] px-4 sm:px-6 py-4 sm:py-5 overflow-hidden rounded-lg flex flex-col items-center gap-4">
          <Badge>Distributed wallet</Badge>
          <h2 className="text-center text-[#49423D] text-2xl md:text-5xl font-semibold leading-tight md:leading-[60px] font-sans tracking-tight text-balance">
            Crypto‑grade security. Human‑friendly experience.
          </h2>
          <p className="text-center text-[#605A57] text-sm sm:text-base font-normal leading-6 sm:leading-7 font-sans">
            A Solana‑ready wallet module with threshold recovery, encrypted sharding, and a simple, consistent signing
            flow. Built to be secure by design and effortless to use.
          </p>
        </div>
      </div>

      {/* Content grid */}
      <div className="self-stretch flex justify-center items-start">
        {/* Left decorative rail */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[140px] left-[-50px] top-[-120px] absolute">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 border-l border-r border-[rgba(55,50,47,0.12)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {groups.map((g, idx) => {
              // compute borders to keep the grid separators consistent with site
              const isFirstCol = idx % 3 === 0
              const isLastCol = idx % 3 === 2
              const isTopRow = idx < 3
              return (
                <div
                  key={g.title}
                  className={[
                    "p-5 sm:p-6 md:p-7 lg:p-8 bg-white",
                    "border-[rgba(55,50,47,0.12)]",
                    isFirstCol ? "md:border-r lg:border-r" : "border-l md:border-l-[0.5px] lg:border-l-[0.5px]",
                    isTopRow ? "border-b" : "border-t",
                  ].join(" ")}
                >
                  <h3 className="text-[#37322F] text-base sm:text-lg font-semibold leading-tight font-sans">
                    {g.title}
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {g.points.map((p) => (
                      <li key={p} className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="mt-2 h-[6px] w-[6px] rounded-full bg-[#37322F]/50 shrink-0"
                          title=""
                        />
                        <span className="text-[#605A57] text-sm md:text-[13px] leading-[22px] font-sans">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>

        {/* Right decorative rail */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[140px] left-[-50px] top-[-120px] absolute">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={i}
                className="h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Swapper demo row with rails, matching site separators */}
      <div className="self-stretch flex justify-center items-start border-t border-[rgba(55,50,47,0.12)]">
        {/* Left decorative rail */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[140px] left-[-50px] top-[-120px] absolute">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={`swap-rail-left-${i}`}
                className="h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>

        {/* Center container with borders */}
        <div className="flex-1 border-l border-r border-[rgba(55,50,47,0.12)] bg-white">
          <div className="px-4 sm:px-6 md:px-8 lg:px-10 py-8 sm:py-10 md:py-12">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(2,6,23,0.08)] bg-white px-[14px] py-[6px]">
              <span className="h-[14px] w-[14px] grid place-items-center">
                <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
                  <rect x="1" y="1" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                  <rect x="7" y="7" width="4" height="4" stroke="#37322F" strokeWidth="1" fill="none" />
                </svg>
              </span>
              <span className="text-[#37322F] text-xs font-medium leading-3 font-sans">Swapper demo</span>
            </div>

            <div className="max-w-[1060px] mx-auto">
              <SwapperDemo />
            </div>
          </div>
        </div>

        {/* Right decorative rail */}
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          <div className="w-[140px] left-[-50px] top-[-120px] absolute">
            {Array.from({ length: 120 }).map((_, i) => (
              <div
                key={`swap-rail-right-${i}`}
                className="h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Install a dev-only provider shim to expose a dApp-compatible provider shape */}
      <SolanaProviderShim />
    </section>
  )
}
