"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface WalletContextType {
  isConnected: boolean
  publicKey: string | null
  balance: number
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)

  const connectWallet = async () => {
    try {
      // Check if window.solana exists (from the shim)
      if (typeof window !== 'undefined' && window.solana) {
        const response = await window.solana.connect()
        setPublicKey(response.publicKey)
        setIsConnected(true)
        // Mock balance for demo
        setBalance(0.00)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const disconnectWallet = () => {
    if (typeof window !== 'undefined' && window.solana) {
      window.solana.disconnect()
    }
    setIsConnected(false)
    setPublicKey(null)
    setBalance(0)
  }

  useEffect(() => {
    // Check if already connected on mount
    if (typeof window !== 'undefined' && window.solana && window.solana.publicKey) {
      setPublicKey(window.solana.publicKey)
      setIsConnected(true)
      setBalance(0.00)
    }
  }, [])

  return (
    <WalletContext.Provider value={{
      isConnected,
      publicKey,
      balance,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  )
}

export function useWallet() {
  const context = useContext(WalletContext)
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}
