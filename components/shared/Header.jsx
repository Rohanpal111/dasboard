/**
 * Header.jsx
 * ─────────────────────────────────────────────────────────
 * Top navigation bar with user avatar, sidebar toggle (mobile).
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeToken, clearUserSession } from '@/lib/helpers';

export default function Header({ user, sidebarOpen = false, onSidebarToggle }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    removeToken();
    clearUserSession();
    router.push('/login');
  };

  return (
    <header className="h-14 bg-dark-950 border-b border-dark-800 flex items-center px-4 md:px-5 gap-3 flex-shrink-0">
      {/* Sidebar toggle - Mobile only */}
      <button
        id="sidebar-toggle"
        onClick={onSidebarToggle}
        className="md:hidden w-8 h-8 flex items-center justify-center text-dark-300 hover:text-white hover:bg-dark-800 rounded transition-colors"
        title="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex-1" />

      {/* Role badge */}
      <div className="hidden sm:flex bg-dark-800 rounded p-0.5 gap-0.5">
        <span className="px-3 py-1 rounded text-xs font-semibold bg-accent text-black">
          {user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)}` : 'Business'}
        </span>
      </div>

      {/* Avatar + dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black text-xs font-bold cursor-pointer select-none"
        >
          {user?.initials || 'BO'}
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-10 z-50 w-48 bg-surface border border-dark-800 rounded-lg shadow-lg py-1">
              <div className="px-3 py-2 border-b border-dark-800">
                <p className="text-sm font-semibold text-white truncate">{user?.name || 'Business Owner'}</p>
                <p className="text-xs text-dark-500 truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-sm text-status-error hover:bg-dark-800 transition-colors"
              >
                Sign Out
              </button>
            </div>
          </>
        )}

      </div>
    </header>
  );
}
