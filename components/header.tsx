"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useWallet } from "./wallet-context"

export function Header() {
  const { isConnected, selectedAccount } = useWallet()
  
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 4)}...${address.slice(-4)}`
  }

  return (
    <>
      <div className="self-stretch border-[rgba(55,50,47,0.12)] flex justify-center items-start border-t border-b-0">
        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Left decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
        <nav className="w-5xl flex items-center justify-center h-12 z-10 px-4 border-l border-r">
          <div className="flex items-center justify-between w-full">
            <Link href="/" className="text-[#37322f] font-semibold text-lg flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#803100] to-[#a6a296] flex items-center justify-center">
                <span className="text-white text-xs font-bold">Z</span>
              </div>
              ZipLink
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                Products
              </Button>
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                Pricing
              </Button>
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium">
                Docs
              </Button>
            </div>
            
            {/* Wallet Connection Status */}
            {isConnected && selectedAccount ? (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#9945FF]/10 to-[#14F195]/10 rounded-full border border-[#9945FF]/20">
                 <div className="w-2 h-2 rounded-full bg-[#14F195] animate-pulse" />
                 <span className="text-sm text-[#37322f] font-mono font-medium">
                   {formatAddress(selectedAccount.address)}
                 </span>
               </div>
            ) : (
              <Button 
                variant="ghost" 
                className="text-[#37322f] bg-[#37322f]/5 hover:bg-[#37322f]/20 text-sm px-4 py-2 h-auto font-sans"
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </nav>

        <div className="w-4 sm:w-6 md:w-8 lg:w-12 self-stretch relative overflow-hidden">
          {/* Right decorative pattern */}
          <div className="w-[120px] sm:w-[140px] md:w-[162px] left-[-40px] sm:left-[-50px] md:left-[-58px] top-[-120px] absolute flex flex-col justify-start items-start">
            {Array.from({ length: 50 }).map((_, i) => (
              <div
                key={i}
                className="self-stretch h-3 sm:h-4 rotate-[-45deg] origin-top-left outline outline-[0.5px] outline-[rgba(3,7,18,0.08)] outline-offset-[-0.25px]"
              />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}