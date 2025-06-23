'use client'

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { sidebarLinks } from "@/constants"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Footer from "./Footer"

const MobileNav = ({ user }: MobileNavProps) => {
  const pathname = usePathname();

  return (
    <section className="w-full max-w-[264px] md:hidden z-50">
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

        <SheetContent
          side="left"
          className="bg-white border-none w-[260px] px-4 py-6"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mb-8">
            <Image 
              src="/icons/logo.svg"
              width={34}
              height={34}
              alt="Horizon logo"
            />
            <h1 className="text-2xl font-bold font-ibm-plex-serif text-black">BFCU</h1>
          </Link>

          {/* Sidebar nav */}
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
                    <p className={cn("text-base font-semibold", { "text-white": isActive, "text-black": !isActive })}>
                      {item.label}
                    </p>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="mt-10">
            <Footer user={user} type="mobile" />
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

export default MobileNav
