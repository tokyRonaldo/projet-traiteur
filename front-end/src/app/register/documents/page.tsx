import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RegisterDocumentsPage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between mb-10">
          <div className="text-center opacity-40"><div className="w-10 h-10 mx-auto rounded-full border-2">1</div></div>
          <div className="text-center opacity-40"><div className="w-10 h-10 mx-auto rounded-full border-2">2</div></div>
          <div className="text-center">
            <div className="w-10 h-10 mx-auto rounded-full bg-primary text-white flex items-center justify-center font-bold">3</div>
            <p className="text-sm mt-2 font-medium">Documents</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2">Documents nécessaires</h1>
          <p className="text-neutral-text/70 mb-8">Pour valider votre profil professionnel</p>

          <div className="space-y-8">
            <div className="border-2 border-dashed border-neutral-text/30 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4">upload_file</span>
              <p className="font-medium">Kbis ou Extrait SIRET</p>
              <p className="text-sm text-neutral-text/60 mt-1">PDF, JPG ou PNG (max 5 Mo)</p>
            </div>

            <div className="border-2 border-dashed border-neutral-text/30 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4">upload_file</span>
              <p className="font-medium">Attestation d'assurance RC Pro</p>
              <p className="text-sm text-neutral-text/60 mt-1">PDF, JPG ou PNG (max 5 Mo)</p>
            </div>

            <div className="border-2 border-dashed border-neutral-text/30 rounded-2xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-5xl text-primary mb-4">upload_file</span>
              <p className="font-medium">Pièce d'identité (recto-verso)</p>
              <p className="text-sm text-neutral-text/60 mt-1">PDF, JPG ou PNG (max 5 Mo)</p>
            </div>
          </div>

          <div className="flex gap-4 mt-12">
            <Link href="/register/company" className="flex-1">
              <Button variant="outline" className="w-full">Précédent</Button>
            </Link>
            <Button variant="primary" className="flex-1">Terminer l'inscription</Button>
          </div>

          <p className="text-center text-xs text-neutral-text/50 mt-8">
            Vos documents sont protégés et utilisés uniquement pour la validation de votre compte.
          </p>
        </div>
      </div>
    </div>
  );
}