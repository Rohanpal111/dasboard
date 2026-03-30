/**
 * useAuth.js
 * ─────────────────────────────────────────────────────────
 * Custom hook for authentication state and actions.
 * Stores user + dashboard + subscription from business login.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { loginBusiness, logoutUser } from '@/services/authService';
import { isAuthenticated, removeToken, getUserSession, getInitials } from '@/lib/helpers';

export function useAuth() {
  const router = useRouter();
  const [user,         setUser]         = useState(null);
  const [dashboard,    setDashboard]    = useState(null);
  const [subscription, setSubscription] = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);

  // ── Hydrate from localStorage on mount ────────────────
  useEffect(() => {
    if (!isAuthenticated()) {
      setLoading(false);
      return;
    }
    const session = getUserSession();
    if (session.user) {
      setUser(session.user);
      setDashboard(session.dashboard);
      setSubscription(session.subscription);
    }
    setLoading(false);
  }, []);

  // ── Login ──────────────────────────────────────────────
  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await loginBusiness(credentials);
      setUser(data.user);
      setDashboard(data.dashboard);
      setSubscription(data.subscription);
      if (data.user?.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return { success: true };
    } catch (err) {
      const msg = err.message || 'Login failed';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [router]);

  // ── Logout ─────────────────────────────────────────────
  const logout = useCallback(() => {
    logoutUser();
    setUser(null);
    setDashboard(null);
    setSubscription(null);
    router.push('/login');
  }, [router]);

  // Build user object with initials for UI
  const userWithInitials = user ? {
    ...user,
    initials: getInitials(user.name),
  } : null;

  return {
    user: userWithInitials,
    dashboard,
    subscription,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };
}
