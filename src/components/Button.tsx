import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";

export const buttonVariants = cva(
	"group cursor-pointer inline-flex items-center justify-center font-medium rounded-[3rem] active:rounded-[0.5rem] transition-all duration-150 disabled:opacity-50 disabled:!pointer-events-none",
	{
		variants: {
			variant: {
				filled: "bg-primary text-on-primary hover:bg-primary-dark",
				outlined: "border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
				tonal: "bg-primary/20 text-primary hover:bg-primary/30 dark:hover:bg-primary/40",
				ghost: "bg-transparent text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
				link: "text-primary underline-offset-4 hover:underline !bg-transparent !p-0 !h-auto",
			},
			size: {
				sm: "h-10 md:h-9 px-4 text-sm",
				md: "h-12 md:h-10 px-6 text-base",
				lg: "h-14 md:h-11 px-8 text-lg",
				icon: "!size-10 md:!size-9 flex items-center justify-center",
			},
		},
		defaultVariants: {
			variant: "filled",
			size: "md",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
	VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
}

export function Button({
	variant,
	size,
	children,
	className,
	...props
}: ButtonProps) {
	return (
		<div className={clsx(buttonVariants({ variant, size }), className)}>
			<button
				{...props}
				className={clsx(
					"w-full h-full cursor-pointer transition-all duration-150 flex flex-row items-center justify-center focus:outline-none"
				)}
			>
				{children}
			</button>
		</div>
	);
}