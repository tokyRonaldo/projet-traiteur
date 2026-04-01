"use client"

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import Link from 'next/link';

export default function LoginPage() {
  async function connectGoogle(){
     window.location.href = 'http://localhost:8000/api/auth/google/redirect';
  }
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <AuthCard>
        <AuthHeader
          icon={
            <span className="material-symbols-outlined text-4xl">restaurant</span>
            // Ou avec lucide-react : <Restaurant size={32} />
          }
          title="Caterly"
          subtitle="Bienvenue"
        />

        <p className="text-center text-neutral-text/70 mb-8">
          Connectez-vous à votre compte
        </p>

        <form className="space-y-6">
          <Input
            label="Email"
            type="email"
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Mot de passe"
            type="password"
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-primary w-4 h-4"
              />
              Se souvenir de moi
            </label>

            <Link
              href="/forgot-password"
              className="text-primary hover:underline font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          <Button variant="primary" size="lg" className="w-full">
            Se connecter
          </Button>
        </form>

        <p className="text-center mt-8 text-sm text-neutral-text/60">
          Vous n'avez pas de compte ?{' '}
          <Link
            href="/register"
            className="text-primary font-semibold hover:underline"
          >
            Créer un compte
          </Link>
         {/*<Button onClick={connectGoogle} variant="primary" size="lg" className="w-full">
            Google
          </Button>*/}
        </p>
      </AuthCard>
    </div>
  );
}