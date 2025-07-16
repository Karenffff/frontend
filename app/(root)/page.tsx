
import HeaderBox from "@/components/HeaderBox"
import RecentTransactions from "@/components/RecentTransactions"
import RightSidebar from "@/components/RightSidebar"
import TotalBalanceBox from "@/components/TotalBalanceBox"
import TradingViewChart from "@/components/TradingViewChart"
import { getAccount, getAccounts } from "@/lib/actions/bank.actions"
import { getLoggedInUser } from "@/lib/actions/user.actions"
// Define SearchParamProps type locally
type SearchParamProps = {
  searchParams: {
    id?: string
    page?: string
  }
}

const Home = async ({ searchParams: { id, page } }: SearchParamProps) => {
  const currentPage = Number(page as string) || 1
  const loggedIn = await getLoggedInUser()
  const accounts = await getAccounts()
  const accountsData = accounts?.data
  const firstAccountId = accountsData && accountsData.length > 0 ? accountsData[0]?.id : null;

  // Fetch details of the first account if the ID is present
  const account = firstAccountId ? await getAccount() : { transactions: [] }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 lg:gap-8">
          {/* Left Content - Takes 3 columns on xl screens */}
          <div className="xl:col-span-3 space-y-6">
            {/* Header Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="space-y-6">
                <HeaderBox
                  type="greeting"
                  title="Welcome"
                  user={loggedIn?.firstName || loggedIn?.name || "Guest"}
                  subtext="Access and manage your account and transactions efficiently."
                />
                <TotalBalanceBox
                  accounts={accountsData}
                  totalBanks={accounts?.totalBanks}
                  totalCurrentBalance={accounts?.totalCurrentBalance}
                />
              </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 lg:p-8">
                <RecentTransactions accounts={accountsData} transactions={account?.transactions} page={currentPage} />
              </div>
            </div>

            {/* Market Overview Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
              <div className="mb-6">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Market Overview</h2>
                <p className="text-gray-600">Real-time cryptocurrency market data and trends</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 lg:p-6">
                <TradingViewChart symbol="BTCUSD" theme="light" />
              </div>
            </div>

            {/* Quick Stats Cards - Mobile/Tablet Only */}
            <div className="xl:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">Total Accounts</p>
                    <p className="text-2xl font-bold text-blue-900">{accounts?.totalBanks || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                      />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 1v6m8-6v6" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">Active Transactions</p>
                    <p className="text-2xl font-bold text-green-900">{account?.transactions?.length || 0}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Takes 1 column on xl screens */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <RightSidebar user={loggedIn} transactions={account?.transactions} banks={accountsData?.slice(0, 2)} />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Home