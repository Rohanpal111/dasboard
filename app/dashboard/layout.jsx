/**
 * app/dashboard/layout.jsx
 * ─────────────────────────────────────────────────────────
 * Layout for /dashboard/* routes with client-side auth guard.
 * Dashboard stays accessible after login/signup session only.
 * ─────────────────────────────────────────────────────────
 */

import DashboardLayout from '@/components/shared/DashboardLayout';
import ProtectedRoute from '@/components/shared/ProtectedRoute';

export default function Layout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['business']} redirectTo="/admin">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
