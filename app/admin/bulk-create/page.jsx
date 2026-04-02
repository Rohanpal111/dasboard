'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import Badge from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { bulkCreateBusinesses } from '@/services/businessService';
import { getAllCategories } from '@/services/categoriesService';
import { getAllCities } from '@/services/citiesService';

const REQUIRED_PHONE_PATTERN = /^\d{10,15}$/;
const REQUIRED_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const PLAN_OPTIONS = [
  { label: '1 Month - ₹1999', value: '1_month', amount: '1999' },
  { label: '3 Months - ₹2999', value: '3_months', amount: '2999' },
  { label: '6 Months - ₹4999', value: '6_months', amount: '4999' },
  { label: '12 Months - ₹7999', value: '12_months', amount: '7999' },
];
const USER_ROLE_OPTIONS = ['business', 'admin', 'superadmin', 'customer'];

function createRow() {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    user: {
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'business',
    },
    business: {
      name: '',
      description: '',
      category_id: '',
      contact: '',
      whatsapp_no: '',
      address: '',
      city_id: '',
      lat: '',
      long: '',
      image_url: '',
    },
    payment: {
      razorpay_order_id: '',
      razorpay_payment_id: '',
      razorpay_signature: '',
      amount: '1999',
      currency: '',
      method: '',
      description: '',
      plan: '1_month',
      planLabel: '1 Month - ₹1999',
    },
  };
}

function cleanObject(source) {
  return Object.fromEntries(
    Object.entries(source).filter(([, value]) => value !== '' && value !== null && value !== undefined)
  );
}

function toNumberOrString(value) {
  if (value === '' || value === null || value === undefined) return undefined;
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : value;
}

function normalizeRow(row) {
  const user = cleanObject({
    name: row.user.name.trim(),
    email: row.user.email.trim(),
    phone: row.user.phone.trim(),
    password: row.user.password,
    role: row.user.role,
  });

  const business = cleanObject({
    name: row.business.name.trim(),
    description: row.business.description.trim(),
    category_id: row.business.category_id.trim(),
    contact: row.business.contact.trim(),
    whatsapp_no: row.business.whatsapp_no.trim(),
    address: row.business.address.trim(),
    city_id: row.business.city_id.trim(),
    lat: toNumberOrString(row.business.lat),
    long: toNumberOrString(row.business.long),
    image_url: row.business.image_url.trim(),
  });

  const payment = cleanObject({
    razorpay_order_id: row.payment.razorpay_order_id.trim(),
    razorpay_payment_id: row.payment.razorpay_payment_id.trim(),
    razorpay_signature: row.payment.razorpay_signature.trim(),
    amount: toNumberOrString(row.payment.amount),
    currency: row.payment.currency.trim(),
    method: row.payment.method.trim(),
    description: row.payment.description.trim(),
    plan: row.payment.plan.trim(),
  });

  const item = { user, business };
  if (Object.keys(payment).length > 0) {
    item.payment = payment;
  }

  return item;
}

function validateRow(row) {
  const errors = {};

  if (!row.user.name.trim()) errors['user.name'] = 'User name is required';
  if (!row.user.email.trim()) errors['user.email'] = 'User email is required';
  if (!row.user.phone.trim()) errors['user.phone'] = 'User phone is required';
  else if (!REQUIRED_PHONE_PATTERN.test(row.user.phone.trim())) errors['user.phone'] = 'Phone must be 10-15 digits';
  if (!row.user.password) errors['user.password'] = 'Password is required';

  if (!row.business.name.trim()) errors['business.name'] = 'Business name is required';
  if (!row.business.category_id.trim()) errors['business.category_id'] = 'Category UUID is required';
  else if (!REQUIRED_UUID_PATTERN.test(row.business.category_id.trim())) errors['business.category_id'] = 'Category ID must be a UUID';
  if (!row.business.city_id.trim()) errors['business.city_id'] = 'City UUID is required';
  else if (!REQUIRED_UUID_PATTERN.test(row.business.city_id.trim())) errors['business.city_id'] = 'City ID must be a UUID';

  return errors;
}

function getFieldError(errors, field) {
  return errors?.[field] || '';
}

function updateRow(rows, rowId, section, field, value) {
  return rows.map((row) => {
    if (row.id !== rowId) return row;
    return {
      ...row,
      [section]: {
        ...row[section],
        [field]: value,
      },
    };
  });
}

function applyPlanPreset(rows, rowId, selectedPlan) {
  const planPreset = PLAN_OPTIONS.find((option) => option.value === selectedPlan);
  return rows.map((row) => {
    if (row.id !== rowId) return row;
    return {
      ...row,
      payment: {
        ...row.payment,
        plan: planPreset?.value || selectedPlan,
        planLabel: planPreset?.label || '',
        amount: planPreset?.amount || row.payment.amount,
      },
    };
  });
}

function ResultsTable({ results }) {
  if (!results?.length) return null;

  return (
    <Card>
      <CardHeader
        title="Per-item results"
        subtitle="Backend processes each business independently, so mixed success is expected."
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[960px]">
          <thead>
            <tr className="border-b border-dark-800">
              {['Input Email', 'Status', 'User', 'Business', 'Payment', 'Error'].map((header) => (
                <th key={header} className="px-4 py-3 text-left text-2xs font-semibold uppercase tracking-wider text-dark-500">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((item, index) => (
              <tr key={`${item.input_email || index}-${index}`} className="border-b border-dark-800 last:border-0 hover:bg-dark-800/40 transition-colors">
                <td className="px-4 py-3.5 text-sm text-dark-300">{item.input_email || '—'}</td>
                <td className="px-4 py-3.5">
                  <Badge
                    label={item.status || 'unknown'}
                    variant={item.status === 'created' ? 'active' : 'expired'}
                  />
                </td>
                <td className="px-4 py-3.5 text-sm text-white">{item.user?.name || '—'}</td>
                <td className="px-4 py-3.5 text-sm text-dark-300">{item.business?.name || '—'}</td>
                <td className="px-4 py-3.5 text-sm text-dark-300">{item.payment?.amount ? `${item.payment.amount}` : '—'}</td>
                <td className="px-4 py-3.5 text-sm text-status-error">{item.error || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

export default function BulkCreatePage() {
  const { toast } = useToast();
  const [rows, setRows] = useState([createRow()]);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [rowErrors, setRowErrors] = useState({});
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    async function fetchLookupData() {
      try {
        const [catResponse, cityResponse] = await Promise.all([
          getAllCategories().catch(() => []),
          getAllCities().catch(() => []),
        ]);

        const normalizedCategories = Array.isArray(catResponse)
          ? catResponse
          : Array.isArray(catResponse?.categories)
            ? catResponse.categories
            : [];

        const normalizedCities = Array.isArray(cityResponse)
          ? cityResponse
          : Array.isArray(cityResponse?.cities)
            ? cityResponse.cities
            : [];

        setCategories(normalizedCategories);
        setCities(normalizedCities);
      } catch {
        setCategories([]);
        setCities([]);
      }
    }

    fetchLookupData();
  }, []);

  const addRow = () => setRows((prev) => [...prev, createRow()]);

  const removeRow = (rowId) => {
    setRows((prev) => (prev.length === 1 ? prev : prev.filter((row) => row.id !== rowId)));
    setRowErrors((prev) => {
      const next = { ...prev };
      delete next[rowId];
      return next;
    });
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    rows.forEach((row) => {
      const errors = validateRow(row);
      if (Object.keys(errors).length > 0) {
        nextErrors[row.id] = errors;
      }
    });

    setRowErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error('Please fix validation errors before submitting');
      return;
    }

    const payload = {
      businesses: rows.map(normalizeRow),
    };

    setSubmitting(true);
    try {
      const response = await bulkCreateBusinesses(payload);
      const data = response?.data || response;
      setSummary(data?.data || data || null);
      toast.success(data?.message || 'Bulk business creation processed');
    } catch (error) {
      toast.error(error.message || 'Bulk create failed');
    } finally {
      setSubmitting(false);
    }
  };

  const totals = summary || { total: 0, created: 0, failed: 0, results: [] };

  return (
    <div className="animate-fade-in text-white">
      <div className="mx-auto max-w-7xl space-y-4">
        <Card>
          <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold">Bulk Business Create</h1>
                <Badge label="admin / superadmin" variant="info" />
              </div>
              <p className="text-sm text-dark-400">
                Create multiple businesses in one request. Each item is processed independently, so partial success is supported.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin" className="inline-flex items-center justify-center rounded border border-dark-700 px-4 py-2 text-sm font-medium text-white hover:bg-dark-800 transition-colors">
                Back to Approvals
              </Link>
              <Button onClick={addRow} variant="outline">
                Add Row
              </Button>
              <Button loading={submitting} onClick={handleSubmit}>
                Submit Bulk Create
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
          <Card>
            <CardHeader
              title="Request Builder"
              subtitle="Required fields are user.name, user.email, user.phone, user.password, business.name, business.category_id and business.city_id."
              action={<span className="text-xs text-dark-500">Rows: {rows.length}</span>}
            />
            <CardBody className="space-y-4">
              {rows.map((row, index) => {
                const errors = rowErrors[row.id] || {};

                return (
                  <div key={row.id} className="rounded border border-dark-800 bg-dark-900/60 p-4">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">Entry {index + 1}</p>
                        <p className="text-xs text-dark-500">Separate user, business, and payment blocks.</p>
                      </div>
                      <Button variant="ghost" size="sm" disabled={rows.length === 1} onClick={() => removeRow(row.id)}>
                        Remove
                      </Button>
                    </div>

                    <div className="space-y-5">
                      <section>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark-500">User</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Name"
                            value={row.user.name}
                            error={getFieldError(errors, 'user.name')}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'user', 'name', e.target.value))}
                          />
                          <Input
                            label="Email"
                            type="email"
                            value={row.user.email}
                            error={getFieldError(errors, 'user.email')}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'user', 'email', e.target.value))}
                          />
                          <Input
                            label="Phone"
                            value={row.user.phone}
                            error={getFieldError(errors, 'user.phone')}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'user', 'phone', e.target.value))}
                          />
                          <Input
                            label="Password"
                            type="password"
                            value={row.user.password}
                            error={getFieldError(errors, 'user.password')}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'user', 'password', e.target.value))}
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-dark-400">Role</label>
                            <select
                              value={row.user.role}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'user', 'role', e.target.value))}
                              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
                            >
                              {USER_ROLE_OPTIONS.map((option) => (
                                <option key={option} value={option}>{option}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </section>

                      <section>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark-500">Business</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Business Name"
                            value={row.business.name}
                            error={getFieldError(errors, 'business.name')}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'name', e.target.value))}
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-dark-400">Category</label>
                            <select
                              value={row.business.category_id}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'category_id', e.target.value))}
                              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
                            >
                              <option value="">Select category</option>
                              {categories.map((category) => (
                                <option key={category.id} value={category.id}>{category.name}</option>
                              ))}
                            </select>
                            {getFieldError(errors, 'business.category_id') && (
                              <p className="text-xs text-status-error">{getFieldError(errors, 'business.category_id')}</p>
                            )}
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-dark-400">City</label>
                            <select
                              value={row.business.city_id}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'city_id', e.target.value))}
                              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
                            >
                              <option value="">Select city</option>
                              {cities.map((city) => (
                                <option key={city.id} value={city.id}>
                                  {city.name}{city.state ? `, ${city.state}` : ''}
                                </option>
                              ))}
                            </select>
                            {getFieldError(errors, 'business.city_id') && (
                              <p className="text-xs text-status-error">{getFieldError(errors, 'business.city_id')}</p>
                            )}
                          </div>
                          <Input
                            label="Contact"
                            value={row.business.contact}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'contact', e.target.value))}
                          />
                          <Input
                            label="WhatsApp"
                            value={row.business.whatsapp_no}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'whatsapp_no', e.target.value))}
                          />
                          <Input
                            label="Cover Image URL"
                            value={row.business.image_url}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'image_url', e.target.value))}
                          />
                          <Input
                            label="Latitude"
                            type="number"
                            step="any"
                            value={row.business.lat}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'lat', e.target.value))}
                          />
                          <Input
                            label="Longitude"
                            type="number"
                            step="any"
                            value={row.business.long}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'long', e.target.value))}
                          />
                          <div className="md:col-span-2">
                            <Textarea
                              label="Description"
                              rows={3}
                              value={row.business.description}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'description', e.target.value))}
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Textarea
                              label="Address"
                              rows={2}
                              value={row.business.address}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'business', 'address', e.target.value))}
                            />
                          </div>
                        </div>
                      </section>

                      <section>
                        <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-dark-500">Payment Optional</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Input
                            label="Razorpay Order ID"
                            value={row.payment.razorpay_order_id}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'razorpay_order_id', e.target.value))}
                          />
                          <Input
                            label="Razorpay Payment ID"
                            value={row.payment.razorpay_payment_id}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'razorpay_payment_id', e.target.value))}
                          />
                          <Input
                            label="Razorpay Signature"
                            value={row.payment.razorpay_signature}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'razorpay_signature', e.target.value))}
                          />
                          <Input
                            label="Amount"
                            type="number"
                            step="0.01"
                            value={row.payment.amount}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'amount', e.target.value))}
                          />
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-dark-400">Plan</label>
                            <select
                              value={row.payment.plan}
                              onChange={(e) => setRows((prev) => applyPlanPreset(prev, row.id, e.target.value))}
                              className="w-full bg-surface-2 border border-dark-700 rounded text-white text-sm px-3 py-2 outline-none focus:border-accent"
                            >
                              {PLAN_OPTIONS.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <Input
                            label="Currency"
                            value={row.payment.currency}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'currency', e.target.value))}
                            placeholder="INR"
                          />
                          <Input
                            label="Method"
                            value={row.payment.method}
                            onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'method', e.target.value))}
                          />
                          <div className="md:col-span-2">
                            <Textarea
                              label="Payment Description"
                              rows={2}
                              value={row.payment.description}
                              onChange={(e) => setRows((prev) => updateRow(prev, row.id, 'payment', 'description', e.target.value))}
                            />
                          </div>
                        </div>
                      </section>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader title="API Notes" subtitle="Use this when admin or superadmin needs to import multiple businesses at once." />
              <CardBody className="space-y-3 text-sm text-dark-300">
                <p>Required per item: user.name, user.email, user.phone, user.password, business.name, business.category_id and business.city_id.</p>
                <p>Payment is optional. Default plan is 1 month (₹1999). If omitted, backend can auto-generate safe payment data.</p>
                <p>Use UUIDs for category and city IDs. Phone must contain 10-15 digits.</p>
                <div className="rounded border border-dark-800 bg-dark-900 p-3 text-xs text-dark-400">
                  The backend returns a per-item results array, so you should review created and failed rows independently.
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader title="Summary" />
              <CardBody className="space-y-3">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <SummaryStat label="Total" value={totals.total || rows.length} />
                  <SummaryStat label="Created" value={totals.created || 0} tone="success" />
                  <SummaryStat label="Failed" value={totals.failed || 0} tone="error" />
                </div>
                <div className="rounded border border-dark-800 bg-dark-900 p-3 text-xs text-dark-400">
                  After submit, each row status appears below with its error message if creation fails.
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <ResultsTable results={totals.results || []} />
      </div>
    </div>
  );
}

function SummaryStat({ label, value, tone = 'default' }) {
  const toneClass =
    tone === 'success' ? 'text-status-success' : tone === 'error' ? 'text-status-error' : 'text-white';

  return (
    <div className="rounded border border-dark-800 bg-dark-900 px-3 py-4">
      <p className="text-[10px] uppercase tracking-widest text-dark-500">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
    </div>
  );
}