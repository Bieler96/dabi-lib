import { type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import * as React from "react";
import { buttonVariants } from "./buttonVariants";

export interface ButtonProps
	extends
		React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ variant, size, children, className, type = "button", ...props },
		ref,
	) => {
		return (
			<button
				ref={ref}
				type={type}
				{...props}
				className={clsx(buttonVariants({ variant, size }), className)}
			>
				{children}
			</button>
		);
	},
);

Button.displayName = "Button";

Button.displayName = "Button";
