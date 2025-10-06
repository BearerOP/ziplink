"use client"

import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { useWallet } from './wallet-context'
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { toast } from 'sonner'

export function AccountDashboard() {
  const {
    selectedWallet,
    selectedAccount,
    disconnectWallet,
    copyAddress,
    refreshBalance,
    balance,
    connection
  } = useWallet()

  const [activeTab, setActiveTab] = useState('tokens')
  const [showSendModal, setShowSendModal] = useState(false)
  const [recipientAddress, setRecipientAddress] = useState('')
  const [sendAmount, setSendAmount] = useState('')
  const [isSending, setIsSending] = useState(false)

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  // Refresh balance on mount
  useEffect(() => {
    if (selectedAccount) {
      refreshBalance()
    }
  }, [selectedAccount])

  const handleSendSOL = async () => {
    if (!selectedAccount || !recipientAddress || !sendAmount) {
      toast.info('Please fill in all fields')
      return
    }

    setIsSending(true)
    const loadingToast = toast.loading('Sending transaction...')

    try {
      const { solana, phantom } = window as any
      const walletAdapter = phantom?.solana || solana

      if (!walletAdapter) throw new Error('Wallet not found')

      // Validate recipient address
      let recipientPubkey: PublicKey
      try {
        recipientPubkey = new PublicKey(recipientAddress)
      } catch {
        toast.error('Invalid recipient address', { id: loadingToast })
        setIsSending(false)
        return
      }

      // Define sender public key and transfer amount
      const senderPubkey = new PublicKey(selectedAccount.address)
      const transferAmount = parseFloat(sendAmount)

      // Create a transfer instruction for transferring SOL from sender to recipient
      const transferInstruction = SystemProgram.transfer({
        fromPubkey: senderPubkey,
        toPubkey: recipientPubkey,
        lamports: transferAmount * LAMPORTS_PER_SOL // Convert transferAmount to lamports
      })

      // Add the transfer instruction to a new transaction (Legacy)
      const transaction = new Transaction().add(transferInstruction)

      // Get recent blockhash (Legacy method)
      const { blockhash } = await connection.getLatestBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = senderPubkey

      // Request wallet to sign and send transaction
      const { signature } = await walletAdapter.signAndSendTransaction(transaction)

      toast.loading('Confirming transaction...', { id: loadingToast })

      // Wait for transaction confirmation
      await connection.confirmTransaction(signature, 'confirmed')

      toast.success(`Transaction successful! Signature: ${signature}`, { id: loadingToast })

      // Reset form and refresh balance
      setRecipientAddress('')
      setSendAmount('')
      setShowSendModal(false)
      refreshBalance()

    } catch (error) {
      console.error('Transaction failed:', error)
      toast.error(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { id: loadingToast })
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyAddress = async (address: string) => {
    await copyAddress(address)
    toast.success('Address copied to clipboard!')
  }

  const handleAirdropSOL = async () => {
    if (!selectedAccount) return

    const loadingToast = toast.loading('Requesting airdrop... This may take a few seconds.')

    try {
      const publicKey = new PublicKey(selectedAccount.address)

      // Request 1 SOL airdrop (only works on devnet/testnet)
      const signature = await connection.requestAirdrop(
        publicKey,
        LAMPORTS_PER_SOL
      )

      await connection.confirmTransaction(signature, 'confirmed')

      toast.success('Airdrop successful! 1 SOL has been added to your wallet.', { id: loadingToast })
      refreshBalance()

    } catch (error) {
      console.error('Airdrop failed:', error)
      toast.error('Airdrop failed. Make sure you are connected to devnet/testnet.', { id: loadingToast })
    }
  }

  return (
    <div className="w-full max-w-5xl mx-auto bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-2xl p-6 sm:p-8 min-h-[600px] relative">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9945FF] to-[#14F195] flex items-center justify-center shadow-lg">
            <div className="w-12 h-12 rounded-full bg-[#37322f] flex items-center justify-center">
              <span className="text-white font-bold text-lg font-sans">S</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#37322f] font-serif">Solana Wallet</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[rgba(55,50,47,0.60)] font-sans">
                Connected to {selectedWallet || 'Solana Wallet'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={refreshBalance}
            className="text-[#37322f] border-[rgba(55,50,47,0.12)] hover:bg-[#37322f]/5 font-sans"
          >
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={disconnectWallet}
            className="text-red-700 border-red-700 hover:bg-red-200 font-sans"
          >
            Disconnect
          </Button>
        </div>
      </div>


      {/* Balance Section */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#9945FF] to-[#14F195] rounded flex items-center justify-center">
            <span className="text-white text-sm font-bold">◎</span>
          </div>
          <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">Solana Balance</span>
        </div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold text-[#37322f] font-serif">
            {balance.toFixed(4)}
          </span>
          <span className="text-[rgba(55,50,47,0.60)] text-lg font-sans">SOL</span>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#F7F5F3] rounded-lg border border-[rgba(55,50,47,0.12)]">
            <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">Address</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[rgba(55,50,47,0.80)] text-sm font-mono">
              {selectedAccount ? formatAddress(selectedAccount.address) : 'Not connected'}
            </span>
            {selectedAccount && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyAddress(selectedAccount.address)}
                className="text-[#37322f] hover:bg-[#37322f]/5 text-xs p-1"
              >
                📋
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <Button
            onClick={() => setShowSendModal(true)}
            className="bg-[#37322f] hover:bg-[#37322f]/90 text-white py-3 font-sans shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] rounded-full"
          >
            Send SOL
          </Button>
          <Button
            variant="outline"
            onClick={() => handleCopyAddress(selectedAccount?.address || '')}
            className="py-3 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 font-sans rounded-full"
          >
            Receive
          </Button>
          <Button
            variant="outline"
            onClick={handleAirdropSOL}
            className="py-3 border-[rgba(55,50,47,0.12)] text-[#9945FF] hover:bg-[#9945FF]/5 font-sans rounded-full"
          >
            Get SOL (Devnet)
          </Button>
          <Button
            variant="outline"
            className="py-3 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 font-sans rounded-full"
          >
            Swap Tokens
          </Button>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-[#37322f] mb-4 font-serif">Send SOL</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">Recipient Address</label>
                <input
                  type="text"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  placeholder="Enter Solana address"
                  className="w-full px-4 py-2 border border-[rgba(55,50,47,0.12)] rounded-lg font-mono text-sm focus:outline-none focus:border-[#9945FF]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#37322f] mb-2">Amount (SOL)</label>
                <input
                  type="number"
                  value={sendAmount}
                  onChange={(e) => setSendAmount(e.target.value)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-4 py-2 border border-[rgba(55,50,47,0.12)] rounded-lg text-sm focus:outline-none focus:border-[#9945FF]"
                />
                <div className="text-xs text-[rgba(55,50,47,0.60)] mt-1">
                  Available: {balance.toFixed(4)} SOL
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleSendSOL}
                disabled={isSending || !recipientAddress || !sendAmount}
                className="flex-1 bg-[#9945FF] hover:bg-[#9945FF]/90 text-white py-3 font-sans rounded-full disabled:opacity-50"
              >
                {isSending ? 'Sending...' : 'Send'}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowSendModal(false)
                  setRecipientAddress('')
                  setSendAmount('')
                }}
                className="flex-1 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 py-3 font-sans rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs Section */}
      <div className="border-b border-[rgba(55,50,47,0.12)] mb-6 relative z-10">
        <nav className="flex space-x-8">
          {['Tokens', 'NFTs', 'Activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`py-2 px-1 border-b-2 font-medium text-sm font-sans ${activeTab === tab.toLowerCase()
                  ? 'border-[#9945FF] text-[#9945FF]'
                  : 'border-transparent text-[rgba(55,50,47,0.60)] hover:text-[rgba(55,50,47,0.80)]'
                }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="text-center py-16 relative z-10">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-[#37322f] mb-2 font-serif">
            Connected to Solana {balance === 0 ? 'Devnet' : 'Network'}
          </h3>
          <p className="text-[rgba(55,50,47,0.80)] mb-6 font-sans">
            {balance === 0
              ? 'Click "Get SOL (Devnet)" to receive test SOL tokens'
              : 'Your wallet is ready to use!'}
          </p>
        </div>

        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={handleAirdropSOL}
            className="bg-gradient-to-r from-[#9945FF] to-[#14F195] hover:opacity-90 text-white px-6 py-3 font-sans rounded-full"
          >
            Get Test SOL (Devnet Only)
          </Button>
          <p className="text-xs text-[rgba(55,50,47,0.50)] max-w-md">
            Note: Airdrops only work on Solana Devnet. Switch your wallet to devnet to receive test tokens.
          </p>
        </div>
      </div>
    </div>
  )
}