import PinSetupForm from '@/components/PinSetupForm'

export default function PinSetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900">Set Up Your PIN</h1>
        <p className="text-center text-gray-600">Please create a 4-digit PIN for additional security.</p>
        <PinSetupForm />
      </div>
    </div>
  )
}

