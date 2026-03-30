/**
 * Sidebar.jsx
 * ─────────────────────────────────────────────────────────
 * App sidebar with navigation links.
 * Reads current pathname to highlight active link.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/helpers';

const BUSINESS_NAV_ITEMS = [
  {
    section: 'BUSINESS',
    links: [
      { href: '/dashboard',          label: 'Dashboard',         icon: <GridIcon /> },
      // { href: '/dashboard/analytics', label: 'Analytics',        icon: <ChartIcon /> },
      { href: '/business-profile',   label: 'Business Profile',  icon: <UserIcon /> },
      { href: '/services',           label: 'Services',          icon: <CogIcon /> },
      { href: '/offers',             label: 'Offers',            icon: <TagIcon /> },
      { href: '/reviews',            label: 'Reviews',           icon: <StarIcon /> },
      { href: '/subscription',       label: 'Subscription',      icon: <CardIcon /> },
    ],
  },
];

const ADMIN_NAV_ITEMS = [
  {
    section: 'ADMIN',
    links: [
      { href: '/admin', label: 'Approvals', icon: <ShieldIcon /> },
    ],
  },
];

export default function Sidebar({ user }) {
  const pathname = usePathname();
  const role = user?.role || 'business';
  const navItems = role === 'admin' ? ADMIN_NAV_ITEMS : BUSINESS_NAV_ITEMS;

  return (
    <aside className="w-60 min-w-[240px] h-screen flex flex-col bg-dark-950 border-r border-dark-800 overflow-y-auto overflow-x-hidden">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 h-14 border-b border-dark-800 flex-shrink-0">
        <div className="w-8 h-8 bg-accent rounded flex items-center justify-center text-black font-bold text-base flex-shrink-0">
          <BoltIcon />
        </div>
        <span className="text-lg font-bold text-white whitespace-nowrap">Sunday Hundred</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        {navItems.map((section) => (
          <div key={section.section} className="mb-6">
            <p className="text-2xs font-semibold tracking-widest text-dark-600 uppercase px-2 mb-2">
              {section.section}
            </p>
            <ul className="space-y-0.5">
              {section.links.map((link) => {
                const isActive = pathname === link.href || pathname?.startsWith(link.href + '/');
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center gap-2.5 px-2.5 py-2 rounded text-sm font-medium transition-colors duration-150',
                        isActive
                          ? 'bg-white/[0.07] text-white'
                          : 'text-dark-400 hover:text-white hover:bg-dark-800'
                      )}
                    >
                      <span className="w-4 h-4 flex-shrink-0">{link.icon}</span>
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User */}
      {user && (
        <div className="px-4 py-3.5 border-t border-dark-800 flex items-center gap-2.5 flex-shrink-0 min-w-0">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
            {user.initials || 'JD'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user.name || 'John Doe'}</p>
            <p className="text-xs text-dark-500 truncate">{user.email || 'john@business.com'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ── Inline icons (no external dep needed) ── */
function GridIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  );
}
function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  );
}
function CogIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.07 4.93A10 10 0 0 0 4.93 19.07M19.07 4.93l-2.83 2.83M4.93 19.07l2.83-2.83"/>
    </svg>
  );
}
function TagIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
      <line x1="7" y1="7" x2="7.01" y2="7"/>
    </svg>
  );
}
function StarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function CardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <line x1="4" y1="20" x2="20" y2="20"/>
      <line x1="8" y1="16" x2="8" y2="10"/>
      <line x1="12" y1="16" x2="12" y2="6"/>
      <line x1="16" y1="16" x2="16" y2="12"/>
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
