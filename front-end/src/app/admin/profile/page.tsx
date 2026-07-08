// components/admin/profile/AdminProfile.tsx
'use client';

import { useEffect, useState } from 'react';
import { UserRound, Mail, Phone, KeyRound, Save } from 'lucide-react';
import { api } from '@/lib/api';

interface AdminUser {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

export default function AdminProfile() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    api
      .get('admin/profile')
      .then((res) => {
        setUser(res);
        setForm({ name: res.name, email: res.email, phone: res.phone ?? '' });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSuccessMessage(false);
    try {
      const res = await api.put('admin/profile', form);
      setUser(res.user);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      setPasswordError('Les mots de passe ne correspondent pas.');
      return;
    }

    setPasswordSaving(true);
    try {
      await api.put('admin/profile/password', passwordForm);
      setPasswordSuccess(true);
      setPasswordForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: any) {
      setPasswordError(err.message || 'Une erreur est survenue.');
    } finally {
      setPasswordSaving(false);
    }
  };

  if (loading) return <p className="text-gray-500">Chargement...</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Mon profil</h2>
        <p className="text-gray-500">Gérez vos informations de compte administrateur.</p>
      </div>

      {/* Informations personnelles */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <UserRound className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
          <h3 className="font-bold text-lg">Informations personnelles</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Téléphone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" strokeWidth={1.75} />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" strokeWidth={1.75} />
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {successMessage && <span className="text-sm text-green-700">Profil mis à jour ✓</span>}
          </div>
        </div>
      </div>

      {/* Changement de mot de passe */}
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-gray-700" strokeWidth={1.75} />
          <h3 className="font-bold text-lg">Changer le mot de passe</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Mot de passe actuel</label>
            <input
              type="password"
              value={passwordForm.current_password}
              onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={passwordForm.new_password}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Confirmer</label>
              <input
                type="password"
                value={passwordForm.new_password_confirmation}
                onChange={(e) => setPasswordForm({ ...passwordForm, new_password_confirmation: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 outline-none transition-all"
              />
            </div>
          </div>

          {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
          {passwordSuccess && <p className="text-sm text-green-700">Mot de passe mis à jour ✓</p>}

          <button
            onClick={handleChangePassword}
            disabled={passwordSaving}
            className="px-4 py-2 border-2 border-gray-900 text-gray-900 rounded-lg text-sm font-semibold hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-50"
          >
            {passwordSaving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  );
}