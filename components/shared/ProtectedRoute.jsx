/**
 * ProtectedRoute.jsx
 * ─────────────────────────────────────────────────────────
 * Wraps pages that require authentication.
 * Redirects to /login if no token found.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated, getUserSession } from '@/lib/helpers';

export default function ProtectedRoute({ children, allowedRoles = null, redirectTo = '/login' }) {
  const router = useRouter();

  const isLoggedIn = typeof window !== 'undefined' && isAuthenticated();
  const role = getUserSession()?.user?.role;
  const isRoleAllowed = !allowedRoles || allowedRoles.includes(role);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login');
      return;
    }

    const currentRole = getUserSession()?.user?.role;
    if (allowedRoles && !allowedRoles.includes(currentRole)) {
      router.replace(redirectTo);
    }
  }, [router, allowedRoles, redirectTo]);

  // While checking auth, show nothing (or a spinner)
  if (!isLoggedIn || !isRoleAllowed) {
    return (
      <div className="flex items-center justify-center h-screen bg-dark-950">
        <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return children;
}
