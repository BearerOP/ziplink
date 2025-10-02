import { Button } from "@/components/ui/button"

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
         <div className="text-[#37322f] font-semibold text-lg">ZipLink</div>
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
  
                    {/* <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-0 border-l border-r border-[rgba(55,50,47,0.12)]">

                      {Array.from({ length: 8 }).map((_, index) => {
                        const isMobileFirstColumn = index % 2 === 0
                        const isMobileLastColumn = index % 2 === 1
                        const isDesktopFirstColumn = index % 4 === 0
                        const isDesktopLastColumn = index % 4 === 3
                        const isMobileBottomRow = index >= 6
                        const isDesktopTopRow = index < 4
                        const isDesktopBottomRow = index >= 4
  
                        return (
                          <div
                            key={index}
                            className={`
                              h-24 xs:h-28 sm:h-32 md:h-36 lg:h-40 flex justify-center items-center gap-1 xs:gap-2 sm:gap-3
                              border-b border-[rgba(227,226,225,0.5)]
                              ${index < 6 ? "sm:border-b-[0.5px]" : "sm:border-b"}
                              ${index >= 6 ? "border-b" : ""}
                              ${isMobileFirstColumn ? "border-r-[0.5px]" : ""}
                              sm:border-r-[0.5px] sm:border-l-0
                              ${isDesktopFirstColumn ? "md:border-l" : "md:border-l-[0.5px]"}
                              ${isDesktopLastColumn ? "md:border-r" : "md:border-r-[0.5px]"}
                              ${isDesktopTopRow ? "md:border-b-[0.5px]" : ""}
                              ${isDesktopBottomRow ? "md:border-t-[0.5px] md:border-b" : ""}
                              border-[#E3E2E1]
                            `}
                          >
                            <div className="w-6 h-6 xs:w-7 xs:h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 relative shadow-[0px_-4px_8px_rgba(255,255,255,0.64)_inset] overflow-hidden rounded-full">
                              <img src="/horizon-icon.svg" alt="Horizon" className="w-full h-full object-contain" />
                            </div>
                            <div className="text-center flex justify-center flex-col text-[#37322F] text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl font-medium leading-tight md:leading-9 font-sans">
                              Acute
                            </div>
                          </div>
                        )
                      })}
                    </div> */}
  
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
