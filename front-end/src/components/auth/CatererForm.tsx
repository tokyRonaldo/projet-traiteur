'use client';

import { useState } from 'react';
import { useRegisterCaterer } from '@/hooks/useRegisterCaterer';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import CustomToast from '../ui/CustomToast';
import type { RegisterCatererData } from '@/types';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CatererForm() {
  const { register, isLoading, error } = useRegisterCaterer();

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
      address: formData.get('address') as string,
      description: formData.get('description') as string,
      website: formData.get('website') as string,
      contact: formData.get('contact') as string,
    };

    try {
      const result = await register(data);

      setToast({
        message: result?.message || 'Inscription réussie !',
        type: 'success',
      });
      router.push('/register/caterer_pending');
    } catch (err: any) {
      setToast({
        message: err.message || "Une erreur est survenue lors de l'inscription.",
        type: 'error',
      });
    }
  };

  return (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-xl font-bold">Créer un compte traiteur</h2>
        <p className="text-sm text-gray-500">
          Renseignez les informations de votre entreprise pour proposer vos services sur la plateforme.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nom de l'entreprise */}
        <Input
          label="Nom de l'entreprise"
          id="name"
          name="name"
          placeholder="Ex : Traiteur Heirloom Harvest"
          type="text"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Email */}
          <Input
            label="Email professionnel"
            id="email"
            name="email"
            placeholder="contact@votretraiteur.com"
            type="email"
            required
          />

          {/* Contact */}
          <Input
            label="Contact"
            id="contact"
            name="contact"
            placeholder="034......."
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
          label="Adresse professionnelle"
          id="address"
          name="address"
          placeholder="123 Rue Culinaire, Bureau 100"
          type="text"
          required
        />

        {/* Ville / Location */}
        <Input
          label="Ville / Localisation"
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
          label="Site web (optionnel)"
          id="website"
          name="website"
          placeholder="https://www.votretraiteur.com"
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
            {isLoading ? 'Inscription en cours...' : 'Créer mon compte traiteur'}
          </Button>
        </div>

        <p className="text-center text-xs text-slate-400 mt-4">
          En continuant, vous acceptez les{' '}
          <a href="#" className="underline hover:text-primary">
            Conditions d&apos;utilisation pour traiteurs
          </a>
          .
        </p>

        <div className="text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Se connecter
          </Link>
        </div>

        <div className="text-center text-sm text-gray-600">
          Vous êtes un client ?{' '}
          <Link href="/register" className="text-indigo-600 font-medium hover:underline">
            Inscrivez-vous en tant que client
          </Link>
        </div>
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