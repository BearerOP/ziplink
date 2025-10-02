import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Header() {
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
        <nav className="w-5xl flex items-center justify-center h-12 z-[999] px-4 border-l border-r">
          <div className="flex items-center justify-between  w-full">
            <Link href="/" className="text-[#37322f] font-semibold text-lg">ZipLink</Link>
            <div className="hidden md:flex items-center space-x-6">
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium cursor-pointer">Products</Button>
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium cursor-pointer">Pricing</Button>
              <Button variant="link" className="text-[#37322f] hover:text-[#37322f]/80 text-sm font-medium cursor-pointer">Docs</Button>
            </div>
            <Button variant="ghost" className="text-[#37322f] bg-[#37322f]/5 hover:bg-[#37322f]/20 cursor-pointer ">
              Log in
            </Button>
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
