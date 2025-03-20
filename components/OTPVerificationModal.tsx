"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Loader2 } from "lucide-react";
import { validateLocalTransfer } from "@/lib/actions/bank.actions";

interface OTPVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  transferId: number;
  onSuccess: () => void;
}

const OTPVerificationModal = ({ isOpen, onClose, transferId, onSuccess }: OTPVerificationModalProps) => {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    setOtp("");
    setError("");
    setIsLoading(false);
    setCountdown(60);
    setCanResend(false);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length < 4) {
      setError("Please enter a valid OTP code");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await validateLocalTransfer(transferId, otp.trim());
      onSuccess();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || "Failed to verify OTP. Please try again.");
      } else {
        setError("Failed to verify OTP. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Verify Transfer</h2>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100" aria-label="Close">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mt-4">
          <p className="text-sm text-gray-600">
            For your security, we've sent a one-time verification code to your registered email/phone. Please enter the
            code below to complete your transfer.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                className="mt-1 block w-full text-center text-xl tracking-widest"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex items-center justify-between">
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Transfer"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationModal;