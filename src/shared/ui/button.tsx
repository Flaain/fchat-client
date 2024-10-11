import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/shared/lib/utils/cn';

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
    {
        variants: {
            variant: {
                default: 'dark:focus-visible:ring-primary-dark-50 dark:ring-offset-0 dark:bg-primary-white dark:text-primary-dark-200 dark:hover:bg-white/90 bg-primary-dark-50 text-primary-white hover:bg-primary-dark-50/90',
                secondary: 'dark:focus-visible:ring-primary-white dark:ring-offset-0 dark:bg-primary-dark-50 dark:text-primary-white dark:hover:bg-primary-dark-50/50',
                destructive: 'bg-primary-destructive text-white hover:bg-primary-destructive/50',
                outline: 'border border-primary-white text-primary-white dark:border-primary-dark-50',
                ghost: 'text-primary-dark-200 hover:bg-primary-white dark:text-primary-white dark:hover:bg-primary-dark-50',
                link: 'dark:text-primary-white text-primary-dark-200 hover:underline hover:underline-offset-2',
                commerce: 'bg-primary-commerce text-primary-white hover:bg-primary-commerce/90',
                text: 'dark:text-primary-white text-primary-dark-200 hover:opacity-50 ring-offset-0 rounded-none transition-opacity ring-0 ring-transparent focus-visible:ring-0 ring-offset-0 focus-visible:opacity-50 focus focus-visible:ring-offset-0 rounded-none outline-none ring-0'
            },
            size: {
                default: 'h-10 px-4 py-2 min-w-[80px]',
                sm: 'h-9 rounded-md px-3',
                lg: 'h-10 py-2 px-8 min-w-[120px]',
                icon: 'w-auto h-auto p-0',
                text: 'p-0'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button';
        return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
    }
);
Button.displayName = 'Button';

export { Button };