'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; 
import { useLogout } from '@/hooks/useLogout';
import { LogOut, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
  children?: React.ReactNode;
}

export function LogoutButton({ 
  variant = "ghost", 
  className, 
  children 
}: LogoutButtonProps) {
  const { logout, isLoading } = useLogout();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Erreur lors de la déconnexion", err);
    }
  };

  return (
    <Button
      className={cn("gap-2", className)}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      
      {/* Si on passe du texte en enfant, on l'affiche, sinon texte par défaut */}
      {children || (isLoading ? "Déconnexion..." : "Se déconnecter")}
    </Button>
  );
}