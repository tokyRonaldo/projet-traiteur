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
  className="w-full flex items-center justify-center gap-3"
>
  <svg
    width="22"
    height="22"
    viewBox="0 0 51 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g clipPath="url(#clip0_220_158)">
      <path
        d="M15.9229 28.5156C18.8525 36.5234 27.4463 37.793 32.6221 34.375H38.6768V39.0625C36.52 40.9072 33.9726 42.2382 31.2266 42.9552C28.4806 43.6722 25.6077 43.7565 22.8244 43.2017C20.0411 42.6469 17.42 41.4676 15.1588 39.7525C12.8976 38.0374 11.0552 35.8314 9.77051 33.3008"
        fill="#34A853"
      />
      <path
        d="M38.6768 39.0625C40.8006 37.0878 42.4202 34.3849 43.339 31.2819C44.2577 28.1789 44.4361 24.8093 43.8525 21.582H26.3721V28.8086H36.333C35.8773 31.2174 34.6403 33.0729 32.6221 34.375"
        fill="#4285F4"
      />
      <path
        d="M9.77049 33.3008C8.48668 30.6904 7.8208 27.8387 7.8208 24.9512C7.8208 22.0636 8.48668 19.212 9.77049 16.6016L15.9228 21.3867C15.1416 23.7956 15.1416 26.1719 15.9228 28.5156"
        fill="#FBBC02"
      />
      <path
        d="M15.9229 21.3868C18.0713 14.6486 27.251 10.7423 33.4033 16.504L38.7744 11.2306C31.1572 3.90637 16.3135 4.19934 9.77051 16.6017"
        fill="#EA4335"
      />
    </g>

    <defs>
      <clipPath id="clip0_220_158">
        <rect
          x="0.981445"
          width="50"
          height="50"
          rx="5"
          fill="white"
        />
      </clipPath>
    </defs>
  </svg>

  <span>Continuer avec Google</span>
</Button>
        </form>

        <p className="text-center mt-8 text-sm text-neutral-text/60">
          Vous n'avez pas de compte ?{' '}
          <Link href="/register/user" className="text-primary font-semibold hover:underline">
            Créer un compte
          </Link>
        </p>

      </AuthCard>
    </div>
  );
}