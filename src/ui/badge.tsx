import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from '@/utils/cn';

const badgeVariants = cva(
  "inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium transition-all duration-200",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-primary text-text-white shadow-md",
        secondary:
          "bg-background-surface-secondary text-text-secondary border border-border",
        destructive:
          "bg-error/10 text-error border border-error/20",
        outline: "border border-border text-text-secondary hover:bg-interactive-hover",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
