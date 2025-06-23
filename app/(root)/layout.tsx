import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    return (
      <iframe
        src="/home.html"
        className="w-full h-screen"
        title="Welcome Page"
        style={{ border: "none" }}
      />
    );
  }

  return (
    <main className="flex h-screen w-full font-inter bg-gray-50">
      {/* Sidebar for desktop */}
      <aside className="hidden md:flex">
        <Sidebar user={loggedIn} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Mobile top nav bar (fixed) */}
        <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white flex items-center justify-between px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2">
            <img src="/icons/logo.svg" alt="Logo" className="w-8 h-8" />
            <h1 className="text-xl font-bold text-blue-700">BFCU</h1>
          </div>
          <MobileNav user={loggedIn} />
        </div>

        {/* Page content (offset for fixed topbar) */}
        <div className="pt-16 px-4 md:p-6">
          {children}
        </div>
      </div>
    </main>
  );
}
