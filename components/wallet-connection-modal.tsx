"use client"

import React, { useState } from 'react'
import { useWallet } from './wallet-context'

interface WalletModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WalletConnectionModal({ isOpen, onClose }: WalletModalProps) {
  const { availableWallets, connectWallet } = useWallet()
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null)

  const handleWalletConnect = async (walletName: string) => {
    setIsConnecting(true)
    setConnectingWallet(walletName)

    try {
      await connectWallet(walletName)
      onClose()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      alert(`Failed to connect ${walletName}. Please try again.`)
    } finally {
      setIsConnecting(false)
      setConnectingWallet(null)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-b from-white to-white/95 backdrop-blur-sm border-b border-[rgba(55,50,47,0.12)] p-6 rounded-t-2xl z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#37322f] font-serif">Connect Wallet</h2>
              <p className="text-sm text-[rgba(55,50,47,0.60)] mt-1 font-sans">
                {availableWallets.length > 0 
                  ? `${availableWallets.length} Solana wallet${availableWallets.length > 1 ? 's' : ''} detected`
                  : 'No Solana wallets detected'
                }
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isConnecting}
              className="text-[rgba(55,50,47,0.60)] hover:text-[#37322f] hover:bg-[rgba(55,50,47,0.05)] p-2 rounded-full transition-all disabled:opacity-50"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Wallet List */}
        <div className="p-6 space-y-3">
          {availableWallets.length > 0 ? (
            availableWallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleWalletConnect(wallet.name)}
                disabled={isConnecting}
                className={`w-full p-4 rounded-xl border-2 transition-all group ${
                  isConnecting && connectingWallet === wallet.name
                    ? 'border-[#9945FF] bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10'
                    : 'border-[rgba(55,50,47,0.12)] hover:border-[#9945FF] hover:bg-gradient-to-r hover:from-[#9945FF]/5 hover:to-[#14F195]/5'
                } ${
                  isConnecting ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white border-2 border-[rgba(55,50,47,0.12)] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform overflow-hidden">
                      {wallet.icon.startsWith('/') ? (
                        <img 
                          src={wallet.icon} 
                          alt={wallet.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">{wallet.icon}</span>
                      )}
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-[#37322f] font-sans flex items-center gap-2">
                        {wallet.name}
                        <span className="text-xs bg-[#14F195] text-[#37322f] px-2 py-0.5 rounded-full font-medium">
                          Detected
                        </span>
                      </div>
                      <div className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                        Click to connect
                      </div>
                    </div>
                  </div>
                  {isConnecting && connectingWallet === wallet.name ? (
                    <div className="w-5 h-5 border-2 border-[#9945FF] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-[rgba(55,50,47,0.40)] group-hover:text-[#9945FF] transition-colors"
                    >
                      <path d="M7 10l3 3 3-3M7 7l3 3 3-3" />
                    </svg>
                  )}
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[rgba(55,50,47,0.05)] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[rgba(55,50,47,0.40)]">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#37322f] mb-2 font-serif">
                No Wallets Detected
              </h3>
              <p className="text-sm text-[rgba(55,50,47,0.60)] mb-4 font-sans max-w-sm mx-auto">
                Please install a Solana wallet extension to continue. We recommend Phantom for beginners.
              </p>
              <div className="flex flex-col gap-2 mt-6">
                <a
                  href="https://phantom.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-gradient-to-r from-[#9945FF] to-[#14F195] text-white rounded-full font-sans font-medium hover:opacity-90 transition-opacity"
                >
                  Install Phantom Wallet
                </a>
                <a
                  href="https://solana.com/ecosystem/explore?categories=wallet"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#9945FF] hover:underline font-sans"
                >
                  View all Solana wallets →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {availableWallets.length > 0 && (
          <div className="border-t border-[rgba(55,50,47,0.12)] p-6 bg-[#F7F5F3] rounded-b-2xl">
            <div className="flex items-start gap-3">
              <div className="text-2xl">🔒</div>
              <div className="flex-1">
                <p className="text-sm text-[rgba(55,50,47,0.80)] font-sans mb-2">
                  <strong className="font-semibold">Secure Connection</strong>
                </p>
                <p className="text-xs text-[rgba(55,50,47,0.60)] font-sans">
                  Your keys never leave your wallet extension and are never shared with ZipLink. We only request transaction signatures.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
