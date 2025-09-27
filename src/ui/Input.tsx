import React from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full h-10 px-3 rounded-xl border border-border bg-background-surface text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all duration-200 text-sm',
          error && 'border-error focus:ring-error/20 focus:border-error/30',
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-xs text-error font-medium">{error}</p>
      )}
    </div>
  );
};