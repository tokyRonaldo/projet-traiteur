'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import Link from 'next/link';
import { useLoginUser } from '@/hooks/useLoginUser';

export default function LoginPage() {

  const { login, isLoading, error } = useLoginUser();
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  async function connectGoogle() {
    window.location.href =
      `${API_URL}/api/auth/google/redirect`;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);

    const formData = new FormData(e.currentTarget);

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    try {
      const result = await login(data);

      setToast({
        message: result.message,
        type: 'success',
      });


    } catch (err: any) {
      setToast({
        message: err.message || 'Erreur de connexion',
        type: 'error',
      });
    }
  };

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center px-4">
      <AuthCard>
        <AuthHeader
          icon={<span className="material-symbols-outlined text-4xl">restaurant</span>}
          title="Caterly"
          subtitle="Bienvenue"
        />

        <p className="text-center text-neutral-text/70 mb-8">
          Connectez-vous à votre compte
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">

          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            required
          />

          <Input
            label="Mot de passe"
            name="password"
            type="password"
            placeholder="••••••••"
            required
          />

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-primary w-4 h-4" />
              Se souvenir de moi
            </label>

            <Link
              href="/forgot-password"
              className="text-primary hover:underline font-medium"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {(error || toast?.type === 'error') && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error || toast?.message}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>

          <Button
            onClick={connectGoogle}
            type="button"
            variant="primary"
            size="lg"
            className="w-full"
          >
            Google
          </Button>

        </form>

        <p className="text-center mt-8 text-sm text-neutral-text/60">
          Vous n'avez pas de compte ?{' '}
          <Link href="/register" className="text-primary font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>

      </AuthCard>
    </div>
  );
}