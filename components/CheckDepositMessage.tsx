"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

const CheckDepositMessage = () => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCheckDeposit = () => {
    setShowMessage(true);
  };

  return (
    <div className="space-y-4">
      {!showMessage ? (
        <Button onClick={handleCheckDeposit} className="w-full">
          Deposit a Check
        </Button>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Feature Not Available</AlertTitle>
          <AlertDescription>
            We're sorry, but the check deposit feature is not available for your account at this time. Please contact customer support for more information.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default CheckDepositMessage;

