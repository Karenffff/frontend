import HeaderBox from '@/components/HeaderBox'
import ManageLoansForm from '@/components/ManageLoansForm'

export default function ManageLoansPage() {
  return (
    <div className="manage-loans">
      <div className="manage-loans-header">
        <HeaderBox 
          title="Manage Loans"
          subtext="View and manage your loan payments."
        />
      </div>

      <div className="space-y-6 max-w-2xl mx-auto mt-8">
        <ManageLoansForm />
      </div>
    </div>
  )
}

