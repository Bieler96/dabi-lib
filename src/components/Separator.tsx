import clsx from "clsx";
import type { HTMLAttributes } from "react";

export type Orientation = "horizontal" | "vertical";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
	orientation?: Orientation;
}

export function Separator({
	orientation = "horizontal",
	className,
	...props
}: SeparatorProps) {
	return (
		<div
			role="separator"
			className={clsx(
				"shrink-0 bg-outline",
				orientation === "horizontal"
					? "h-px w-full"
					: "w-px h-full",
				className
			)}
			{...props}
		/>
	);
}
