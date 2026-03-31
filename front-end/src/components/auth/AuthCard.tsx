import React from 'react';

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export function AuthCard({
  children,
  className = "",
  size = 'md',
  fullWidth = false,
}: AuthCardProps) {
  
  const sizeClasses = {
    sm: 'max-w-sm',     // ~384px → pour formulaires très simples
    md: 'max-w-md',     // ~448px → taille actuelle de ton Login
    lg: 'max-w-lg',     // ~512px
    xl: 'max-w-2xl',    // ~672px → parfait pour le Register avec grid et 3 étapes
  };

  return (
    <div
      className={`
        w-full 
        bg-white dark:bg-slate-900 
        rounded-3xl 
        shadow-xl 
        p-8 md:p-10
        ${sizeClasses[size]}
        ${fullWidth ? 'max-w-none' : ''}
        ${className}
      `.trim()}
    >
      {children}
    </div>
  );
}