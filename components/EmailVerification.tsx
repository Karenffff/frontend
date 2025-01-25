"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { verifyEmail } from "@/lib/actions/user.actions"


interface EmailVerificationProps {
    uidb64: string
    token: string
  }
  
  export default function EmailVerification({ uidb64, token }: EmailVerificationProps) {
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [message, setMessage] = useState<string>("Verifying your email...")
    const router = useRouter()
  
    useEffect(() => {
      const verify = async () => {
        const result = await verifyEmail(uidb64, token)
        if (result.success) {
          setStatus("success")
          setMessage(result.error)
          setTimeout(() => {
            router.push("/sign-in")
          }, 3000)
        } else {
          setStatus("error")
          setMessage(result.error || "Verification failed. Please try again.")
        }
      }
  
      verify()
    }, [uidb64, token, router])
  
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="w-full max-w-lg px-6 text-center">
          <h1 className="text-4xl font-bold mb-6">Email Verification</h1>
          {status === "loading" && (
            <div className="space-y-6">
              <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 text-lg">{message}</p>
            </div>
          )}
          {status === "success" && (
            <div className="space-y-4">
              <p className="text-green-600 text-lg">{message}</p>
              <p className="text-gray-600">Redirecting to sign in page...</p>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-4">
              <p className="text-red-600 text-lg">{message}</p>
              <button
                onClick={() => router.push("/sign-in")}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg text-lg"
              >
                Go to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }
  
  