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
		`flex items-center gap-4 min-h-12 md:min-h-10 py-2 px-6 w-full`,
		"transition-all duration-150 bg-surface-variant",
		{
			"rounded-t-lg": variant === "first",
			"rounded-b-lg": variant === "last",
			"rounded-none": variant === "none",
			"rounded-lg": variant === "rounded",
			"cursor-pointer active:bg-primary-container sm:hover:bg-primary-container": clickable && !disabled,
			"hover:rounded-lg": clickable && !disabled && (variant === "none" || variant === "first" || variant === "last"),
			"hover:mb-1": clickable && !disabled && (variant === "first"),
			"hover:my-1": clickable && !disabled && (variant === "none"),
			"hover:mt-1": clickable && !disabled && (variant === "last"),
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
				<p className=" text-primary">{label}</p>
				{description && (
					<p className="text-xs text-primary/75">{description}</p>
				)}
			</div>
			{trailingContent && (
				<span className="text-xl text-primary">{trailingContent}</span>
			)}
		</div>
	);
}