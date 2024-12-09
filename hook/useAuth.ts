'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, getLoggedInUser } from '@/lib/actions/user.actions';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getLoggedInUser();
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const result = await signIn({ email, password });
    setLoading(false);

    if (result.success) {
      setUser(result.user);
      router.push('/');
      return { success: true };
    } else {
      return { success: false, error: result.error };
    }
  };

  const logout = () => {
    // Implement logout functionality here
    setUser(null);
    router.push('/login');
  };

  return { user, loading, login, logout };
};

