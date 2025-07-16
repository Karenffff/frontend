"use client"

import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

const MobileNav = ({ user }: { user: any }) => {
  const pathname = usePathname()

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          className="p-2 rounded-md hover:bg-gray-100 transition-colors touch-manipulation"
          aria-label="Open navigation menu"
        >
          <Image src="/icons/hamburger.svg" width={24} height={24} alt="Menu" className="w-6 h-6" />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-white w-[280px] px-0 py-0 border-none flex flex-col h-full">
        {/* Header with safe area */}
        <div className="pt-safe-area-inset-top px-4 py-6 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/logo.svg" width={24} height={24} alt="Logo" />
            <h1 className="text-2xl font-bold font-ibm-plex-serif text-black">BFCU</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto">
          <div className="flex flex-col gap-2">
            {sidebarLinks.map((item) => {
              const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

              return (
                <SheetClose asChild key={item.route}>
                  <Link
                    href={item.route}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 touch-manipulation",
                      isActive
                        ? "bg-blue-700 text-white shadow-sm"
                        : "hover:bg-gray-50 active:bg-gray-100 text-gray-700",
                    )}
                  >
                    <Image
                      src={item.imgURL || "/placeholder.svg"}
                      alt={item.label}
                      width={20}
                      height={20}
                      className={cn("w-5 h-5 transition-all", { "brightness-0 invert": isActive })}
                    />
                    <p className={cn("text-base font-medium", isActive ? "text-white" : "text-gray-700")}>
                      {item.label}
                    </p>
                  </Link>
                </SheetClose>
              )
            })}
          </div>
        </nav>

        {/* Footer with safe area */}
        <div className="px-4 py-4 pb-safe-area-inset-bottom border-t border-gray-100 mt-auto">
          <Footer user={user} type="mobile" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
