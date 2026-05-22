"use client";

import type * as React from "react";
import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon } from "lucide-react";
import { cn } from "../utils/cn";

type CheckboxProps = CheckboxPrimitive.Root.Props & {
	label?: React.ReactNode;
	onChange?: (checked: boolean) => void;
};

function Checkbox({
	className,
	label,
	onChange,
	onCheckedChange,
	...props
}: CheckboxProps) {
	const checkbox = (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground dark:data-checked:bg-primary",
				!label && className,
			)}
			onCheckedChange={(checked, event) => {
				onCheckedChange?.(checked, event);
				onChange?.(checked === true);
			}}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="grid place-content-center text-current transition-none [&>svg]:size-3.5"
			>
				<CheckIcon />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	);

	if (!label) {
		return checkbox;
	}

	return (
		<label
			data-slot="checkbox-label"
			className={cn(
				"inline-flex min-w-0 max-w-full items-start gap-2 text-sm font-medium leading-snug text-wrap break-words",
				props.disabled && "pointer-events-none opacity-50",
				className,
			)}
		>
			{checkbox}
			<span className="min-w-0 flex-1">{label}</span>
		</label>
	);
}

export { Checkbox, type CheckboxProps };
