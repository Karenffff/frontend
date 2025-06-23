import MobileNav from "@/components/MobileNav"
import Sidebar from "@/components/Sidebar"
import { getLoggedInUser } from "@/lib/actions/user.actions"
import { redirect } from "next/navigation"

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const loggedIn = await getLoggedInUser()

  if (!loggedIn) {
    return (
      <iframe
        src="/home.html"
        className="w-full h-screen"
        title="Welcome Page"
        style={{ border: "none" }}
      />
    )
  }

  return (
    <main className="flex h-screen w-full font-inter bg-gray-50">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar user={loggedIn} />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* ✅ Hamburger visible ONLY on mobile */}
        <div className="md:hidden p-4">
          <MobileNav user={loggedIn} />
        </div>

        {/* Children content (dashboard, welcome, etc.) */}
        <div className="p-4 md:p-6">
          {children}
        </div>
      </div>
    </main>
  )
}
