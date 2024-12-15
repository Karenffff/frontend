import HeaderBox from '@/components/HeaderBox'
import CheckDepositMessage from '@/components/CheckDepositMessage'

export default function CheckDepositPage() {
  return (
    <div className="check-deposit">
      <div className="check-deposit-header">
        <HeaderBox 
          title="Check Deposit"
          subtext="Deposit checks directly from your mobile device."
        />
      </div>

      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <CheckDepositMessage />
      </div>
    </div>
  )
}

