import React from 'react';
import clsx from "clsx";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'elevated' | 'filled' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>((
    { variant = 'filled', children, className, ...props }, ref) => {
    const baseClasses = 'rounded-lg p-4';

    const variantClasses = {
        elevated: 'shadow shadow-md',
        filled: 'bg-surface-variant',
        outlined: 'border border-outline',
    };

    const cardClasses = clsx(baseClasses, variantClasses[variant], className);

    return <div ref={ref} className={cardClasses} {...props}>{children}</div>;
});