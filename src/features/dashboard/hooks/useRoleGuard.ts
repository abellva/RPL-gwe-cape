'use client';

import { useAuth } from '@/src/features/auth/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

type AllowedRole = 'admin' | 'office_provider' | 'user';

export function useRoleGuard(allowedRole: AllowedRole) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || isLoading) return;
    if (!user || user.role !== allowedRole) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, allowedRole, router, mounted]);

  return {
    user,
    isLoading: !mounted || isLoading,
    isAuthorized: mounted && !isLoading && !!user && user.role === allowedRole,
  };
}
