/**
 * app/subscription/page.jsx
 * ─────────────────────────────────────────────────────────
 * Subscription detail page — shows current plan from API.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useState, useEffect } from 'react';
import Card, { CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatCurrency } from '@/lib/helpers';
import { getSubscriptionDetail } from '@/services/subscriptionService';
import DashboardLayout from '@/components/shared/DashboardLayout';

const PLAN_DISPLAY = {
  '1_month':   { name: '1 Month',   price: 1999 },
  '3_months':  { name: '3 Months',  price: 2999 },
  '6_months':  { name: '6 Months',  price: 4999 },
  '12_months': { name: '12 Months', price: 7999 },
};

export default function SubscriptionPage() {
  const [sub, setSub]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    async function fetch() {
      setLoading(true);
      try {
        const data = await getSubscriptionDetail();
        setSub(data);
      } catch (err) {
        setError(err.message || 'Failed to load subscription');
      } finally {
        setLoading(false);
      }
    }
    fetch();
  }, []);

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Subscription</h1>
          <p className="text-sm text-dark-400">View your subscription details.</p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton lines={5} />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} lines={4} />)}
            </div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-dark-400 text-sm">{error}</p>
            <Button variant="outline" size="sm" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        ) : sub ? (
          <>
            {/* Current Subscription */}
            <Card className="mb-5">
              <CardBody className="p-4 md:p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 md:mb-6">
                  <div>
                    <p className="text-2xs font-semibold uppercase tracking-widest text-dark-500 mb-1">Current Plan</p>
                    <p className="text-xl sm:text-2xl font-bold text-white">
                      {PLAN_DISPLAY[sub.plan]?.name || sub.plan}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                    sub.status === 'active'
                      ? 'bg-status-success-muted text-status-success'
                      : sub.status === 'expired'
                      ? 'bg-status-error-muted text-status-error'
                      : 'bg-accent-muted text-accent'
                  }`}>
                    {sub.status?.charAt(0).toUpperCase() + sub.status?.slice(1)}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                  <DetailItem label="Amount Paid" value={formatCurrency(sub.amount)} />
                  <DetailItem label="Start Date" value={formatDate(sub.start_date)} />
                  <DetailItem label="End Date" value={formatDate(sub.end_date)} />
                  <DetailItem
                    label="Days Remaining"
                    value={sub.days_remaining ?? '—'}
                    highlight={sub.days_remaining <= 7}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Payment Info */}
            <Card className="mb-5">
              <CardBody className="p-4 md:p-6">
                <p className="text-sm font-semibold text-white mb-3 md:mb-4">Payment Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <DetailItem label="Payment Status" value={sub.payment_status?.charAt(0).toUpperCase() + sub.payment_status?.slice(1)} />
                  <DetailItem label="Payment Method" value={sub.payment_method || '—'} />
                  <DetailItem label="Order ID" value={sub.razorpay_order_id || '—'} mono />
                </div>
              </CardBody>
            </Card>

            {/* Available Plans */}
            <p className="text-sm font-semibold text-white mb-3">All Plans</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
              {Object.entries(PLAN_DISPLAY).map(([key, plan]) => {
                const isCurrent = sub.plan === key;
                return (
                  <div
                    key={key}
                    className={`relative rounded transition-all duration-200 ${
                      isCurrent
                        ? 'border-4 border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/20'
                        : 'border border-dark-800 bg-surface hover:border-dark-600'
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute -top-3 -right-2 bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">
                        Current
                      </div>
                    )}
                    
                    <div className="p-4 md:p-5">
                      <p className="text-sm md:text-md font-bold text-white mb-1">{plan.name}</p>
                      <p className="text-xl md:text-2xl font-extrabold text-white mb-1">{formatCurrency(plan.price)}</p>
                      <p className="text-xs text-dark-400 mb-3 md:mb-4">one-time payment</p>
                      
                      {isCurrent && (
                        <div className="mb-2 md:mb-3 text-xs text-yellow-400 font-semibold">
                          ✓ Active until {formatDate(sub.end_date)}
                        </div>
                      )}
                      
                      <div className={`w-full py-2 px-3 rounded text-center text-xs md:text-sm font-semibold transition-colors ${
                        isCurrent
                          ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                          : 'border border-dark-700 text-dark-300 hover:border-accent hover:text-white'
                      }`}>
                        {isCurrent ? 'Current Plan' : 'Available'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 gap-4">
            <p className="text-dark-400 text-sm">No subscription found.</p>
            <a href="/signup">
              <Button>Subscribe Now</Button>
            </a>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function DetailItem({ label, value, highlight = false, mono = false }) {
  return (
    <div>
      <p className="text-2xs font-semibold uppercase tracking-widest text-dark-500 mb-1">{label}</p>
      <p className={`text-sm font-semibold ${
        highlight ? 'text-status-error' : 'text-white'
      } ${mono ? 'font-mono text-xs' : ''}`}>
        {value}
      </p>
    </div>
  );
}
