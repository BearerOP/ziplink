"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { useWallet } from './wallet-context'

export function AccountDashboard() {
  const { balance, publicKey, disconnectWallet } = useWallet()
  const [activeTab, setActiveTab] = useState('tokens')

  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
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
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={disconnectWallet}
          className="text-[#37322f] hover:bg-[#37322f]/5 font-sans"
        >
          Disconnect
        </Button>
      </div>

      {/* Balance Section */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-[#37322f]/10 rounded flex items-center justify-center">
            <span className="text-[#37322f] text-xs">💼</span>
          </div>
          <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">Solana Wallet Assets</span>
        </div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-4xl font-bold text-[#37322f] font-serif">${balance.toFixed(2)}</span>
          <span className="text-[rgba(55,50,47,0.60)] text-lg font-sans">USD</span>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#F7F5F3] rounded-lg border border-[rgba(55,50,47,0.12)]">
            <span className="text-[rgba(55,50,47,0.80)] text-sm font-sans">📋 Your Solana Address</span>
          </div>
          <span className="text-[rgba(55,50,47,0.80)] text-sm font-mono">
            {publicKey ? formatAddress(publicKey) : 'Not connected'}
          </span>
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

