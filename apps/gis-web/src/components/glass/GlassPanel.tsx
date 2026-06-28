import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '@/lib/utils'

/**
 * The frosted-glass surface. Every floating panel composes this — the blur,
 * translucency, border and shadow live here and nowhere else.
 */
const glassVariants = cva(
  'bg-glass text-glass-foreground border border-glass-border backdrop-blur-xl shadow-glass',
  {
    variants: {
      radius: {
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
      },
    },
    defaultVariants: {
      radius: 'xl',
    },
  },
)

type GlassPanelProps = ComponentProps<'div'> &
  VariantProps<typeof glassVariants>

export function GlassPanel({ className, radius, ...props }: GlassPanelProps) {
  return <div className={cn(glassVariants({ radius }), className)} {...props} />
}

export { glassVariants }
