import React, { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
import { WebsiteSettings } from '../../types/hotel';
import { saveSettings } from '../../services/hotelService';
import { useToast } from '../../components/common/Toast';
import { ImageUploadField } from '../../components/admin/ImageUploadField';

interface AdminContentProps {
  settings: WebsiteSettings;
}

export function AdminContent({ settings }: AdminContentProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState<WebsiteSettings>(settings);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings({
        ...settings,
        hotelName: form.hotelName,
        tagline: form.tagline,
        locationLabel: form.locationLabel,
        heroTitle: form.heroTitle,
        heroSubtitle: form.heroSubtitle,
        heroIntro: form.heroIntro,
        heroImageUrl: form.heroImageUrl,
        aboutTitle: form.aboutTitle,
        aboutHeading: form.aboutHeading,
        aboutBody: form.aboutBody,
        hospitalityNote: form.hospitalityNote,
        comfortNote: form.comfortNote,
        aboutImageUrl: form.aboutImageUrl,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        googleMapsUrl: form.googleMapsUrl,
        mapLat: Number(form.mapLat) || 27.0104,
        mapLng: Number(form.mapLng) || 84.8774,
        facebookUrl: form.facebookUrl,
        instagramUrl: form.instagramUrl,
        footerNote: form.footerNote,
      });
      showToast('Website content published to Firestore.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save website content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {/* Hero & Brand */}
      <section className="bg-white border border-slate-200 p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Hero & Property Branding</h2>
          <p className="text-xs text-slate-500">Controls the homepage cinema header, tagline, and primary hero backdrop.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hotel Name</label>
            <input
              type="text"
              required
              maxLength={120}
              value={form.hotelName}
              onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Location Label</label>
            <input
              type="text"
              maxLength={100}
              value={form.locationLabel}
              onChange={(e) => setForm({ ...form, locationLabel: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hero Headline</label>
            <input
              type="text"
              required
              maxLength={180}
              value={form.heroTitle}
              onChange={(e) => setForm({ ...form, heroTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Hero Eyebrow / Subtitle</label>
            <input
              type="text"
              maxLength={240}
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Tagline</label>
          <input
            type="text"
            maxLength={160}
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Hero Introduction</label>
          <textarea
            rows={2}
            maxLength={800}
            value={form.heroIntro}
            onChange={(e) => setForm({ ...form, heroIntro: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <ImageUploadField
          label="Hero Background Photograph"
          value={form.heroImageUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, heroImageUrl: url }))}
          folder="branding"
        />
      </section>

      {/* About Page & Hospitality Story */}
      <section className="bg-white border border-slate-200 p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">About & Hospitality Story</h2>
          <p className="text-xs text-slate-500">Displayed on the Homepage welcome section and About Us page.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">About Section Label</label>
            <input
              type="text"
              maxLength={160}
              value={form.aboutTitle}
              onChange={(e) => setForm({ ...form, aboutTitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">About Heading</label>
            <input
              type="text"
              maxLength={180}
              value={form.aboutHeading}
              onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Main Introduction Paragraph</label>
          <textarea
            rows={4}
            maxLength={3000}
            value={form.aboutBody}
            onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Our Hospitality Note</label>
            <textarea
              rows={3}
              maxLength={1500}
              value={form.hospitalityNote}
              onChange={(e) => setForm({ ...form, hospitalityNote: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Guest Comfort Note</label>
            <textarea
              rows={3}
              maxLength={1500}
              value={form.comfortNote}
              onChange={(e) => setForm({ ...form, comfortNote: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
        </div>

        <ImageUploadField
          label="About / Reception Feature Image"
          value={form.aboutImageUrl}
          onChange={(url) => setForm((prev) => ({ ...prev, aboutImageUrl: url }))}
          folder="branding"
        />
      </section>

      {/* Contact, Coordinates & Footer */}
      <section className="bg-white border border-slate-200 p-6 space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Location, Contact & Social Details</h2>
          <p className="text-xs text-slate-500">Leave phone/email/social blank until finalized—no invented numbers are ever displayed.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
            <input
              type="text"
              maxLength={300}
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Google Maps Directions URL</label>
            <input
              type="url"
              maxLength={1000}
              value={form.googleMapsUrl}
              onChange={(e) => setForm({ ...form, googleMapsUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Reception Phone</label>
            <input
              type="text"
              maxLength={60}
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="+977 ..."
              className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">WhatsApp Number</label>
            <input
              type="text"
              maxLength={60}
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              placeholder="97798..."
              className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email</label>
            <input
              type="email"
              maxLength={160}
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="stay@mankamanaguesthouse.com"
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Map Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={form.mapLat}
                onChange={(e) => setForm({ ...form, mapLat: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Map Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={form.mapLng}
                onChange={(e) => setForm({ ...form, mapLng: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 text-sm tabular-nums"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Facebook URL</label>
            <input
              type="url"
              maxLength={500}
              value={form.facebookUrl}
              onChange={(e) => setForm({ ...form, facebookUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Instagram URL</label>
            <input
              type="url"
              maxLength={500}
              value={form.instagramUrl}
              onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Footer Note</label>
          <input
            type="text"
            maxLength={400}
            value={form.footerNote}
            onChange={(e) => setForm({ ...form, footerNote: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
        >
          <Save className="w-4 h-4 text-[#C9A461]" />
          <span>{saving ? 'Saving Content...' : 'Save Website Content'}</span>
        </button>
      </div>
    </form>
  );
}
