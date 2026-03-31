import React from 'react';

interface AuthHeaderProps {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthHeader({ icon, title, subtitle }: AuthHeaderProps) {
  return (
    <>
      <div className="flex justify-center mb-8">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="bg-primary p-3 rounded-2xl text-white">
              {icon}
            </div>
          )}
          <h1 className="text-3xl font-bold text-primary">{title}</h1>
        </div>
      </div>

      {subtitle && (
        <h2 className="text-2xl font-bold text-center mb-2">{subtitle}</h2>
      )}
    </>
  );
}