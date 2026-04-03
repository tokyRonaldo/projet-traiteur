'use client';
import { useState } from 'react';
import { useRegisterUser } from '@/hooks/useRegisterUser';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import CustomToast from '../ui/CustomToast';
import type { RegisterData } from '@/types';

export default function UserRegisterForm() {
  const { register, isLoading, error } = useRegisterUser();

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToast(null);

    const formData = new FormData(e.currentTarget);

    const data: RegisterData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validation confirmation mot de passe
    const confirmPassword = formData.get('confirmPassword') as string;
    if (data.password !== confirmPassword) {
      setToast({
        message: "Les mots de passe ne correspondent pas.",
        type: 'error',
      });
      return;
    }

    try {
      const result = await register(data);

      setToast({
        message: result?.message || 'Inscription réussie !',
        type: 'success',
      });

      // Redirection après succès
      setTimeout(() => {
        window.location.href = '/';
      }, 1800);
    } catch (err: any) {
      setToast({
        message: err.message || 'Une erreur est survenue.',
        type: 'error',
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Nom complet"
          id="name"
          name="name"
          placeholder="John Doe"
          type="text"
          required
        />
        <Input
          label="Email"
          id="email"
          name="email"
          placeholder="exemple@email.com"
          type="email"
          required
        />
        <Input
          label="Mot de passe"
          id="password"
          name="password"
          placeholder="••••••••"
          type="password"
          required
        />
        <Input
          label="Confirmer le mot de passe"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="••••••••"
          type="password"
          required
        />

        {(error || (toast?.type === 'error' && toast.message)) && (
          <p className="text-red-600 text-sm text-center font-medium">
            {error || toast?.message}
          </p>
        )}

        <Button type="submit" className="w-full text-lg" disabled={isLoading}>
          {isLoading ? 'Inscription en cours...' : "Créer mon compte"}
        </Button>
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