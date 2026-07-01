'use client';

import React from 'react';
import { Button } from '@/components/ui/Button'; 
import { useAuth } from '@/context/AuthContext';
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
  const {logout, loading} = useAuth()

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
      disabled={loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <LogOut className="h-4 w-4" />
      )}
      
      {/* Si on passe du texte en enfant, on l'affiche, sinon texte par défaut */}
      {children || (loading ? "Déconnexion..." : "Se déconnecter")}
    </Button>
  );
}