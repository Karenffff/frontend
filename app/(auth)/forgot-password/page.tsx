import ForgotPasswordForm from "@/components/ForgotPasswordForm"
import Image from "next/image"
import Link from "next/link"

export default function ForgotPasswordPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <header className="flex flex-col gap-5 md:gap-8 mb-8">
          <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image src="/icons/logo.svg" width={34} height={34} alt="BFCU logo" />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">BFCU</h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">Forgot Password</h1>
            <p className="text-16 font-normal text-gray-600">Enter your email to reset your password</p>
          </div>
        </header>

        <ForgotPasswordForm />

        <footer className="mt-6 text-center">
          <p className="text-14 font-normal text-gray-600">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}

