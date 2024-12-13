'use client';

import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import CustomInput from './CustomInput';
import { setPIN } from '@/lib/actions/user.actions';

const pinSchema = z.object({
  pin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d+$/, 'PIN must contain only numbers'),
  confirmPin: z.string().length(4, 'PIN must be exactly 4 digits').regex(/^\d+$/, 'PIN must contain only numbers'),
}).refine((data) => data.pin === data.confirmPin, {
  message: "PINs don't match",
  path: ['confirmPin'],
});

type PinFormValues = z.infer<typeof pinSchema>;

const PinSetupForm = () => {
  const searchParams = useSearchParams();
  const email = searchParams.get('email'); // Retrieve email from query params
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PinFormValues>({
    resolver: zodResolver(pinSchema),
    defaultValues: {
      pin: '',
      confirmPin: '',
    },
  });

  const onSubmit = async (data: PinFormValues) => {
    if (!email) {
      setError('Email is missing. Please sign up again.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await setPIN({ email, pin: data.pin });
      if (result.success) {
        // PIN set successfully, redirect as needed
      } else {
        setError(result.error || 'An error occurred while setting the PIN. Please try again.');
      }
    } catch (err) {
      console.error('Error setting PIN:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CustomInput
          control={form.control}
          name="pin"
          label="PIN"
          placeholder="Enter 4-digit PIN"
          type="password"
          inputMode="numeric"
          maxLength={4}
        />
        <CustomInput
          control={form.control}
          name="confirmPin"
          label="Confirm PIN"
          placeholder="Confirm 4-digit PIN"
          type="password"
          inputMode="numeric"
          maxLength={4}
        />
        {error && (
          <p className="text-red-600 bg-red-100 border border-red-500 p-2 rounded">
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Setting PIN...
            </>
          ) : (
            'Set PIN'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default PinSetupForm;
