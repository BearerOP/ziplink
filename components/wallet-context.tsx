"use client"

import React, { createContext, useContext, useState, useMemo, useEffect } from "react"
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { createGoogleWalletAdapter } from '@/lib/wallet/google-wallet-adapter'
import { useGoogleLogin } from '@react-oauth/google'

// Create RPC connection
const RPC_ENDPOINT = "https://api.devnet.solana.com"
const chain = "solana:devnet"

interface DetectedWallet {
  name: string
  icon: string
  adapter: any
  installed: boolean
}

interface SolanaContextState {
  // RPC
  connection: Connection
  chain: typeof chain

  // Wallet State
  availableWallets: DetectedWallet[]
  selectedWallet: string | null
  publicKey: string | null
  isConnected: boolean
  balance: number

  // Wallet Actions
  connectWallet: (walletName: string) => Promise<void>
  disconnectWallet: () => void
  copyAddress: (address: string) => Promise<void>
  refreshBalance: () => Promise<void>
  
  // Compatibility
  selectedAccount: { address: string } | null
  isGoogleAuthenticated: boolean
  googleUser: null
  loginWithGoogle: () => Promise<void>
  logoutGoogle: () => void
}

const WalletContext = createContext<SolanaContextState | undefined>(undefined)

export function WalletProvider({ children }: { children: React.ReactNode }) {
  // State management
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState(0)
  const [walletAdapter, setWalletAdapter] = useState<any>(null)
  const [googleIdToken, setGoogleIdToken] = useState<string | null>(null)
  const [googleUserEmail, setGoogleUserEmail] = useState<string | null>(null)
  const [isGoogleAuthenticatedState, setIsGoogleAuthenticatedState] = useState(false)
  
  // Create Solana connection
  const connection = useMemo(() => new Connection(RPC_ENDPOINT, 'confirmed'), [])

  // Detect available wallets
  const availableWallets = useMemo(() => {
    if (typeof window === 'undefined') return []
    
    const wallets: DetectedWallet[] = []
    const w = window as any

    if (w.phantom?.solana) {
      wallets.push({ name: 'Phantom', icon: '/wallets/phantom.png', adapter: w.phantom.solana, installed: true })
    }
    if (w.solflare) {
      wallets.push({ name: 'Solflare', icon: '/wallets/solflare.png', adapter: w.solflare, installed: true })
    }
    if (w.backpack) {
      wallets.push({ name: 'Backpack', icon: '/wallets/backpack.ico', adapter: w.backpack, installed: true })
    }
    if (w.glow) {
      wallets.push({ name: 'Glow', icon: '✨', adapter: w.glow, installed: true })
    }
    if (w.Slope) {
      wallets.push({ name: 'Slope', icon: '⛰️', adapter: w.Slope, installed: true })
    }

    if( w.metamask) {
      wallets.push({ name: 'MetaMask', icon: '/wallets/metamask.png', adapter: w.metamask, installed: true })
    }

    if (w.coinbaseSolana) {
      wallets.push({ name: 'Coinbase Wallet', icon: '🔵', adapter: w.coinbaseSolana, installed: true })
    }

    // Add Google Wallet if user is authenticated with Google
    if (googleIdToken && googleUserEmail) {
      const googleAdapter = createGoogleWalletAdapter({
        apiEndpoint: process.env.NEXT_PUBLIC_API_URL || 'https://api.yourapp.com',
        googleIdToken: googleIdToken,
        userEmail: googleUserEmail
      })
      
      wallets.push({ 
        name: `Google Wallet (${googleUserEmail})`, 
        icon: '🔑', 
        adapter: googleAdapter, 
        installed: true 
      })
    }

    return wallets
  }, [googleIdToken, googleUserEmail])

  const isConnected = !!publicKey && !!selectedWallet
  const selectedAccount = publicKey ? { address: publicKey } : null

  // Fetch balance from Solana blockchain
  const fetchBalance = async (publicKeyString: string): Promise<number> => {
    try {
      const publicKey = new PublicKey(publicKeyString)
      const balanceInLamports = await connection.getBalance(publicKey)
      return balanceInLamports / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
      return 0
    }
  }

  // Refresh balance for selected account
  const refreshBalance = async () => {
    if (publicKey) {
      const newBalance = await fetchBalance(publicKey)
      setBalance(newBalance)
    }
  }

  // Connect wallet directly using wallet adapter
  const connectWallet = async (walletName: string) => {
    try {
      // Find the wallet adapter
      const wallet = availableWallets.find(w => w.name === walletName)
      
      if (!wallet || !wallet.adapter) {
        throw new Error(`${walletName} is not installed`)
      }

      // Connect to the wallet
      const response = await wallet.adapter.connect()
      const pubKey = response.publicKey?.toString() || wallet.adapter.publicKey?.toString()
      
      if (!pubKey) {
        throw new Error('Failed to get public key from wallet')
      }
      
      setSelectedWallet(walletName)
      setPublicKey(pubKey)
      setWalletAdapter(wallet.adapter)
      
      // Fetch balance
      const accountBalance = await fetchBalance(pubKey)
      setBalance(accountBalance)

      // Listen for account changes
      if (wallet.adapter.on) {
        wallet.adapter.on('accountChanged', async (newPublicKey: any) => {
          if (newPublicKey) {
            const newPubKeyString = newPublicKey.toString()
            setPublicKey(newPubKeyString)
            const newBalance = await fetchBalance(newPubKeyString)
            setBalance(newBalance)
          } else {
            disconnectWallet()
          }
        })
      }

    } catch (error) {
      console.error('Failed to connect wallet:', error)
      throw error
    }
  }

  // Disconnect wallet
  const disconnectWallet = () => {
    if (walletAdapter?.disconnect) {
      walletAdapter.disconnect()
    }
    setSelectedWallet(null)
    setPublicKey(null)
    setBalance(0)
    setWalletAdapter(null)
  }

  // Copy address to clipboard
  const copyAddress = async (address: string) => {
    try {
      await navigator.clipboard.writeText(address)
      console.log('Address copied to clipboard')
    } catch (error) {
      console.error('Failed to copy address:', error)
    }
  }

  // Google OAuth login hook
  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        console.log('[Google Auth] Login successful, fetching user info...')
        
        // Get user info from Google
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`
          }
        })
        
        const userInfo = await userInfoResponse.json()
        
        console.log('[Google Auth] User info retrieved:', userInfo.email)
        
        // Set Google auth state
        setGoogleIdToken(tokenResponse.access_token)
        setGoogleUserEmail(userInfo.email)
        setIsGoogleAuthenticatedState(true)
        
        console.log('[Google Auth] Google wallet will now appear in available wallets')
      } catch (error) {
        console.error('[Google Auth] Failed to get user info:', error)
        alert('Failed to get Google user information. Please try again.')
      }
    },
    onError: (error) => {
      console.error('[Google Auth] Login failed:', error)
      alert('Google login failed. Please try again.')
    },
  })

  // Google Auth implementation
  const loginWithGoogle = async () => {
    try {
      console.log('[Google Auth] Initiating Google login...')
      googleLoginHandler()
    } catch (error) {
      console.error('Google login error:', error)
      alert('Failed to initiate Google login. Please try again.')
    }
  }

  const logoutGoogle = () => {
    setGoogleIdToken(null)
    setGoogleUserEmail(null)
    setIsGoogleAuthenticatedState(false)
    
    // If currently connected to Google wallet, disconnect it
    if (selectedWallet?.startsWith('Google Wallet')) {
      disconnectWallet()
    }
  }

  // Auto-refresh balance every 30 seconds
  useEffect(() => {
    if (isConnected && publicKey) {
      const interval = setInterval(() => {
        refreshBalance()
      }, 30000)
      
      return () => clearInterval(interval)
    }
  }, [isConnected, publicKey])

  // Create context value
  const contextValue = useMemo<SolanaContextState>(
    () => ({
      // Static RPC values
      connection,
      chain,

      // Dynamic wallet values
      availableWallets,
      selectedWallet,
      publicKey,
      selectedAccount,
      isConnected,
      balance,
      
      // Actions
      connectWallet,
      disconnectWallet,
      copyAddress,
      refreshBalance,
      
      // Google auth
      isGoogleAuthenticated: isGoogleAuthenticatedState,
      googleUser: null,
      loginWithGoogle,
      logoutGoogle,
    }),
    [availableWallets, selectedWallet, publicKey, selectedAccount, isConnected, balance]
  )

  return (
    <WalletContext.Provider value={contextValue}>
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
