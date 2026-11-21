import React, { useEffect, useState } from 'react';
import { Save, UserPlus, Trash2, ShieldCheck } from 'lucide-react';
import { AdminUser, LanguageCode, WebsiteSettings } from '../../types/hotel';
import {
  addAdminUser,
  removeAdminUser,
  saveSettings,
} from '../../services/hotelService';
import { BOOTSTRAPPED_ADMIN_EMAIL } from '../../lib/firebase';
import { useToast } from '../../components/common/Toast';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

interface AdminSettingsProps {
  settings: WebsiteSettings;
  admins: AdminUser[];
}

export function AdminSettings({ settings, admins }: AdminSettingsProps) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    currency: settings.currency,
    defaultLanguage: settings.defaultLanguage,
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
    diningEnabled: settings.diningEnabled,
    bookingNotice: settings.bookingNotice,
  });
  const [saving, setSaving] = useState(false);

  const [newAdminUid, setNewAdminUid] = useState('');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [addingAdmin, setAddingAdmin] = useState(false);

  const [deleteAdminTarget, setDeleteAdminTarget] = useState<AdminUser | null>(null);
  const [deletingAdmin, setDeletingAdmin] = useState(false);

  useEffect(() => {
    setForm({
      currency: settings.currency,
      defaultLanguage: settings.defaultLanguage,
      seoTitle: settings.seoTitle,
      seoDescription: settings.seoDescription,
      diningEnabled: settings.diningEnabled,
      bookingNotice: settings.bookingNotice,
    });
  }, [settings]);

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveSettings({
        ...settings,
        currency: form.currency,
        defaultLanguage: form.defaultLanguage,
        seoTitle: form.seoTitle,
        seoDescription: form.seoDescription,
        diningEnabled: form.diningEnabled,
        bookingNotice: form.bookingNotice,
      });
      showToast('System settings updated.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminUid.trim() || !newAdminEmail.trim() || !newAdminName.trim()) {
      showToast('UID, email, and name are required to authorize an admin.', 'error');
      return;
    }
    setAddingAdmin(true);
    try {
      await addAdminUser(newAdminUid.trim(), newAdminEmail.trim(), newAdminName.trim());
      setNewAdminUid('');
      setNewAdminEmail('');
      setNewAdminName('');
      showToast('Authorized administrator added.', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to add administrator.', 'error');
    } finally {
      setAddingAdmin(false);
    }
  };

  const handleRemoveAdmin = async () => {
    if (!deleteAdminTarget) return;
    setDeletingAdmin(true);
    try {
      await removeAdminUser(deleteAdminTarget.id);
      showToast('Administrator removed.', 'success');
      setDeleteAdminTarget(null);
    } catch (err) {
      console.error(err);
      showToast('Failed to remove administrator.', 'error');
    } finally {
      setDeletingAdmin(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <form onSubmit={handleSaveSettings} className="bg-white border border-slate-200 p-6 space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Website Preferences, SEO & Dining Toggle</h2>
          <p className="text-xs text-slate-500">
            Configure localization, SEO metadata, dining visibility, and guest enquiry notice.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Currency Code</label>
            <input
              type="text"
              required
              maxLength={12}
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 text-sm font-mono"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Default Website Language</label>
            <select
              value={form.defaultLanguage}
              onChange={(e) => setForm({ ...form, defaultLanguage: e.target.value as LanguageCode })}
              className="w-full px-3 py-2 border border-slate-300 text-sm bg-white"
            >
              <option value="en">English (en)</option>
              <option value="ne">Nepali (ne)</option>
            </select>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.diningEnabled}
              onChange={(e) => setForm({ ...form, diningEnabled: e.target.checked })}
              className="w-4 h-4 mt-0.5 accent-slate-900"
            />
            <div>
              <span className="block text-sm font-medium text-slate-900">
                Enable Restaurant / Dining Section Publicly
              </span>
              <span className="block text-xs text-slate-500 mt-0.5">
                When unchecked, any facility categorized under Restaurant / Dining is hidden from public pages automatically.
              </span>
            </div>
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">SEO Page Title</label>
          <input
            type="text"
            maxLength={120}
            value={form.seoTitle}
            onChange={(e) => setForm({ ...form, seoTitle: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">SEO Meta Description</label>
          <textarea
            rows={2}
            maxLength={320}
            value={form.seoDescription}
            onChange={(e) => setForm({ ...form, seoDescription: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-700 mb-1">Booking Enquiry Policy Notice</label>
          <textarea
            rows={3}
            maxLength={600}
            value={form.bookingNotice}
            onChange={(e) => setForm({ ...form, bookingNotice: e.target.value })}
            className="w-full px-3 py-2 border border-slate-300 text-sm"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 disabled:opacity-60"
          >
            <Save className="w-4 h-4 text-[#C9A461]" />
            <span>{saving ? 'Saving...' : 'Save Settings'}</span>
          </button>
        </div>
      </form>

      {/* Admin Access Whitelist */}
      <section className="bg-white border border-slate-200 p-6 space-y-5">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-base font-semibold text-slate-900">Authorized Administrators</h2>
          <p className="text-xs text-slate-500">
            Manage Firestore-whitelisted admin UIDs. Public self-registration is strictly disabled in security rules.
          </p>
        </div>

        <div className="p-3.5 bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
            <div>
              <p className="font-semibold">Bootstrapped Property Owner</p>
              <p className="font-mono text-emerald-800">{BOOTSTRAPPED_ADMIN_EMAIL}</p>
            </div>
          </div>
          <span className="text-emerald-800 font-medium">Primary</span>
        </div>

        {admins.length > 0 && (
          <div className="overflow-x-auto border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500">
                  <th className="py-2.5 px-4 font-medium">Name</th>
                  <th className="py-2.5 px-4 font-medium">Email</th>
                  <th className="py-2.5 px-4 font-medium">Firebase UID</th>
                  <th className="py-2.5 px-4 font-medium text-right">Remove</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {admins.map((a) => (
                  <tr key={a.id}>
                    <td className="py-2.5 px-4 font-medium text-slate-900">{a.name}</td>
                    <td className="py-2.5 px-4 text-slate-700">{a.email}</td>
                    <td className="py-2.5 px-4 font-mono text-xs text-slate-500">{a.id}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setDeleteAdminTarget(a)}
                        aria-label={`Remove ${a.email}`}
                        className="p-1.5 text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-200">
          <input
            type="text"
            placeholder="Firebase Auth UID"
            value={newAdminUid}
            onChange={(e) => setNewAdminUid(e.target.value)}
            className="px-3 py-2 border border-slate-300 text-sm font-mono"
          />
          <input
            type="email"
            placeholder="Verified Email Address"
            value={newAdminEmail}
            onChange={(e) => setNewAdminEmail(e.target.value)}
            className="px-3 py-2 border border-slate-300 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Staff Name"
              value={newAdminName}
              onChange={(e) => setNewAdminName(e.target.value)}
              className="flex-1 min-w-0 px-3 py-2 border border-slate-300 text-sm"
            />
            <button
              type="submit"
              disabled={addingAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white text-xs font-medium hover:bg-slate-800 whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>
      </section>

      {/* Firebase Storage & Deployment Reference */}
      <section className="bg-slate-50 border border-slate-200 p-5 text-xs text-slate-600 space-y-2 leading-relaxed">
        <h3 className="font-semibold text-slate-900">Firebase Configuration Checklist</h3>
        <p>
          1. <strong>Storage Uploads</strong>: Run <span className="font-mono bg-white px-1.5 py-0.5 border border-slate-200">firebase deploy --only storage</span> in the Firebase CLI to publish <span className="font-mono">storage.rules</span> before uploading files via Firebase Storage.
        </p>
        <p>
          2. <strong>Email/Password Staff Logins</strong>: Enable the Email/Password provider inside Firebase Console &rarr; Authentication &rarr; Sign-in method, ensure user emails are marked verified, and whitelist their UID above.
        </p>
      </section>

      <ConfirmDialog
        open={Boolean(deleteAdminTarget)}
        title="Revoke Admin Access"
        description={`Remove "${deleteAdminTarget?.email}" from the authorized administrators whitelist?`}
        onConfirm={handleRemoveAdmin}
        onCancel={() => setDeleteAdminTarget(null)}
        loading={deletingAdmin}
      />
    </div>
  );
}
