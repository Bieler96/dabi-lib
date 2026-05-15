import clsx from "clsx";

export interface SkeletonProps {
	delay?: number;
	className?: string;
}

export function Skeleton({
	delay = 0,
	className,
	...props
}: SkeletonProps) {
	const animationDelay = delay > 0 ? `${delay}ms` : undefined;

	return (
		<div
			className={clsx(`bg-primary animate-pulse rounded-lg`, className)}
			style={animationDelay ? { animationDelay } : undefined}
			{...props}
		></div>
	);
}
