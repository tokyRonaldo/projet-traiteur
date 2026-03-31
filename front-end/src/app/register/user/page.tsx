import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterUserPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="flex justify-between mb-10">
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold">1</div>
            <p className="text-sm mt-2 font-medium">Informations</p>
          </div>
          <div className="text-center opacity-40">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-neutral-text/30 flex items-center justify-center">2</div>
            <p className="text-sm mt-2">Entreprise</p>
          </div>
          <div className="text-center opacity-40">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-neutral-text/30 flex items-center justify-center">3</div>
            <p className="text-sm mt-2">Documents</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Créer votre compte</h1>
          <p className="text-neutral-text/70 mb-10">Commençons par vos informations personnelles</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom</label>
              <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Nom</label>
              <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Email professionnel</label>
            <input type="email" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Téléphone</label>
            <input type="tel" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium mb-2">Mot de passe</label>
            <input type="password" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
          </div>

          <div className="flex gap-4 mt-10">
            <Link href="/" className="flex-1">
              <Button variant="outline" className="w-full">Annuler</Button>
            </Link>
            <Link href="/register/company" className="flex-1">
              <Button variant="primary" className="w-full">Suivant</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}