// components/caterer/profile/ProfileContent.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  UploadCloud,
  Pencil,
  Mail,
  Phone,
  Globe,
  MapPin,
  ExternalLink,
} from 'lucide-react';
import { api } from '@/lib/api';

interface CatererData {
  id: number;
  company_name: string;
  description: string;
  address: string;
  location: string;
  website: string | null;
  logo_url: string | null;
  contact: string | null;

  user: {
    email: string;
    name: string;

  };
}

export default function ProfileContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    company_name: '',
    description: '',
    address: '',
    location: '',
    website: '',
    email: '',
    contact: '',
  });
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    api
      .get('caterer/profile')
      .then((data: CatererData) => {
        setForm({
          company_name: data.company_name ?? '',
          description: data.description ?? '',
          address: data.address ?? '',
          location: data.location ?? '',
          website: data.website ?? '',
          email: data.user?.email ?? '',
          contact: data.contact ?? '',
        });
        setLogoUrl(data.logo_url ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('caterer/profile', form);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogoClick = () => fileInputRef.current?.click();

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('logo', file);

    setUploadingLogo(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/caterer/profile/logo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });
      const data = await res.json();
      console.log('responnnnnnnnnnnnnse')
      console.log(data.logo_url)
      setLogoUrl(data.logo_url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingLogo(false);
    }
  };

  if (loading) {
    return <p className="text-[#58423d]">Chargement du profil...</p>;
  }

  return (
    <div className="relative">
      <header className="mb-6">
        <h2 className="text-3xl font-bold text-[#1d1b17] mb-1">Profil traiteur</h2>
        <p className="text-[#58423d]">
          Gérez l&apos;identité de votre marque artisanale et vos informations de contact.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* Informations de l'entreprise */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#9b2f1e] flex items-center gap-2 mb-6">
            <Building2 className="w-5 h-5" strokeWidth={1.75} />
            Informations de l&apos;entreprise
          </h3>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-shrink-0">
              <p className="text-xs font-semibold text-[#58423d] mb-2">Logo de l&apos;entreprise</p>
              <div
                onClick={handleLogoClick}
                className="relative group w-40 h-40 rounded-xl bg-[#ede7e0] border-2 border-dashed border-[#dfc0ba] flex flex-col items-center justify-center overflow-hidden transition-all hover:border-[#9b2f1e] cursor-pointer"
              >
                {logoUrl ? (
                  <img src={`${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <Building2 className="w-10 h-10 text-[#8b716c]" strokeWidth={1.5} />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <UploadCloud className="w-8 h-8 text-white" strokeWidth={1.75} />
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="hidden"
              />
              <button
                onClick={handleLogoClick}
                disabled={uploadingLogo}
                className="mt-2 text-xs text-[#9b2f1e] font-bold flex items-center justify-center w-full gap-1 disabled:opacity-50"
              >
                <Pencil className="w-3 h-3" strokeWidth={2} />
                {uploadingLogo ? 'Envoi en cours...' : 'Changer le logo'}
              </button>
            </div>

            <div className="flex-grow space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#58423d] mb-1">
                  Nom de l&apos;entreprise
                </label>
                <input
                  type="text"
                  value={form.company_name}
                  onChange={(e) => handleChange('company_name', e.target.value)}
                  className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg p-3 font-bold text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#58423d] mb-1">
                  Bio professionnelle / Description
                </label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg p-3 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all resize-y"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Aperçu public */}
        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-[#ede7e0] rounded-xl p-4 border border-[#dfc0ba]">
            <h4 className="text-xs font-bold text-[#1d1b17] uppercase tracking-wider mb-3">
              Aperçu public
            </h4>
            <div className="rounded-lg overflow-hidden border border-[#dfc0ba] mb-2 h-32 bg-[#e7e2db] flex items-center justify-center">
              {logoUrl ? (
                <img src={`${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`} alt="Aperçu" className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs text-[#8b716c]">Aucun logo</span>
              )}
            </div>
            <p className="text-xs text-[#58423d] italic">
              Voici comment votre marque apparaît aux clients potentiels sur la marketplace.
            </p>
            <Link
              href={`/traiteurs/${form.company_name}`}
              className="w-full mt-3 text-[#9b2f1e] text-sm font-semibold flex items-center justify-center gap-2"
            >
              Voir le profil marketplace
              <ExternalLink className="w-4 h-4" strokeWidth={2} />
            </Link>
          </div>
        </aside>

        {/* Coordonnées */}
        <section className="col-span-12 lg:col-span-6 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#9b2f1e] mb-4 flex items-center gap-2">
            <Mail className="w-5 h-5" strokeWidth={1.75} />
            Coordonnées
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">
                Email professionnel principal
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg py-3 pl-10 pr-3 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#58423d] mb-1">Téléphone</label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
                  <input
                    type="tel"
                    value={form.contact}
                    onChange={(e) => handleChange('contact', e.target.value)}
                    className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg py-3 pl-10 pr-3 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#58423d] mb-1">
                  Site web (optionnel)
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#58423d]" strokeWidth={1.75} />
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg py-3 pl-10 pr-3 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Localisation */}
        <section className="col-span-12 lg:col-span-6 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-[#9b2f1e] mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" strokeWidth={1.75} />
            Localisation
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#58423d] mb-1">Adresse</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => handleChange('address', e.target.value)}
                className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg p-3 mb-2 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
              />
              <input
                type="text"
                value={form.location}
                onChange={(e) => handleChange('location', e.target.value)}
                className="w-full bg-[#fef8f1] border border-[#dfc0ba] rounded-lg p-3 text-[#1d1b17] focus:ring-2 focus:ring-[#9b2f1e]/20 focus:border-[#9b2f1e] transition-all"
                placeholder="Ville, Région"
              />
            </div>
          </div>
        </section>

        {/* Actions */}
        <section className="col-span-12 bg-white border border-[#dfc0ba] rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#9b2f1e] mb-1">Actions du compte</h3>
              <p className="text-[#58423d]">Gérez vos identifiants de sécurité.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="bg-white border border-[#8b716c] text-[#1d1b17] px-4 py-2 rounded-full text-sm font-semibold hover:bg-[#ede7e0] transition-all">
                Changer le mot de passe
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[#9b2f1e] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:bg-[#872111] transition-all active:scale-95 disabled:opacity-50"
              >
                {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
              </button>
            </div>
          </div>
        </section>
      </div>

      <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-[#9b2f1e]/20 flex items-center gap-2 transition-transform duration-500 ${
          showToast ? 'translate-y-0' : 'translate-y-24'
        }`}
      >
        <span className="text-sm font-semibold text-[#1d1b17]">
          Profil mis à jour avec succès.
        </span>
      </div>
    </div>
  );
}