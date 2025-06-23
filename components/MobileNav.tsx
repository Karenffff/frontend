'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
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
        <button className="p-2">
          <Image
            src="/icons/hamburger.svg"
            width={30}
            height={30}
            alt="menu"
            className="cursor-pointer"
          />
        </button>
      </SheetTrigger>

      <SheetContent side="left" className="bg-white w-[260px] px-4 py-6 border-none">
        <Link href="/" className="flex items-center gap-2 mb-6">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="Logo"
          />
          <h1 className="text-2xl font-bold font-ibm-plex-serif text-black">BFCU</h1>
        </Link>

        <nav className="flex flex-col gap-4">
          {sidebarLinks.map((item) => {
            const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)
            return (
              <SheetClose asChild key={item.route}>
                <Link
                  href={item.route}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-md",
                    isActive ? "bg-bank-gradient text-white" : "hover:bg-gray-100"
                  )}
                >
                  <Image
                    src={item.imgURL}
                    alt={item.label}
                    width={20}
                    height={20}
                    className={cn({ 'brightness-[3] invert-0': isActive })}
                  />
                  <p className={cn("text-base font-semibold", {
                    "text-white": isActive,
                    "text-black-2": !isActive,
                  })}>
                    {item.label}
                  </p>
                </Link>
              </SheetClose>
            )
          })}
        </nav>

        <div className="mt-8">
          <Footer user={user} type="mobile" />
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
