import React from 'react';
import { cn } from '@/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  className,
  children,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-gradient-primary text-text-white shadow-lg hover:shadow-xl hover:scale-[1.02] focus:ring-primary/20 focus:ring-2',
    secondary: 'bg-background-surface text-text-primary border border-border shadow-md hover:shadow-lg hover:bg-interactive-hover focus:ring-border focus:ring-2',
    outline: 'bg-transparent text-text-secondary border border-border hover:bg-interactive-hover hover:border-border-dark focus:ring-border focus:ring-2',
    ghost: 'text-text-secondary hover:bg-interactive-hover focus:ring-border focus:ring-2',
  };

  const sizes = {
    sm: 'h-8 px-3 text-sm rounded-lg',
    md: 'h-10 px-4 text-sm rounded-xl',
    lg: 'h-12 px-6 text-base rounded-xl',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};