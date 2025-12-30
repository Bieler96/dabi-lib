import clsx from "clsx";

export type Orientation = "horizontal" | "vertical";

export interface SeparatorProps {
	orientation?: Orientation;
	className?: string;
}

export function Separator({
	orientation = "horizontal",
	className,
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
		/>
	);
}