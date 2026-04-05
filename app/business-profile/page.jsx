/**
 * app/business-profile/page.jsx
 * ─────────────────────────────────────────────────────────
 * Business profile — create or update via real API.
 * Uses /business/createBusiness or /business/updateBusiness.
 * ─────────────────────────────────────────────────────────
 */

'use client';

import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/Toast';
import Card, { CardHeader, CardBody } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import { CardSkeleton } from '@/components/ui/Skeleton';
import DashboardLayout from '@/components/shared/DashboardLayout';
import { getUserSession } from '@/lib/helpers';
import { getBusinessById, createBusiness, updateBusiness } from '@/services/businessService';
import { getAllCategories } from '@/services/categoriesService';
import { getAllCities } from '@/services/citiesService';

function normalizeCategoriesResponse(response) {
  const rawCategories = Array.isArray(response)
    ? response
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.categories)
    ? response.categories
    : [];

  return rawCategories.map((cat) => {
    const rawSubcategories = Array.isArray(cat?.sub_categories)
      ? cat.sub_categories
      : Array.isArray(cat?.subcategories)
      ? cat.subcategories
      : [];

    const normalizedSubcategories = rawSubcategories.map((sub) => ({
      id: sub?.id || '',
      name: sub?.sub_cat || sub?.name || 'Unnamed Subcategory',
    })).filter((sub) => sub.id);

    return {
      id: cat?.id || '',
      name: cat?.type_cat || cat?.name || 'Unnamed Category',
      subcategories: normalizedSubcategories.length > 0
        ? normalizedSubcategories
        : cat?.id
        ? [{ id: cat.id, name: cat?.type_cat || cat?.name || 'Unnamed Category' }]
        : [],
    };
  }).filter((cat) => cat.id);
}

function normalizeCitiesResponse(response) {
  return Array.isArray(response)
    ? response
    : Array.isArray(response?.cities)
    ? response.cities
    : Array.isArray(response?.data)
    ? response.data
    : [];
}

function findParentCategoryId(categories, selectedSubcategoryId) {
  if (!selectedSubcategoryId) return '';
  for (const category of categories) {
    if (category.id === selectedSubcategoryId) return category.id;
    if (category.subcategories.some((sub) => sub.id === selectedSubcategoryId)) {
      return category.id;
    }
  }
  return '';
}

function findSubcategoryName(categories, selectedSubcategoryId) {
  if (!selectedSubcategoryId) return '';
  for (const category of categories) {
    const match = category.subcategories.find((sub) => sub.id === selectedSubcategoryId);
    if (match) return match.name;
  }
  return '';
}

export default function BusinessProfilePage() {
  const { toast } = useToast();
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [business, setBusiness]   = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [cities, setCities]       = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [form, setForm] = useState({
    name: '', description: '', category_id: '', city_id: '',
    contact: '', whatsapp_no: '', address: '', lat: '', long: '',
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [cats, cits] = await Promise.all([
          getAllCategories().catch(() => []),
          getAllCities().catch(() => []),
        ]);
        setCategories(normalizeCategoriesResponse(cats));
        setCities(normalizeCitiesResponse(cits));

        const session = getUserSession();
        const businessId = session.dashboard?.business_id;
        if (businessId) {
          const biz = await getBusinessById(businessId).catch(() => null);
          if (biz) {
            setBusiness(biz);
            setForm({
              name:        biz.name || '',
              description: biz.description || '',
              category_id: biz.category_id || '',
              city_id:     biz.city_id || '',
              contact:     biz.contact || '',
              whatsapp_no: biz.whatsapp_no || '',
              address:     biz.address || '',
              lat:         biz.lat || '',
              long:        biz.long || '',
            });
            if (biz.image_url) setImagePreview(biz.image_url);
          }
        }
      } catch (err) {
        toast.error('Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    const parentCategoryId = findParentCategoryId(categories, form.category_id);
    setSelectedCategoryId(parentCategoryId);
  }, [categories, form.category_id]);

  const update = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleCategoryChange = (e) => {
    const parentId = e.target.value;
    setSelectedCategoryId(parentId);
    setForm((p) => ({ ...p, category_id: '' }));
  };

  const availableSubcategories = categories.find((cat) => cat.id === selectedCategoryId)?.subcategories || [];
  const selectedSubcategoryName = findSubcategoryName(categories, form.category_id);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });
      if (imageFile) formData.append('image_url', imageFile);

      let result;
      if (business) {
        result = await updateBusiness(formData);
      } else {
        result = await createBusiness(formData);
      }
      setBusiness(result);
      toast.success(business ? 'Business updated!' : 'Business created!');
    } catch (err) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Business Profile</h1>
          <p className="text-sm text-dark-400">
            {business ? 'Update your business information.' : 'Set up your business profile.'}
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            <CardSkeleton lines={3} />
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
              <CardSkeleton lines={6} />
              <CardSkeleton lines={6} />
            </div>
          </div>
        ) : (
          <>
            {/* Cover / Image */}
            <Card className="mb-4 overflow-hidden">
              <div className="h-32 md:h-44 bg-gradient-to-br from-[#3a3000] to-[#111100] relative">
                {imagePreview && (
                  <img src={imagePreview} alt="Business" className="w-full h-full object-cover absolute inset-0" />
                )}
                <label className="absolute bottom-3 right-4 flex items-center gap-1.5 bg-black/50 text-white text-xs px-3 py-1.5 rounded hover:bg-black/70 transition-colors cursor-pointer">
                  <CameraIcon /> Change Cover
                  <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden" />
                </label>
              </div>
              <div className="flex items-center gap-3.5 px-4 md:px-5 py-3 md:py-4 border-t border-dark-800">
                <div className="w-12 h-12 rounded bg-dark-700 border-2 border-dark-600 flex items-center justify-center text-dark-400 flex-shrink-0 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <CameraIcon />
                  )}
                </div>
                <div>
                  <p className="text-md font-bold text-white">{form.name || 'Your Business'}</p>
                  <p className="text-xs text-dark-400">
                    {selectedSubcategoryName || 'Select subcategory'}
                  </p>
                </div>
              </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_260px] gap-4">
              {/* Basic Info */}
              <Card>
                <CardHeader title="Basic Information" />
                <CardBody className="space-y-4">
                  <Input label="Business Name" value={form.name} onChange={update('name')} required />
                  <Textarea label="Description" value={form.description} onChange={update('description')} rows={3} maxLength={2000} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-dark-300 mb-1.5">Category</label>
                      <select
                        value={selectedCategoryId}
                        onChange={handleCategoryChange}
                        className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-dark-500 transition-colors"
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-dark-300 mb-1.5">Subcategory</label>
                      <select
                        value={form.category_id}
                        onChange={update('category_id')}
                        disabled={!selectedCategoryId}
                        className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-dark-500 transition-colors disabled:opacity-60"
                      >
                        <option value="">{selectedCategoryId ? 'Select subcategory' : 'Select category first'}</option>
                        {availableSubcategories.map((sub) => (
                          <option key={sub.id} value={sub.id}>{sub.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-dark-300 mb-1.5">City</label>
                      <select
                        value={form.city_id}
                        onChange={update('city_id')}
                        className="w-full bg-dark-800 border border-dark-700 rounded px-3 py-2 text-sm text-white outline-none focus:border-dark-500 transition-colors"
                      >
                        <option value="">Select city</option>
                        {cities.map(city => (
                          <option key={city.id} value={city.id}>{city.name}{city.state ? `, ${city.state}` : ''}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <Input label="Address" value={form.address} onChange={update('address')} placeholder="123 Main St, City" maxLength={500} />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input label="Latitude" type="number" step="any" value={form.lat} onChange={update('lat')} placeholder="26.9124" />
                    <Input label="Longitude" type="number" step="any" value={form.long} onChange={update('long')} placeholder="75.7873" />
                  </div>
                </CardBody>
              </Card>

              {/* Contact */}
              <Card className="lg:self-start">
                <CardHeader title="Contact Details" />
                <CardBody className="space-y-3">
                  {[
                    { label: 'Phone',    key: 'contact',     icon: <PhoneIcon />,    placeholder: '9876543210' },
                    { label: 'WhatsApp', key: 'whatsapp_no', icon: <WhatsAppIcon />, placeholder: '9876543210' },
                    { label: 'Address',  key: 'address',     icon: <PinIcon />,      placeholder: '123 Main St' },
                  ].map(f => (
                    <div key={f.key} className="flex items-start gap-2.5">
                      <span className="text-dark-500 w-4 h-4 mt-2 flex-shrink-0">{f.icon}</span>
                      <input
                        className="flex-1 bg-transparent border-b border-dark-800 text-sm text-dark-300 pb-1.5 outline-none focus:border-dark-600 placeholder-dark-600 transition-colors"
                        placeholder={f.placeholder}
                        value={form[f.key]}
                        onChange={update(f.key)}
                      />
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 mt-5">
              <Button variant="outline" onClick={() => window.history.back()}>Cancel</Button>
              <Button loading={saving} onClick={handleSave}>
                {business ? 'Save Changes' : 'Create Business'}
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function CameraIcon()   { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>; }
function PhoneIcon()    { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.62 3.36 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>; }
function WhatsAppIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>; }
function PinIcon()      { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>; }
