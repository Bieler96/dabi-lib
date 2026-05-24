import { cn } from "../../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";

export function Section({
	className,
	children,
	...props
}: HTMLAttributes<HTMLElement>) {
	return (
		<section
			className={cn(
				"border-b border-border bg-background py-24",
				className,
			)}
			{...props}
		>
			{children}
		</section>
	);
}

export function Container({
	className,
	children,
	...props
}: HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={cn("container mx-auto px-6", className)} {...props}>
			{children}
		</div>
	);
}

export function Eyebrow({ children }: { children: ReactNode }) {
	return (
		<span className="text-xs font-semibold uppercase tracking-wider text-primary">
			{children}
		</span>
	);
}

export function SectionHeader({
	eyebrow,
	title,
	subtitle,
	align = "center",
	className,
}: {
	eyebrow?: ReactNode;
	title: ReactNode;
	subtitle?: ReactNode;
	align?: "center" | "left";
	className?: string;
}) {
	return (
		<div
			className={cn(
				"mb-16 max-w-2xl",
				align === "center" ? "mx-auto text-center" : "text-left",
				className,
			)}
		>
			{eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
			<h2 className="mt-2 text-balance text-4xl font-bold tracking-tight text-foreground md:text-5xl">
				{title}
			</h2>
			{subtitle && (
				<p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
			)}
		</div>
	);
}
