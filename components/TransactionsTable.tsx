import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { transactionCategoryStyles } from "@/constants"
import { cn, formatAmount, formatDateTime, removeSpecialCharacters } from "@/lib/utils"

const CategoryBadge = ({ category }: CategoryBadgeProps) => {
  const {
    borderColor,
    backgroundColor,
    textColor,
    chipBackgroundColor,
   } = transactionCategoryStyles[category as keyof typeof transactionCategoryStyles] || transactionCategoryStyles.default
   
  return (
    <div className={cn('category-badge', borderColor, chipBackgroundColor)}>
      <div className={cn('size-2 rounded-full', backgroundColor)} />
      <p className={cn('text-[12px] font-medium', textColor)}>{category}</p>
    </div>
  )
} 

const TransactionsTable = ({ transactions }: TransactionTableProps) => {
  return (
    <Table>
      <TableHeader className="bg-[#f9fafb]">
        <TableRow>
          <TableHead className="px-2">Transaction</TableHead>
          <TableHead className="px-2">Amount</TableHead>
          <TableHead className="px-2">Status</TableHead>
          <TableHead className="px-2">Date</TableHead>
          {/* <TableHead className="px-2 max-md:hidden">Channel</TableHead> */}
          <TableHead className="px-2 max-md:hidden">Category</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transactions) => {
          const status = (new Date(transactions.date))
          const amount = formatAmount(transactions.amount)

          const isDebit = transactions.type === 'DEBIT';
          const isCredit = transactions.type === 'CREDIT';

          return (
            <TableRow key={transactions.id} className={`${isDebit || amount[0] === '-' ? 'bg-[#FFFBFA]' : 'bg-[#F6FEF9]'} !over:bg-none !border-b-DEFAULT`}>
              <TableCell className="max-w-[250px] pl-2 pr-10">
                <div className="flex items-center gap-3">
                  <h1 className="text-14 truncate font-semibold text-[#344054]">
                    {removeSpecialCharacters(transactions.name)}
                  </h1>
                </div>
              </TableCell>
<TableCell
  className={cn(
    'pl-2 pr-10 font-semibold',
    transactions.status === 'processing'
      ? 'text-[#CA8A04]' // yellow
      : isDebit || amount[0] === '-'
      ? 'text-[#f04438]' // red
      : 'text-[#039855]' // green
  )}
>
  {isDebit ? `-${amount}` : isCredit ? amount : amount}
</TableCell>


              <TableCell className="pl-2 pr-10">
                {transactions.status}
              </TableCell>

              <TableCell className="min-w-32 pl-2 pr-10">
                {formatDateTime(new Date(transactions.date)).dateTime}
              </TableCell>

              {/* <TableCell className="pl-2 pr-10 capitalize min-w-24">
               {transactions.paymentChannel}
              </TableCell> */}

              <TableCell className="pl-2 pr-10 max-md:hidden">
               <CategoryBadge category={transactions.category} /> 
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

export default TransactionsTable
