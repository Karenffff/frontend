import type React from "react"
import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import { getLoggedInUser } from "@/lib/actions/user.actions"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) {
    return <iframe src="/home.html" className="w-full h-screen" title="Welcome Page" style={{ border: "none" }} />
  }

  return (
    <main className="flex h-screen w-full font-inter bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex">
        <Sidebar user={loggedIn} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile top nav bar (fixed with safe area support) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
          {/* Safe area top padding for iOS */}
          <div className="pt-safe-top">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-2">
                <img src="/icons/logo.svg" alt="Logo" className="w-8 h-8" />
                <h1 className="text-xl font-bold text-blue-700">BFCU</h1>
              </div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
        </div>

        {/* Page content with proper mobile header offset */}
        <div className="flex-1 overflow-y-auto">
          <div className="pt-[calc(env(safe-area-inset-top)+4rem)] md:pt-0 px-4 md:p-6 pb-safe-bottom">{children}</div>
        </div>
      </div>
    </main>
  )
}
