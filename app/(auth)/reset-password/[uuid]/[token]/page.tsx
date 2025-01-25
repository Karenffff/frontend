"use client"

import { useParams } from "next/navigation"
import PasswordResetForm from "@/components/PasswordResetForm"
import Image from "next/image"
import Link from "next/link"

export default function ResetPasswordPage() {
  const params = useParams()

  const uid = params.uuid as string
  const token = params.token as string


  if (!uid || !token) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-2xl font-semibold text-red-600 mb-4">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-4">The password reset link is invalid or has expired.</p>
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Request a new password reset
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-md mx-auto">
        <header className="flex flex-col gap-5 md:gap-8 mb-8">
          <Link href="/" className="cursor-pointer flex items-center gap-1">
            <Image src="/icons/logo.svg" width={34} height={34} alt="BFCU logo" />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">BFCU</h1>
          </Link>

          <div className="flex flex-col gap-1 md:gap-3">
            <h1 className="text-24 lg:text-36 font-semibold text-gray-900">Reset Your Password</h1>
            <p className="text-16 font-normal text-gray-600">Enter your new password below</p>
          </div>
        </header>

        <PasswordResetForm uid={uid} token={token} />
      </div>
    </div>
  )
}

