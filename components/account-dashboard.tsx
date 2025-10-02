"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useWallet } from './wallet-context'

export function AccountDashboard() {
  const { wallets, activeWallet, disconnectWallet, createNewWallet, switchWallet, deleteWallet, copyAddress } = useWallet()
  const [activeTab, setActiveTab] = useState('tokens')
  const [showWalletList, setShowWalletList] = useState(false)
  const [showCreateWallet, setShowCreateWallet] = useState(false)
  const [newWalletName, setNewWalletName] = useState('')

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  const handleCreateWallet = async () => {
    if (newWalletName.trim()) {
      await createNewWallet(newWalletName.trim())
      setNewWalletName('')
      setShowCreateWallet(false)
    }
  }

  const handleCopyAddress = async (address: string) => {
    await copyAddress(address)
    // You could add a toast notification here
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white shadow-[0px_0px_0px_0.9056603908538818px_rgba(0,0,0,0.08)] overflow-hidden rounded-[6px] sm:rounded-[8px] lg:rounded-[9.06px] p-6 sm:p-8 min-h-[600px] relative">
      {/* Decorative border pattern - top */}
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden">
        <div className="flex">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-1 border-r border-[rgba(55,50,47,0.08)]"
            />
          ))}
        </div>
      </div>
      
      {/* Decorative border pattern - bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div className="flex">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="w-4 h-1 border-r border-[rgba(55,50,47,0.08)]"
            />
          ))}
        </div>
      </div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#37322f] to-[#49423D] flex items-center justify-center shadow-[0px_2px_4px_rgba(50,45,43,0.06)]">
            <div className="w-12 h-12 rounded-full bg-[#37322f] flex items-center justify-center">
              <span className="text-white font-bold text-lg font-sans">A</span>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#37322f] font-serif">Welcome back, Ankit!</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-[rgba(55,50,47,0.60)] font-sans">
                {wallets.length} wallet{wallets.length !== 1 ? 's' : ''} • Active: {activeWallet?.name}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowWalletList(!showWalletList)}
            className="text-[#37322f] border-[rgba(55,50,47,0.12)] hover:bg-[#37322f]/5 font-sans"
          >
            {!showWalletList ? 'View Wallets' : 'Hide Wallets'}
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

      {/* Wallet Management Panel */}
      {showWalletList && (
        <div className="mb-8 relative z-10 bg-[#F7F5F3] rounded-lg border border-[rgba(55,50,47,0.12)] p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-[#37322f] font-serif">Your Wallets</h3>
            <Button 
              onClick={() => setShowCreateWallet(true)}
              className="bg-[#37322f] hover:bg-[#37322f]/90 text-white text-sm font-sans rounded-full px-4 py-2"
            >
              + New Wallet
            </Button>
          </div>
          
          <div className="space-y-2">
            {wallets.map((wallet) => (
              <div 
                key={wallet.id}
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  wallet.isActive 
                    ? 'bg-white border-[#37322f] shadow-sm' 
                    : 'bg-white/50 border-[rgba(55,50,47,0.12)] hover:bg-white/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${wallet.isActive ? 'bg-[#37322f]' : 'bg-[rgba(55,50,47,0.30)]'}`} />
                  <div>
                    <div className="font-medium text-[#37322f] font-sans">{wallet.name}</div>
                    <div className="text-sm text-[rgba(55,50,47,0.60)] font-mono">{formatAddress(wallet.publicKey)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyAddress(wallet.publicKey)}
                    className="text-[#37322f] hover:bg-[#37322f]/5 text-xs"
                  >
                    Copy
                  </Button>
                  {!wallet.isActive && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => switchWallet(wallet.id)}
                      className="text-[#37322f] hover:bg-[#37322f]/5 text-xs"
                    >
                      Switch
                    </Button>
                  )}
                  {wallets.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteWallet(wallet.id)}
                      className="text-red-600 hover:bg-red-50 text-xs"
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Create New Wallet Form */}
          {showCreateWallet && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-[rgba(55,50,47,0.12)]">
              <h4 className="text-md font-semibold text-[#37322f] font-sans mb-3">Create New Wallet</h4>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Wallet name (e.g., Trading Wallet)"
                  value={newWalletName}
                  onChange={(e) => setNewWalletName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-[rgba(55,50,47,0.12)] rounded-lg text-sm font-sans focus:outline-none focus:border-[#37322f]"
                />
                <Button
                  onClick={handleCreateWallet}
                  disabled={!newWalletName.trim()}
                  className="bg-[#37322f] hover:bg-[#37322f]/90 text-white text-sm font-sans rounded-lg px-4"
                >
                  Create
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCreateWallet(false)
                    setNewWalletName('')
                  }}
                  className="text-[#37322f] border-[rgba(55,50,47,0.12)] hover:bg-[#37322f]/5 text-sm font-sans rounded-lg"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Balance Section */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#37322f]/10 rounded flex items-center justify-center">
            <span className="text-[#37322f] text-xs">💼</span>
          </div>
          <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">Solana Wallet Assets</span>
        </div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold text-[#37322f] font-serif">${activeWallet?.balance.toFixed(2) || '0.00'}</span>
          <span className="text-[rgba(55,50,47,0.60)] text-lg font-sans">USD</span>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#F7F5F3] rounded-lg border border-[rgba(55,50,47,0.12)]">
            <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">📋 {activeWallet?.name} Address</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[rgba(55,50,47,0.80)] text-sm font-mono">
              {activeWallet ? formatAddress(activeWallet.publicKey) : 'Not connected'}
            </span>
            {activeWallet && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopyAddress(activeWallet.publicKey)}
                className="text-[#37322f] hover:bg-[#37322f]/5 text-xs p-1"
              >
                📋
              </Button>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-4 gap-3 mb-8">
          <Button className="bg-[#37322f] hover:bg-[#37322f]/90 text-white py-3 font-sans shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] rounded-full">
            Send SOL
          </Button>
          <Button variant="outline" className="py-3 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 font-sans rounded-full">
            Receive
          </Button>
          <Button variant="outline" className="py-3 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 font-sans rounded-full">
            Stake SOL
          </Button>
          <Button variant="outline" className="py-3 border-[rgba(55,50,47,0.12)] text-[#37322f] hover:bg-[#37322f]/5 font-sans rounded-full">
            Swap Tokens
          </Button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="border-b border-[rgba(55,50,47,0.12)] mb-6 relative z-10">
        <nav className="flex space-x-8">
          {['Tokens', 'NFTs', 'Activity'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`py-2 px-1 border-b-2 font-medium text-sm font-sans ${
                activeTab === tab.toLowerCase()
                  ? 'border-[#37322f] text-[#37322f]'
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
            No Solana tokens found!
          </h3>
          <p className="text-[rgba(55,50,47,0.80)] mb-6 font-sans">
            Start by receiving SOL or other Solana tokens:
          </p>
        </div>
        
        <Button className="bg-[#37322f] hover:bg-[#37322f]/90 text-white px-6 py-3 font-sans shadow-[0px_0px_0px_2.5px_rgba(255,255,255,0.08)_inset] rounded-full">
          <span className="mr-2">+</span>
          Receive SOL
        </Button>
      </div>
    </div>
  )
}

