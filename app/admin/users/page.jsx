'use client';

import { useEffect, useRef, useState } from 'react';
import ProtectedRoute from '@/components/shared/ProtectedRoute';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { getAdminUsers, updateAdminUser } from '@/services/usersService';

const DEFAULT_FORM = {
  user_id: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  role: 'business',
  is_active: true,
};

const ROLE_OPTIONS = ['customer', 'business', 'admin', 'superadmin'];
const ACTIVE_OPTIONS = [
  { label: 'Active', value: 'true' },
  { label: 'Inactive', value: 'false' },
];
const SORT_BY_OPTIONS = ['created_at', 'updated_at', 'name', 'email'];
const SORT_ORDER_OPTIONS = ['desc', 'asc'];

function buildForm(user) {
  return {
    user_id: user?.id || '',
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    password: '',
    role: user?.role || 'business',
    is_active: Boolean(user?.is_active),
  };
}

function extractUpdatedUser(response) {
  if (!response) return null;
  if (response?.data?.id) return response.data;
  if (response?.data?.data?.id) return response.data.data;
  if (response?.id) return response;
  return null;
}

export default function UsersPage() {
  return (
    <ProtectedRoute allowedRoles={['superadmin']} redirectTo="/admin">
      <SuperadminUsersPage />
    </ProtectedRoute>
  );
}

function SuperadminUsersPage() {
  const { toast } = useToast();
  const debounceRef = useRef(null);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('customer');
  const [isActive, setIsActive] = useState('true');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const fetchUsers = async (
    nextPage = page,
    nextSearch = search,
    nextRole = role,
    nextActive = isActive,
    nextSortBy = sortBy,
    nextSortOrder = sortOrder
  ) => {
    setLoading(true);
    setError('');
    try {
      const response = await getAdminUsers({
        page: nextPage,
        limit: 10,
        search: nextSearch,
        role: nextRole,
        is_active: nextActive,
        sort_by: nextSortBy,
        sort_order: nextSortOrder,
      });

      const payload = response?.data || response;
      const data = payload?.data || payload;
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setPagination(data?.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const nextSearch = searchInput.trim();
    setSearch(nextSearch);
    setPage(1);
    fetchUsers(1, nextSearch, role, isActive, sortBy, sortOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, isActive, sortBy, sortOrder]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
      fetchUsers(1, searchInput.trim(), role, isActive, sortBy, sortOrder);
    }, 350);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  const openEditor = (user) => {
    setSelectedUser(user);
    setForm(buildForm(user));
  };

  const closeEditor = () => {
    setSelectedUser(null);
    setForm(DEFAULT_FORM);
  };

  const submitUpdate = async () => {
    if (!form.user_id) return;

    const payload = {
      user_id: form.user_id,
      name: form.name.trim() || undefined,
      email: form.email.trim() || undefined,
      phone: form.phone.trim() || undefined,
      role: String(form.role || 'business').trim(),
      is_active: Boolean(form.is_active),
    };

    if (form.password.trim()) {
      payload.password = form.password.trim();
    }

    setSaving(true);
    try {
      const response = await updateAdminUser(payload);
      const updatedUser = extractUpdatedUser(response);

      if (updatedUser?.id) {
        setUsers((prev) => prev.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
      } else {
        // Fallback: keep UI in sync even if backend wraps payload differently.
        await fetchUsers(page, search, role, isActive, sortBy, sortOrder);
      }

      toast.success(response?.message || response?.data?.message || 'User updated successfully');
      closeEditor();
    } catch (err) {
      toast.error(err.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchUsers(nextPage, search, role, isActive, sortBy, sortOrder);
  };

  return (
    <div className="animate-fade-in text-white">
      <div className="mx-auto max-w-7xl space-y-4">
        <Card>
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">Superadmin Users</h1>
                <Badge label="superadmin only" variant="info" />
              </div>
              <p className="text-sm text-dark-400">Search, filter and edit platform users.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => fetchUsers(page, searchInput.trim(), role, isActive, sortBy, sortOrder)}>
                Refresh
              </Button>
            </div>
          </div>
        </Card>

        <Card>
          <CardBody className="grid grid-cols-1 gap-3 p-3 md:grid-cols-5">
            <Input
              label="Search"
              placeholder="Name, email or phone"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dark-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dark-400">Active</label>
              <select
                value={isActive}
                onChange={(e) => setIsActive(e.target.value)}
                className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
              >
                {ACTIVE_OPTIONS.map((option) => (
                  <option key={option.label} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dark-400">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
              >
                {SORT_BY_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dark-400">Sort</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
              >
                {SORT_ORDER_OPTIONS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          </CardBody>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px]">
              <thead>
                <tr className="border-b border-dark-800">
                  {['Name', 'Email', 'Phone', 'Role', 'Status', 'Created', 'Updated', 'Actions'].map((header) => (
                    <th key={header} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-dark-500">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-dark-400">Loading users...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-status-error">{error}</td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-10 text-center text-sm text-dark-400">No users found.</td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="border-b border-dark-800 last:border-0 hover:bg-dark-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-semibold text-white">{user.name || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{user.email || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{user.phone || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300 capitalize">{user.role || '—'}</td>
                      <td className="px-4 py-3.5">
                        <Badge label={user.is_active ? 'active' : 'inactive'} variant={user.is_active ? 'active' : 'inactive'} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{formatDateLabel(user.created_at)}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{formatDateLabel(user.updated_at)}</td>
                      <td className="px-4 py-3.5">
                        <div className="flex justify-end gap-2">
                          <Button size="sm" variant="outline" onClick={() => openEditor(user)}>
                            Edit
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 px-4 py-3 border-t border-dark-800 text-sm md:flex-row md:items-center md:justify-between">
            <p className="text-dark-400">Total: {pagination.total || 0}</p>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1 || loading} onClick={() => goToPage(page - 1)}>
                Prev
              </Button>
              <span className="text-dark-300">Page {page} / {pagination.totalPages || 1}</span>
              <Button size="sm" variant="outline" disabled={page >= (pagination.totalPages || 1) || loading} onClick={() => goToPage(page + 1)}>
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Modal
        isOpen={Boolean(selectedUser)}
        onClose={closeEditor}
        title="Edit User"
        size="xl"
        footer={
          <>
            <Button variant="outline" onClick={closeEditor}>Cancel</Button>
            <Button loading={saving} onClick={submitUpdate}>Save Changes</Button>
          </>
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} />
          <Input label="Password" type="password" helper="Leave blank to keep current password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} />
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-dark-400">Role</label>
            <select
              value={form.role}
              onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-dark-400">Active</label>
            <select
              value={String(form.is_active)}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.value === 'true' }))}
              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
            >
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function formatDateLabel(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}