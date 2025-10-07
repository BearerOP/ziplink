"use client"

import * as React from "react"
import { createDevAdapter } from "@/lib/wallet/adapter"

declare global {
  interface Window {
    solana?: any
  }
}

export default function SolanaProviderShim() {
  React.useEffect(() => {
    if (typeof window === "undefined") return
    if (!window.solana) {
      const adapter = createDevAdapter()
      // Minimal provider shape many Solana dApps expect
      console.log("[v0] Dev provider shim installed")
      window.solana = {
        isZipLink: true,
        publicKey: adapter.publicKey,
        connect: adapter.connect,
        disconnect: adapter.disconnect,
        signTransaction: adapter.signTransaction,
        signAllTransactions: adapter.signAllTransactions,
        signMessage: adapter.signMessage,
        on: adapter.on,
        off: adapter.off,
      }
      // console.log("[v0] Dev provider shim installed")
    }
  }, [])
  return null
}
