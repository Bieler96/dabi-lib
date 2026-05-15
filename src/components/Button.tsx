import { type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { buttonVariants } from "./buttonVariants";

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
