import EmailVerification from "@/components/EmailVerification"

export default function VerifyEmailPage({ params }: { params: { uidb64: string; token: string } }) {
  return <EmailVerification uidb64={params.uidb64} token={params.token} />
}

