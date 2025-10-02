"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

interface SolanaWallet {
  id: string
  name: string
  publicKey: string
  balance: number
  isActive: boolean
  created: Date
}

interface WalletContextType {
  isConnected: boolean
  wallets: SolanaWallet[]
  activeWallet: SolanaWallet | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  createNewWallet: (name?: string) => Promise<SolanaWallet>
  switchWallet: (walletId: string) => void
  deleteWallet: (walletId: string) => void
  copyAddress: (address: string) => Promise<void>
}

const WalletContext = createContext<WalletContextType | undefined>(undefined)

// Helper function to generate a mock Solana address
const generateSolanaAddress = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789'
  let result = ''
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [isConnected, setIsConnected] = useState(false)
  const [wallets, setWallets] = useState<SolanaWallet[]>([])
  const [activeWallet, setActiveWallet] = useState<SolanaWallet | null>(null)

  const connectWallet = async () => {
    try {
      // Check if window.solana exists (from the shim)
      if (typeof window !== 'undefined' && window.solana) {
        const response = await window.solana.connect()
        
        // Create first wallet if none exist
        if (wallets.length === 0) {
          const firstWallet: SolanaWallet = {
            id: '1',
            name: 'Main Wallet',
            publicKey: response.publicKey || generateSolanaAddress(),
            balance: 0.00,
            isActive: true,
            created: new Date()
          }
          setWallets([firstWallet])
          setActiveWallet(firstWallet)
        }
        
        setIsConnected(true)
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const createNewWallet = async (name?: string): Promise<SolanaWallet> => {
    const newWallet: SolanaWallet = {
      id: Date.now().toString(),
      name: name || `Wallet ${wallets.length + 1}`,
      publicKey: generateSolanaAddress(),
      balance: 0.00,
      isActive: false,
      created: new Date()
    }
    
    // Set all other wallets to inactive
    const updatedWallets = wallets.map(w => ({ ...w, isActive: false }))
    newWallet.isActive = true
    
    const allWallets = [...updatedWallets, newWallet]
    setWallets(allWallets)
    setActiveWallet(newWallet)
    
    return newWallet
  }

  const switchWallet = (walletId: string) => {
    const updatedWallets = wallets.map(w => ({
      ...w,
      isActive: w.id === walletId
    }))
    setWallets(updatedWallets)
    
    const newActiveWallet = updatedWallets.find(w => w.id === walletId)
    setActiveWallet(newActiveWallet || null)
  }

  const deleteWallet = (walletId: string) => {
    const updatedWallets = wallets.filter(w => w.id !== walletId)
    setWallets(updatedWallets)
    
    // If deleted wallet was active, switch to first available
    if (activeWallet?.id === walletId) {
      if (updatedWallets.length > 0) {
        const newActive = { ...updatedWallets[0], isActive: true }
        setWallets(prev => prev.map(w => w.id === newActive.id ? newActive : { ...w, isActive: false }))
        setActiveWallet(newActive)
      } else {
        setActiveWallet(null)
        setIsConnected(false)
      }
    }
  }

  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      // You could add a toast notification here
      console.log('Address copied to clipboard')
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  const disconnectWallet = () => {
    if (typeof window !== 'undefined' && window.solana) {
      window.solana.disconnect()
    }
    setIsConnected(false)
    setWallets([])
    setActiveWallet(null)
  }

  useEffect(() => {
    // Check if already connected on mount
    if (typeof window !== 'undefined' && window.solana && window.solana.publicKey) {
      // Create a default wallet if none exist
      const defaultWallet: SolanaWallet = {
        id: '1',
        name: 'Main Wallet',
        publicKey: window.solana.publicKey,
        balance: 0.00,
        isActive: true,
        created: new Date()
      }
      setWallets([defaultWallet])
      setActiveWallet(defaultWallet)
      setIsConnected(true)
    }
  }, [])

  return (
    <WalletContext.Provider value={{
      isConnected,
      wallets,
      activeWallet,
      connectWallet,
      disconnectWallet,
      createNewWallet,
      switchWallet,
      deleteWallet,
      copyAddress
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
