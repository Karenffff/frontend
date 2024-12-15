import HeaderBox from '@/components/HeaderBox'
import PayBillsForm from '@/components/PayBillsForm'

export default function PayBillsPage() {
  return (
    <div className="pay-bills">
      <div className="pay-bills-header">
        <HeaderBox 
          title="Pay Bills"
          subtext="Manage and pay your bills in one place."
        />
      </div>

      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <PayBillsForm />
      </div>
    </div>
  )
}

