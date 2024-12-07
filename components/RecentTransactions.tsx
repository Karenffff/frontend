"use client";

import { useState } from "react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionsTable from "./TransactionsTable";
import { Pagination } from "./Pagination";

const RecentTransactions = ({
  accounts = [],
  transactions = [],
  page = 1,
}: RecentTransactionsProps) => {
  const [activeAccountId, setActiveAccountId] = useState(accounts[0]?.id || ""); // Default to the first account
  const rowsPerPage = 10;

  // Filter transactions based on the active account
  // const filteredTransactions = transactions.filter(
  //   (transaction) => transaction.accountId === activeAccountId
  // );

  const totalPages = Math.ceil(transactions.length / rowsPerPage);
  // const indexOfLastTransaction = page * rowsPerPage;
  // const indexOfFirstTransaction = indexOfLastTransaction - rowsPerPage;

  // const currentTransactions = filteredTransactions.slice(
  //   indexOfFirstTransaction,
  //   indexOfLastTransaction
  // );

  return (
    <section className="recent-transactions">
      <header className="flex items-center justify-between">
        <h2 className="recent-transactions-label">Recent transactions</h2>
        <Link
          href={`/transaction-history/?id=${activeAccountId}`}
          className="view-all-btn"
        >
          View all
        </Link>
      </header>

      <Tabs
        defaultValue={accounts[0]?.id || ""}
        onValueChange={(value) => setActiveAccountId(value)} // Track active account
        className="w-full"
      >
        <TabsList className="recent-transactions-tablist">
          {accounts.map((account: Account) => (
            <TabsTrigger key={account.id} value={account.id}>
              {account.officialName} {/* Display account name */}
            </TabsTrigger>
          ))}
        </TabsList>

        {accounts.map((account: Account) => (
          <TabsContent
            value={account.id}
            key={account.id}
            className="space-y-4"
          >
            <div className="bank-info">
              <h3>{account.officialName}</h3>
              <p>Type: {account.account_type}</p>
              <p>Balance: {account.balance}</p>
            </div>

            <TransactionsTable transactions={transactions} />

            {totalPages > 1 && (
              <div className="my-4 w-full">
                <Pagination totalPages={totalPages} page={page} />
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
};

export default RecentTransactions;
