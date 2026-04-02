import ProtectedRoute from '@/components/shared/ProtectedRoute';
import DashboardLayout from '@/components/shared/DashboardLayout';

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute allowedRoles={['admin', 'superadmin']} redirectTo="/dashboard">
      <DashboardLayout>
        {children}
      </DashboardLayout>
    </ProtectedRoute>
  );
}
