'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import PinSetupForm from '@/components/PinSetupForm';

export default function PinSetupPage() {
  const [email, setEmail] = useState<string | null>(null);
  const [pin, setPin] = useState("");
  const router = useRouter();

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center">
          <Image 
            src="/icons/logo.svg"
            width={48}
            height={48}
            alt="Logo"
          />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Set Up Your PIN</h2>
          <p className="mt-2 text-sm text-gray-600">
            Please create a 4-digit PIN for additional security.
          </p>
        </div>
        <PinSetupForm  />
      </div>
    </div>
  );
}

