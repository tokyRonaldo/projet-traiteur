// app/admin/settings/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

const FIELDS = [
  { key: 'platform_name', label: 'Nom plateforme' },
  { key: 'logo', label: 'Logo (URL)' },
  { key: 'email', label: 'Email contact' },
  { key: 'phone', label: 'Téléphone' },
  { key: 'commission', label: 'Commission (%)' },
  { key: 'tva', label: 'TVA (%)' },
  { key: 'stripe_key', label: 'Clé Stripe' },
  { key: 'cloudinary_key', label: 'Clé Cloudinary' },
  { key: 'smtp_host', label: 'SMTP Host' },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('admin/settings').then(setSettings);
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await api.put('admin/settings', { settings });
    setSaving(false);
    alert('Paramètres enregistrés');
  };

  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Paramètres</h1>

      <div className="bg-white rounded-lg shadow p-4 space-y-4">
        {FIELDS.map((field) => (
          <div key={field.key}>
            <label className="block text-sm font-medium mb-1">{field.label}</label>
            <input
              type="text"
              value={settings[field.key] || ''}
              onChange={(e) => handleChange(field.key, e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
        ))}

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 bg-indigo-600 text-white rounded disabled:opacity-50"
        >
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </div>
  );
}