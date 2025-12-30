import clsx from "clsx";
import React, { type TextareaHTMLAttributes } from "react";

export interface TextareaProps
	extends TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string;
	variant?: "default" | "ghost";
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ label, className, variant = "default", ...props }, ref) => {
		const base =
			"w-full rounded-lg transition duration-150 disabled:opacity-50 disabled:pointer-events-none";
		const size = "p-3 text-base";

		const variants = {
			default:
				"border border-outline-variant outline-none focus-visible:ring-primary/50 focus-visible:ring-[3px]",
			ghost: "border-none outline-none focus-visible:ring-0",
		};

		return (
			<div>
				{label && (
					<label
						htmlFor={props.id}
						className="block text-sm font-medium text-on-surface"
					>
						{label}
					</label>
				)}
				<textarea
					ref={ref}
					className={clsx(base, size, variants[variant], className)}
					{...props}
				/>
			</div>
		);
	}
);