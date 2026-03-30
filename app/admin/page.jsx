'use client';

import { useEffect, useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { getPendingManualApprovals, approveManualPayment } from '@/services/subscriptionService';

export default function AdminPage() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState('');
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });

  const fetchPending = async (nextPage = page, nextSearch = search) => {
    setLoading(true);
    setError('');
    try {
      const res = await getPendingManualApprovals({ page: nextPage, limit: 10, search: nextSearch });
      setItems(res.approvals || []);
      setPagination(res.pagination || { total: 0, page: 1, limit: 10, totalPages: 0 });
    } catch (err) {
      setError(err.message || 'Failed to load pending manual approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, []);

  const handleApproval = async (paymentReference) => {
    setActionLoading(paymentReference);
    try {
      await approveManualPayment(paymentReference, 'Txn matched');
      setItems((prev) => prev.filter((item) => item.payment_reference !== paymentReference));
      toast.success('Payment approved successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to approve payment');
    } finally {
      setActionLoading('');
    }
  };

  const submitSearch = (e) => {
    e.preventDefault();
    const next = searchInput.trim();
    setSearch(next);
    setPage(1);
    fetchPending(1, next);
  };

  const goToPage = (nextPage) => {
    setPage(nextPage);
    fetchPending(nextPage, search);
  };

  return (
    <div className="animate-fade-in text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-dark-400">Manual payment approvals</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => fetchPending(page, search)}>Refresh</Button>
          </div>
        </div>

        <Card className="mb-4">
          <form className="p-4 flex flex-col sm:flex-row gap-2" onSubmit={submitSearch}>
            <Input
              placeholder="Search by name, email, phone, payment reference, txn id"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="sm:flex-1"
            />
            <Button type="submit">Search</Button>
          </form>
        </Card>

        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[920px]">
              <thead>
                <tr className="border-b border-dark-800">
                  {['Name', 'Email', 'Phone', 'Txn ID', 'Payment Ref', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-dark-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-dark-400 text-sm">Loading pending approvals...</td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-status-error text-sm">{error}</td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-dark-400 text-sm">No pending manual approvals.</td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.payment_reference} className="border-b border-dark-800 last:border-0 hover:bg-dark-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-semibold text-white">{item.name || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{item.email || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300">{item.phone || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300 font-mono">{item.txn_id || '—'}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300 font-mono">{item.payment_reference || '—'}</td>
                      <td className="px-4 py-3.5">
                        <Badge
                          label={item.subscription_status || 'pending'}
                          variant={item.subscription_status === 'pending' ? 'pending' : 'active'}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2 justify-end">
                          <Button
                            size="sm"
                            loading={actionLoading === item.payment_reference}
                            onClick={() => handleApproval(item.payment_reference)}
                          >
                            Approve
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-800 text-sm">
            <p className="text-dark-400">Total: {pagination.total || 0}</p>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => goToPage(page - 1)}
              >
                Prev
              </Button>
              <span className="text-dark-300">Page {page} / {pagination.totalPages || 1}</span>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= (pagination.totalPages || 1) || loading}
                onClick={() => goToPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
