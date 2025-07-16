"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"

interface MobileNavProps {
  user: any // Replace with your user type
}

export default function MobileNav({ user }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6 text-gray-600" /> : <Menu className="w-6 h-6 text-gray-600" />}
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu panel */}
          <div className="fixed top-[calc(env(safe-area-inset-top)+4rem)] left-0 right-0 bg-white border-b border-gray-200 z-50 shadow-lg">
            <div className="px-4 py-2 space-y-2">
              {/* Add your navigation items here */}
              <div className="py-2 border-b border-gray-100">
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>

              {/* Example nav items */}
              <a href="/dashboard" className="block py-2 text-gray-800 hover:text-blue-600">
                Dashboard
              </a>
              <a href="/accounts" className="block py-2 text-gray-800 hover:text-blue-600">
                Accounts
              </a>
              <a href="/transactions" className="block py-2 text-gray-800 hover:text-blue-600">
                Transactions
              </a>
              <a href="/settings" className="block py-2 text-gray-800 hover:text-blue-600">
                Settings
              </a>
            </div>
          </div>
        </>
      )}
    </>
  )
}
