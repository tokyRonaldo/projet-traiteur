'use client';

import { useState } from 'react';
import { useRegisterCaterer } from '@/hooks/useRegisterCaterer';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import CustomToast from '../ui/CustomToast';
import type { RegisterCatererData } from '@/types';
import { useRouter } from 'next/navigation';
export default function CatererForm() {
  const { register, isLoading, error } = useRegisterCaterer();

  // État pour le toast
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);

    const formData = new FormData(e.currentTarget);

    const data: RegisterCatererData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      location: formData.get('location') as string,
      adresse: formData.get('adresse') as string,
      description: formData.get('description') as string,
    };

    try {
      await register(data);
      router.push('/');

    } catch (err: any) {
      setToast({
        message: err.message || 'Une erreur est survenue lors de l’inscription.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de l'entreprise */}
        <Input
          label="Company Name"
          id="name"
          name="name"
          placeholder="e.g. Heirloom Harvest Catering"
          type="text"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <Input
            label="Email Professionnel"
            id="email"
            name="email"
            placeholder="contact@yourcatering.com"
            type="email"
            required
          />

          {/* Contact Person */}
          <Input
            label="Contact Person"
            id="contact_person"
            name="contact_person"
            placeholder="Full Name"
            type="text"
          />
        </div>

        {/* Mot de passe */}
        <Input
          label="Mot de passe"
          id="password"
          name="password"
          placeholder="••••••••"
          type="password"
          required
        />

        {/* Adresse */}
        <Input
          label="Business Address"
          id="adresse"
          name="adresse"
          placeholder="123 Culinary Way, Suite 100"
          type="text"
          required
        />

        {/* Ville / Location */}
        <Input
          label="Ville / Location"
          id="location"
          name="location"
          placeholder="Antananarivo, Madagascar"
          type="text"
          required
        />

        {/* Description */}
        <div className="space-y-2">
          <label
            htmlFor="description"
            className="block text-sm font-semibold text-on-surface uppercase tracking-wider"
          >
            Description de votre activité
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-neutral-text/20 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all resize-y min-h-[100px]"
            placeholder="Décrivez votre service de traiteur, votre expérience, spécialités..."
            required
          />
        </div>

        {/* Website (optionnel) */}
        <Input
          label="Website (optionnel)"
          id="website"
          name="website"
          placeholder="https://www.yourkitchen.com"
          type="url"
        />

        {/* Message d'erreur global */}
        {(error || (toast?.type === 'error' && toast.message)) && (
          <p className="text-red-600 text-sm text-center font-medium">
            {error || toast?.message}
          </p>
        )}

        <div className="pt-6 flex flex-col md:flex-row gap-4">
          <Button
            type="submit"
            className="flex-grow text-lg"
            disabled={isLoading}
          >
            {isLoading ? 'Inscription en cours...' : 'Continue to Step 2'}
          </Button>

          <Button variant="secondary" type="button" disabled={isLoading}>
            Save Draft
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          By continuing, you agree to Saffron Hearth&apos;s{' '}
          <a href="#" className="underline hover:text-primary">
            Caterer Terms of Service
          </a>
          .
        </p>
      </form>

      {toast && (
        <CustomToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
          duration={toast.type === 'success' ? 2500 : 6000}
        />
      )}
    </>
  );
}