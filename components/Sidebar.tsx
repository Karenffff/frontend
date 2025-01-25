'use client'
import { useState } from 'react'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Footer from './Footer'
import PlaidLink from './PlaidLink'

interface SiderbarProps {
  user: any; // Replace 'any' with the correct user type
}

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <section 
      className={cn(
        "sidebar transition-all duration-300 ease-in-out",
        isExpanded ? "w-64" : "w-16"
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <nav className="flex flex-col gap-4">
        <Link href="/" className="mb-12 cursor-pointer flex items-center gap-2">
          <Image 
            src="/icons/logo.svg"
            width={34}
            height={34}
            alt="BFCU logo"
            className="size-[24px] max-xl:size-14"
          />
          {isExpanded && <h1 className="sidebar-logo">BFCU</h1>}
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`)

          return (
            <Link href={item.route} key={item.label}
              className={cn('sidebar-link', { 'bg-bank-gradient': isActive })}
            >
              <div className="relative size-6">
                <Image 
                  src={item.imgURL || "/placeholder.svg"}
                  alt={item.label}
                  fill
                  className={cn({
                    'brightness-[3] invert-0': isActive
                  })}
                />
              </div>
              {isExpanded && (
                <p className={cn("sidebar-label", { "!text-white": isActive })}>
                  {item.label}
                </p>
              )}
            </Link>
          )
        })}
        
        {/* <div user={user} /> */}
      </nav>

      {isExpanded && <Footer user={user} />}
    </section>
  )
}

export default Sidebar

