import React from "react";
import clsx from "clsx";

export interface ItemProps {
	label: string;
	description?: string;
	leadingContent?: React.ReactNode;
	trailingContent?: React.ReactNode;
	clickable?: boolean;
	disabled?: boolean;
	onClick?: () => void;
	variant?: "first" | "last" | "none" | "rounded";
}

export function Item({
	label,
	description,
	leadingContent,
	trailingContent,
	clickable = false,
	disabled = false,
	onClick,
	variant = "rounded",
}: ItemProps) {
	const classes = clsx(
		`flex items-center gap-[var(--space-4)] min-h-12 md:min-h-10 py-[var(--space-2)] px-[var(--space-6)] w-full`,
		"transition-all duration-150 bg-surface-variant",
		{
			"rounded-t-[var(--radius-component)]": variant === "first",
			"rounded-b-[var(--radius-component)]": variant === "last",
			"rounded-none": variant === "none",
			"rounded-[var(--radius-component)]": variant === "rounded",
			"cursor-pointer active:bg-primary-container sm:hover:bg-primary-container": clickable && !disabled,
			"hover:rounded-[var(--radius-component)]": clickable && !disabled && (variant === "none" || variant === "first" || variant === "last"),
			"hover:mb-[var(--space-1)]": clickable && !disabled && (variant === "first"),
			"hover:my-[var(--space-1)]": clickable && !disabled && (variant === "none"),
			"hover:mt-[var(--space-1)]": clickable && !disabled && (variant === "last"),
			"opacity-50 cursor-not-allowed": disabled
		}
	);

	return (
		<div
			className={classes}
			onClick={!disabled && clickable ? onClick : undefined}
		>
			{leadingContent && (
				<span className="text-primary">{leadingContent}</span>
			)}
			<div className="flex-1">
				<p className="text-on-surface">{label}</p>
				{description && (
					<p className="text-xs text-on-surface-variant">{description}</p>
				)}
			</div>
			{trailingContent && (
				<span className="text-xl text-primary">{trailingContent}</span>
			)}
		</div>
	);
}
