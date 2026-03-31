import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-neutral-text">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-4 py-3 rounded-2xl 
            border border-neutral-text/20 
            bg-background-light dark:bg-slate-800
            focus:border-primary focus:ring-0 
            placeholder:text-neutral-text/50
            ${error ? 'border-red-500 focus:border-red-500' : ''}
            ${className}
          `.trim()}
          {...props}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";