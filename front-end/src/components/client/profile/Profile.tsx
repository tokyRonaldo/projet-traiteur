// components/client/profile/Profile.tsx
'use client';

import { useEffect, useState } from 'react';
import { User, Mail, Phone, KeyRound } from 'lucide-react';
import { api } from '@/lib/api';

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [pwForm, setPwForm] = useState({ current_password: '', new_password: '', new_password_confirmation: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSuccess, setPwSuccess] = useState(false);

  useEffect(() => {
    api.get('client/profile').then((data) => {
      setForm({ name: data.name, email: data.email, phone: data.phone ?? '' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('client/profile', form);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    setPwError(null);
    if (pwForm.new_password !== pwForm.new_password_confirmation) {
      setPwError('Les mots de passe ne correspondent pas.');
      return;
    }
    setPwSaving(true);
    try {
      await api.put('client/profile/password', pwForm);
      setPwSuccess(true);
      setPwForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setTimeout(() => setPwSuccess(false), 3000);
    } catch (err: any) {
      setPwError(err.message || 'Une erreur est survenue.');
    } finally {
      setPwSaving(false);
    }
  };

  if (loading) return <p className="text-[#58423d]">Chargement...</p>;

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h2 className="text-3xl font-bold text-[#1d1b17]">Mon profil</h2>
        <p className="text-[#58423d]">Gérez vos informations personnelles.</p>
      </header>

      <div className="bg-white border border-[#dfc0ba] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
          <h3 className="font-bold text-lg">Informations personnelles</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Nom complet</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-[#dfc0ba] rounded-lg text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Téléphone</label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2 border border-[#dfc0ba] rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </button>
            {success && <span className="text-sm text-green-700">Profil mis à jour ✓</span>}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#dfc0ba] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
          <h3 className="font-bold text-lg">Changer le mot de passe</h3>
        </div>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Mot de passe actuel"
            value={pwForm.current_password}
            onChange={(e) => setPwForm({ ...pwForm, current_password: e.target.value })}
            className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="password"
              placeholder="Nouveau mot de passe"
              value={pwForm.new_password}
              onChange={(e) => setPwForm({ ...pwForm, new_password: e.target.value })}
              className="border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm"
            />
            <input
              type="password"
              placeholder="Confirmer"
              value={pwForm.new_password_confirmation}
              onChange={(e) => setPwForm({ ...pwForm, new_password_confirmation: e.target.value })}
              className="border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm"
            />
          </div>
          {pwError && <p className="text-sm text-red-600">{pwError}</p>}
          {pwSuccess && <p className="text-sm text-green-700">Mot de passe mis à jour ✓</p>}
          <button
            onClick={handlePasswordChange}
            disabled={pwSaving}
            className="px-6 py-2 border-2 border-[#9b2f1e] text-[#9b2f1e] rounded-full text-sm font-semibold hover:bg-[#ffdad4]/30 transition-colors disabled:opacity-50"
          >
            {pwSaving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  );
}