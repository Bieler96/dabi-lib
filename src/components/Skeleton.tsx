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
	const randomDelay = Math.floor(Math.random() * delay);

	return (
		<div
			className={clsx(`bg-primary animate-pulse rounded-lg`, className)}
			style={{ animationDelay: `${randomDelay}ms` }}
			{...props}
		></div>
	);
}