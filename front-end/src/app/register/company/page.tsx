import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterCompanyPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between mb-10">
          <div className="text-center opacity-40">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-neutral-text/30 flex items-center justify-center">1</div>
          </div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold">2</div>
            <p className="text-sm mt-2 font-medium">Entreprise</p>
          </div>
          <div className="text-center opacity-40">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-neutral-text/30 flex items-center justify-center">3</div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Informations de l'entreprise</h1>
          <p className="text-neutral-text/70 mb-10">Dites-nous en plus sur votre société</p>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de l'entreprise</label>
              <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Type d'entreprise</label>
                <select className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary">
                  <option>Traiteur indépendant</option>
                  <option>Société de restauration</option>
                  <option>Chef à domicile</option>
                  <option>Entreprise événementielle</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nombre d'employés</label>
                <input type="number" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Ville</label>
                <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Code postal</label>
                <input type="text" className="w-full px-4 py-3 rounded-2xl border border-neutral-text/20 focus:border-primary" />
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-10">
            <Link href="/register/user" className="flex-1">
              <Button variant="outline" className="w-full">Précédent</Button>
            </Link>
            <Link href="/register/documents" className="flex-1">
              <Button variant="primary" className="w-full">Suivant</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}