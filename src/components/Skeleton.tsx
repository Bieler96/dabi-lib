import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	delay?: number;
}

export function Skeleton({
	delay = 0,
	className,
	...props
}: SkeletonProps) {
	const animationDelay = delay > 0 ? `${delay}ms` : undefined;

	return (
		<div
			className={clsx("animate-pulse rounded-[var(--radius-component)] bg-primary/15", className)}
			style={animationDelay ? { animationDelay } : undefined}
			{...props}
		></div>
	);
}
