'use client';

import { useState } from 'react';
import { useOffers } from '@/hooks/useOffers';
import { useServices } from '@/hooks/useServices';
import { useToast } from '@/components/ui/Toast';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Toggle from '@/components/ui/Toggle';
import { TableRowSkeleton } from '@/components/ui/Skeleton';
import { formatDate } from '@/lib/helpers';
import DashboardLayout from '@/components/shared/DashboardLayout';

export default function OffersPage() {
  const { data, loading, error, addOffer, toggle, refresh } = useOffers();
  const { data: services } = useServices();
  const { toast } = useToast();
  const [modalOpen, setModalOpen] = useState(false);
  const [saving,    setSaving]    = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState({
    title: '',
    discount_type: 'percentage',
    discount: '',
    service_id: '',
    start_date: '',
    end_date: '',
    is_active: true,
  });

  const handleToggle = async (id, enabled) => {
    const res = await toggle(id, enabled);
    if (!res.success) {
      toast.error(res.error || 'Failed to update offer');
      return;
    }
    toast.success(enabled ? 'Offer activated' : 'Offer deactivated');
  };

  const validateForm = () => {
    const errors = {};
    const discountNum = Number(form.discount);

    if (!form.title.trim()) errors.title = 'Offer title is required';
    if (!discountNum || discountNum <= 0) errors.discount = 'Discount must be greater than 0';
    if (form.discount_type === 'percentage' && discountNum > 100) {
      errors.discount = 'Percentage discount cannot be more than 100';
    }
    if (!form.start_date) errors.start_date = 'Start date is required';
    if (!form.end_date) errors.end_date = 'End date is required';
    if (form.start_date && form.end_date && new Date(form.start_date) > new Date(form.end_date)) {
      errors.end_date = 'End date must be after start date';
    }

    return errors;
  };

  const handleCreate = async () => {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setSaving(true);
    const payload = {
      service_id: form.service_id || null,
      title: form.title.trim(),
      discount_type: form.discount_type,
      discount: Number(form.discount),
      start_date: new Date(`${form.start_date}T00:00:00`).toISOString(),
      end_date: new Date(`${form.end_date}T23:59:59`).toISOString(),
      is_active: form.is_active,
    };

    const res = await addOffer(payload);
    setSaving(false);

    if (res.success) {
      toast.success('Offer created');
      setModalOpen(false);
      setFormErrors({});
      setForm({
        title: '',
        discount_type: 'percentage',
        discount: '',
        service_id: '',
        start_date: '',
        end_date: '',
        is_active: true,
      });
    } else {
      toast.error(res.error || 'Failed to create offer');
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Offers</h1>
            <p className="text-sm text-dark-400">Create and manage promotional offers.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={refresh}>Refresh</Button>
            <Button icon={<PlusIcon />} onClick={() => setModalOpen(true)}>Create Offer</Button>
          </div>
        </div>

        <Card>
          {/* Mobile list view */}
          <div className="md:hidden p-3 space-y-3">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded border border-dark-800 bg-surface-2 p-4 space-y-2">
                  <div className="h-4 w-1/2 rounded bg-dark-800 animate-shimmer" />
                  <div className="h-3 w-1/3 rounded bg-dark-800 animate-shimmer" />
                  <div className="h-3 w-2/3 rounded bg-dark-800 animate-shimmer" />
                </div>
              ))
            ) : error ? (
              <div className="px-2 py-8 text-center text-dark-400 text-sm">{error}</div>
            ) : data.length === 0 ? (
              <div className="px-2 py-8 text-center text-dark-400 text-sm">No offers yet.</div>
            ) : (
              data.map((offer) => (
                <div key={offer.id} className="rounded border border-dark-800 bg-surface-2 p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm font-semibold text-white leading-5">{offer.name || offer.title}</p>
                    <Badge
                      label={offer.status?.charAt(0)?.toUpperCase() + offer.status?.slice(1)}
                      variant={offer.status}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 text-xs">
                    <p className="text-dark-500">Discount</p>
                    <p className="text-accent font-semibold text-right">{offer.discountLabel}</p>

                    <p className="text-dark-500">Service</p>
                    <p className="text-dark-300 text-right">{offer.appliesTo}</p>

                    <p className="text-dark-500">Date Range</p>
                    <p className="text-dark-300 text-right">{formatDate(offer.start_date)} - {formatDate(offer.end_date)}</p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-dark-800">
                    <p className="text-xs text-dark-400">Enabled</p>
                    <Toggle
                      checked={offer.enabled}
                      onChange={(v) => handleToggle(offer.id, v)}
                      disabled={offer.status === 'expired' || saving}
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop table view */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className="border-b border-dark-800">
                  {['Offer', 'Discount', 'Service', 'Date Range', 'Status', 'Enabled'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-dark-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <TableRowSkeleton key={i} cols={6} />)
                ) : error ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-dark-400 text-sm">{error}</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-dark-400 text-sm">No offers yet.</td></tr>
                ) : (
                  data.map((offer) => (
                    <tr key={offer.id} className="border-b border-dark-800 last:border-0 hover:bg-dark-800/40 transition-colors">
                      <td className="px-4 py-3.5 text-sm font-semibold text-white whitespace-nowrap">{offer.name || offer.title}</td>
                      <td className="px-4 py-3.5 text-sm font-semibold text-accent whitespace-nowrap">{offer.discountLabel}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300 whitespace-nowrap">{offer.appliesTo}</td>
                      <td className="px-4 py-3.5 text-sm text-dark-300 whitespace-nowrap">
                        {formatDate(offer.start_date)} - {formatDate(offer.end_date)}
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Badge
                          label={offer.status?.charAt(0)?.toUpperCase() + offer.status?.slice(1)}
                          variant={offer.status}
                        />
                      </td>
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <Toggle
                          checked={offer.enabled}
                          onChange={(v) => handleToggle(offer.id, v)}
                          disabled={offer.status === 'expired' || saving}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Create Offer"
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button loading={saving} onClick={handleCreate}>Create Offer</Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Offer Title"
            placeholder="e.g. TOFY 50% Discount"
            value={form.title}
            onChange={e => {
              setForm(p => ({ ...p, title: e.target.value }));
              setFormErrors(p => ({ ...p, title: '' }));
            }}
            error={formErrors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium text-dark-400">Discount Type</label>
              <select
                className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
                value={form.discount_type}
                onChange={e => setForm(p => ({ ...p, discount_type: e.target.value }))}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </select>
            </div>

            <Input
              label="Discount"
              type="number"
              min="0"
              step="0.01"
              placeholder={form.discount_type === 'percentage' ? 'e.g. 50' : 'e.g. 100'}
              value={form.discount}
              onChange={e => {
                setForm(p => ({ ...p, discount: e.target.value }));
                setFormErrors(p => ({ ...p, discount: '' }));
              }}
              error={formErrors.discount}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-dark-400">Service (Optional)</label>
            <select
              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
              value={form.service_id}
              onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))}
            >
              <option value="">All Services (General Offer)</option>
              {services?.map((svc) => (
                <option key={svc.id} value={svc.id}>{svc.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={form.start_date}
              onChange={e => {
                setForm(p => ({ ...p, start_date: e.target.value }));
                setFormErrors(p => ({ ...p, start_date: '' }));
              }}
              error={formErrors.start_date}
            />
            <Input
              label="End Date"
              type="date"
              value={form.end_date}
              onChange={e => {
                setForm(p => ({ ...p, end_date: e.target.value }));
                setFormErrors(p => ({ ...p, end_date: '' }));
              }}
              error={formErrors.end_date}
            />
          </div>

          <div className="flex items-center justify-between rounded border border-dark-700 bg-surface-2 px-3 py-2">
            <span className="text-sm text-dark-300">Offer Active</span>
            <Toggle
              checked={form.is_active}
              onChange={(checked) => setForm(p => ({ ...p, is_active: checked }))}
            />
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

function PlusIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>; }
