import { useState } from "react";

export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);

  const showToast = ({ title, description }: { title: string; description: string }) => {
    setMessage(`${title}: ${description}`);
    setTimeout(() => setMessage(null), 3000);
  };

  return {
    message,
    showToast,
  };
};
