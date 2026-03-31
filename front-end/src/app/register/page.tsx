'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { Stepper } from '@/components/auth/Stepper';
import Link from 'next/link';

const steps = [
  { number: 1, title: "Informations personnelles" },
  { number: 2, title: "Votre entreprise" },
  { number: 3, title: "Documents & Photo" },
];

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4 py-12">
      <AuthCard size="5xl"> {/* ← Card plus large */}
        <AuthHeader
          icon={
            <span className="material-symbols-outlined text-4xl">restaurant</span>
          }
          title="Caterly"
          subtitle="Créer mon compte professionnel"
        />

        <Stepper steps={steps} currentStep={currentStep} />

        <form className="space-y-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Prénom" placeholder="Jean" required />
                <Input label="Nom" placeholder="Dupont" required />
              </div>

              <Input label="Email professionnel" type="email" placeholder="jean@caterly.fr" required />
              <Input label="Téléphone" type="tel" placeholder="+33 6 12 34 56 78" required />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="Mot de passe" type="password" placeholder="••••••••" required />
                <Input label="Confirmer le mot de passe" type="password" placeholder="••••••••" required />
              </div>
            </div>
          )}

          {/* ====================== ÉTAPE 2 ====================== */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <Input label="Nom de l'entreprise" placeholder="La Table de Jean" required />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="SIRET" placeholder="123 456 789 00012" required />
                <Input label="Numéro de TVA" placeholder="FR12 345678900012" />
              </div>

              <Input label="Adresse de l'entreprise" placeholder="12 rue des Lilas, 75020 Paris" required />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Input label="Code postal" placeholder="75020" required />
                <Input label="Ville" placeholder="Paris" required />
                <Input label="Pays" placeholder="France" required />
              </div>

              <Input label="Site web (optionnel)" type="url" placeholder="https://latabledejean.fr" />
            </div>
          )}

          {/* ====================== ÉTAPE 3 ====================== */}
          {currentStep === 3 && (
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium mb-3">Photo de profil / Logo</label>
                <div className="border-2 border-dashed border-neutral-text/30 rounded-3xl p-8 text-center hover:border-primary/50 transition-colors">
                  <input type="file" className="hidden" id="profile" accept="image/*" />
                  <label htmlFor="profile" className="cursor-pointer">
                    <div className="mx-auto w-20 h-20 bg-neutral-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
                      <span className="material-symbols-outlined text-4xl text-neutral-text">add_a_photo</span>
                    </div>
                    <p className="text-sm text-neutral-text">Cliquez ou glissez une photo</p>
                    <p className="text-xs text-neutral-text/60 mt-1">PNG, JPG – Max 5 Mo</p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Documents (pour vérification)</label>
                <div className="space-y-4">
                  <div className="border border-neutral-text/20 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Extrait Kbis</p>
                      <p className="text-xs text-neutral-text/60">PDF – Recommandé</p>
                    </div>
                    <label className="px-5 py-2 text-sm border border-primary text-primary rounded-xl cursor-pointer hover:bg-primary/5">
                      Choisir un fichier
                      <input type="file" className="hidden" accept=".pdf" />
                    </label>
                  </div>

                  <div className="border border-neutral-text/20 rounded-2xl p-4 flex justify-between items-center">
                    <div>
                      <p className="font-medium">Pièce d'identité du gérant</p>
                      <p className="text-xs text-neutral-text/60">PDF ou photo</p>
                    </div>
                    <label className="px-5 py-2 text-sm border border-primary text-primary rounded-xl cursor-pointer hover:bg-primary/5">
                      Choisir un fichier
                      <input type="file" className="hidden" accept="image/*,.pdf" />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Navigation des étapes */}
        <div className="flex gap-4 mt-10">
          {currentStep > 1 && (
            <Button variant="ghost" size="lg" onClick={prevStep} className="flex-1">
              Retour
            </Button>
          )}

          {currentStep < 3 ? (
            <Button variant="primary" size="lg" onClick={nextStep} className="flex-1">
              Continuer
            </Button>
          ) : (
            <Button variant="primary" size="lg" className="flex-1">
              Créer mon compte
            </Button>
          )}
        </div>

        <p className="text-center mt-8 text-sm text-neutral-text/60">
          Vous avez déjà un compte ?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </AuthCard>
    </div>
  );
}