import HeaderBox from '@/components/HeaderBox'
import UserProfileForm from '@/components/UserProfileForm';
import { getLoggedInUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

export default async function SettingsPage() {
  const user = await getLoggedInUser()

  if (!user) {
    redirect('/sign-in')
  }

  return (
    <div className="settings">
      <div className="settings-header">
        <HeaderBox 
          title="Account Settings"
          subtext="View and edit your profile information."
        />
      </div>

      <div className="space-y-6 max-w-2xl mx-auto">
        <UserProfileForm initialData={user} />
      </div>
    </div>
  )
}

