'use client';

import { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { api } from '@/lib/api';

export default function Settings() {
  const [form, setForm] = useState({
    current_password: '',
    new_password: '',
    new_password_confirmation: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setSuccess(false);

    if (form.new_password !== form.new_password_confirmation) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setSaving(true);
    try {
      await api.put('caterer/profile/password', form);
      setSuccess(true);
      setForm({ current_password: '', new_password: '', new_password_confirmation: '' });
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17]">Paramètres</h2>
        <p className="text-[#58423d]">Gérez la sécurité de votre compte.</p>
      </div>

      <div className="bg-white border border-[#dfc0ba] rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <KeyRound className="w-5 h-5 text-[#9b2f1e]" strokeWidth={1.75} />
          <h3 className="font-bold text-lg">Changer le mot de passe</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#58423d] mb-1">Mot de passe actuel</label>
            <input
              type="password"
              value={form.current_password}
              onChange={(e) => setForm({ ...form, current_password: e.target.value })}
              className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Nouveau mot de passe</label>
              <input
                type="password"
                value={form.new_password}
                onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Confirmer</label>
              <input
                type="password"
                value={form.new_password_confirmation}
                onChange={(e) => setForm({ ...form, new_password_confirmation: e.target.value })}
                className="w-full border border-[#dfc0ba] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] outline-none transition-all"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-700">Mot de passe mis à jour ✓</p>}

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-6 py-2 bg-[#9b2f1e] text-white rounded-full text-sm font-semibold hover:bg-[#872111] transition-colors disabled:opacity-50"
          >
            {saving ? 'Modification...' : 'Modifier le mot de passe'}
          </button>
        </div>
      </div>
    </div>
  );
}