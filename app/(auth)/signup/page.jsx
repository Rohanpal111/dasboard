/**
 * app/(auth)/signup/page.jsx
 * ─────────────────────────────────────────────────────────
 * Business registration with payment_mode-based flow.
 * Supports MANUAL_QR and optional RAZORPAY flow.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  registerSubscription,
  verifyRazorpayPayment,
  submitManualTransaction,
} from '@/services/subscriptionService';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';

const PLANS = [
  { key: '1_month',   label: '1 Month',   price: '₹1,999',  priceNum: 1999 },
  { key: '3_months',  label: '3 Months',  price: '₹2,999',  priceNum: 2999, popular: true },
  { key: '6_months',  label: '6 Months',  price: '₹4,999',  priceNum: 4999 },
  { key: '12_months', label: '12 Months', price: '₹7,999',  priceNum: 7999 },
];

const RAZORPAY_ENABLED = process.env.NEXT_PUBLIC_RAZORPAY_ENABLED === 'true';
const FALLBACK_UPI_LINK = 'upi://pay?pa=ag244834-1@okaxis&pn=SundayHundred&am=99&cu=INR&tn=Payment%20for%20subscription';
const FALLBACK_UPI_ID = 'ag244834-1@okaxis';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    plan: '3_months',
  });
  const [step, setStep] = useState('form'); // form | paying | verifying | manual | submitting_manual | pending | done
  const [manualInfo, setManualInfo] = useState(null);
  const [manualTxn, setManualTxn] = useState({ txn_id: '', payer_note: '' });
  const [manualError, setManualError] = useState('');
  const [manualHint, setManualHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const update = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const loadRazorpayScript = useCallback(() => {
    return new Promise((resolve) => {
      if (document.getElementById('razorpay-script')) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.id = 'razorpay-script';
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Register and check payment mode
      const paymentData = await registerSubscription({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        plan: form.plan,
      });

      if (paymentData.payment_mode === 'MANUAL_QR') {
        setManualInfo(paymentData);
        setManualHint('');
        setStep('manual');
        setLoading(false);
        return;
      }

      if (paymentData.payment_mode !== 'RAZORPAY') {
        throw new Error('Unsupported payment mode from server.');
      }

      if (!RAZORPAY_ENABLED) {
        const plan = PLANS.find((p) => p.key === form.plan);
        setManualInfo({
          payment_reference: paymentData.payment_reference || paymentData.order_id || `manual_fallback_${Date.now()}`,
          amount: paymentData.amount ? Number(paymentData.amount) / 100 : plan?.priceNum || 99,
          qr: {
            upi_id: paymentData?.qr?.upi_id || FALLBACK_UPI_ID,
            qr_image_url: paymentData?.qr?.qr_image_url || null,
          },
        });
        setManualHint('Razorpay disabled hai, isliye manual UPI fallback open kiya gaya hai. TXN submit ke baad admin approval pending rahega.');
        setStep('manual');
        setLoading(false);
        return;
      }

      // Step 2: Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setError('Failed to load payment gateway. Please try again.');
        setLoading(false);
        return;
      }

      setStep('paying');

      // Step 3: Open Razorpay checkout
      const options = {
        key: paymentData.key_id || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: paymentData.amount,
        currency: paymentData.currency || 'INR',
        name: 'Sunday Hundred',
        description: `${PLANS.find(p => p.key === form.plan)?.label || ''} Subscription`,
        order_id: paymentData.order_id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#F5A623',
        },
        handler: async (response) => {
          // Step 4: Verify payment
          setStep('verifying');
          try {
            await verifyRazorpayPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            setStep('done');
            toast.success('Account created successfully! Please login.');
            setTimeout(() => router.push('/login'), 2000);
          } catch (verifyErr) {
            setError(verifyErr.message || 'Payment verification failed. Contact support.');
            setStep('form');
          }
        },
        modal: {
          ondismiss: () => {
            setStep('form');
            setLoading(false);
            setError('Payment was cancelled. You can try again.');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (response) => {
        setStep('form');
        setLoading(false);
        setError(response.error?.description || 'Payment failed. Please try again.');
      });
      rzp.open();
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
      setStep('form');
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setManualError('');

    if (!manualInfo?.payment_reference) {
      setManualError('Missing payment reference. Please restart signup flow.');
      return;
    }
    if (!manualTxn.txn_id.trim()) {
      setManualError('Transaction ID is required.');
      return;
    }

    setLoading(true);
    setStep('submitting_manual');
    try {
      await submitManualTransaction({
        payment_reference: manualInfo.payment_reference,
        txn_id: manualTxn.txn_id.trim(),
        payer_note: manualTxn.payer_note.trim(),
      });

      setStep('pending');
      toast.success('Payment submitted. Pending admin approval.');
    } catch (submitErr) {
      setManualError(submitErr.message || 'Failed to submit transaction.');
      setStep('manual');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-status-success-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-status-success">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-sm text-dark-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-dark-800 rounded-lg p-7 text-center">
          <div className="w-16 h-16 bg-accent-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-8 h-8 text-accent">
              <path d="M12 6v6l4 2" />
              <circle cx="12" cy="12" r="9" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Pending Admin Approval</h2>
          <p className="text-sm text-dark-400 mb-5">
            Your payment details are submitted successfully. Account activation will happen after admin approval.
          </p>
          <p className="text-xs text-dark-500 mb-5">
            Note: Login may show Subscription is not active until approval is completed.
          </p>
          <Button className="w-full justify-center" onClick={() => router.push('/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'manual' || step === 'submitting_manual') {
    const upiLink = manualInfo?.qr?.upi_id
      ? `upi://pay?pa=${encodeURIComponent(manualInfo.qr.upi_id)}&pn=SundayHundred&am=${encodeURIComponent(String(manualInfo.amount || 99))}&cu=INR&tn=Payment%20for%20subscription`
      : FALLBACK_UPI_LINK;

    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface border border-dark-800 rounded-lg p-7">
          <h1 className="text-xl font-bold text-white mb-1.5">Manual Payment</h1>
          <p className="text-sm text-dark-400 mb-5">
            Razorpay is currently disabled. Complete payment via UPI and submit transaction ID for approval.
          </p>

          {manualHint && (
            <div className="bg-accent-muted border border-accent/30 text-accent text-sm rounded p-3 mb-4">
              {manualHint}
            </div>
          )}

          <div className="rounded border border-dark-700 bg-dark-900 p-4 mb-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Amount</span>
              <span className="text-white font-semibold">Rs {manualInfo?.amount || 99}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-dark-400">Reference</span>
              <span className="text-white font-mono text-xs">{manualInfo?.payment_reference || '—'}</span>
            </div>
          </div>

          <a
            href={upiLink}
            className="w-full inline-flex justify-center rounded bg-accent px-4 py-2 text-sm font-semibold text-black hover:bg-accent-dark transition-colors mb-4"
          >
            Open UPI App
          </a>

          {manualInfo?.qr?.qr_image_url && (
            <img
              src={manualInfo.qr.qr_image_url}
              alt="UPI QR"
              className="w-44 h-44 object-contain mx-auto rounded border border-dark-700 mb-4"
            />
          )}

          {manualError && (
            <div className="bg-status-error-muted border border-status-error/30 text-status-error text-sm rounded p-3 mb-4">
              {manualError}
            </div>
          )}

          <form onSubmit={handleManualSubmit} className="space-y-3">
            <Input
              label="Transaction ID"
              placeholder="e.g. UPI123456789"
              value={manualTxn.txn_id}
              onChange={(e) => setManualTxn((p) => ({ ...p, txn_id: e.target.value }))}
              required
            />
            <Input
              label="Payer Note (Optional)"
              placeholder="Paid from GPay"
              value={manualTxn.payer_note}
              onChange={(e) => setManualTxn((p) => ({ ...p, payer_note: e.target.value }))}
            />

            <Button
              type="submit"
              loading={loading}
              disabled={step === 'submitting_manual'}
              className="w-full justify-center mt-1"
            >
              Submit Payment for Approval
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 bg-accent rounded-lg flex items-center justify-center text-black font-bold">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">Sunday Hundred</span>
        </div>

        {/* Card */}
        <div className="bg-surface border border-dark-800 rounded-lg p-7">
          <h1 className="text-xl font-bold text-white mb-1.5">Create Business Account</h1>
          <p className="text-sm text-dark-400 mb-6">Register your business and choose a plan.</p>

          {error && (
            <div className="bg-status-error-muted border border-status-error/30 text-status-error text-sm rounded p-3 mb-4">
              {error}
            </div>
          )}

          {step === 'verifying' && (
            <div className="flex items-center gap-3 bg-accent-muted border border-accent/30 text-accent text-sm rounded p-3 mb-4">
              <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin flex-shrink-0" />
              Verifying payment...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              placeholder="John Doe"
              value={form.name}
              onChange={update('name')}
              required
              minLength={2}
            />
            <Input
              label="Email"
              type="email"
              placeholder="john@business.com"
              value={form.email}
              onChange={update('email')}
              required
            />
            <Input
              label="Phone"
              type="tel"
              placeholder="9876543210"
              value={form.phone}
              onChange={update('phone')}
              required
              pattern="[0-9]{10,15}"
              title="Enter 10-15 digit phone number"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Min 6 characters"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
            />

            {/* Plan Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-300 mb-2">Choose Plan</label>
              <div className="grid grid-cols-2 gap-2">
                {PLANS.map((plan) => (
                  <button
                    key={plan.key}
                    type="button"
                    onClick={() => setForm(p => ({ ...p, plan: plan.key }))}
                    className={`relative p-3 rounded border text-left transition-all ${
                      form.plan === plan.key
                        ? 'border-accent bg-accent-muted'
                        : 'border-dark-700 bg-dark-800 hover:border-dark-600'
                    }`}
                  >
                    {plan.popular && (
                      <span className="absolute -top-2 right-2 bg-accent text-black text-2xs font-bold px-1.5 py-0.5 rounded">
                        POPULAR
                      </span>
                    )}
                    <p className="text-sm font-semibold text-white">{plan.label}</p>
                    <p className={`text-xs mt-0.5 ${form.plan === plan.key ? 'text-accent' : 'text-dark-400'}`}>
                      {plan.price}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              loading={loading && step !== 'done'}
              disabled={step === 'paying' || step === 'verifying'}
              className="w-full justify-center mt-2"
            >
              {step === 'paying'
                ? 'Complete Payment...'
                : step === 'verifying'
                ? 'Verifying...'
                : 'Register & Continue'}
            </Button>
          </form>

          <p className="text-xs text-dark-500 text-center mt-5">
            Already have an account?{' '}
            <a href="/login" className="text-accent hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
