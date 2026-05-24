import { cn } from "../../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";
import { Section, Container, SectionHeader } from "./Primitives";

export interface Logo {
	name: string;
	logo?: ReactNode;
}

export interface LogoCloudProps {
	eyebrow?: string;
	title?: string;
	subtitle?: string;
	logos: Logo[];
	columns?: 3 | 4 | 5 | 6;
	displayName?: boolean;
}

export function LogoCloud({
	eyebrow,
	title,
	subtitle,
	logos,
	columns = 5,
	displayName = true,
}: LogoCloudProps) {
	return (
		<LogoCloudRoot>
			<Container>
				<LogoCloudHeader
					eyebrow={eyebrow}
					title={title}
					subtitle={subtitle}
				/>
				<LogoCloudGrid columns={columns}>
					{logos.map((l, i) => (
						<LogoCloudItem
							key={i}
							name={l.name}
							logo={l.logo}
							displayName={displayName}
						/>
					))}
				</LogoCloudGrid>
			</Container>
		</LogoCloudRoot>
	);
}

export function LogoCloudRoot({
	className,
	children,
	...props
}: HTMLAttributes<HTMLElement>) {
	return (
		<Section className={cn("py-20", className)} {...props}>
			{children}
		</Section>
	);
}

export function LogoCloudHeader({
	eyebrow,
	title,
	subtitle,
}: {
	eyebrow?: ReactNode;
	title?: ReactNode;
	subtitle?: ReactNode;
}) {
	if (!title) return null;
	return (
		<SectionHeader
			eyebrow={eyebrow}
			title={title}
			subtitle={subtitle}
			className="mb-12"
		/>
	);
}

export function LogoCloudGrid({
	columns = 5,
	children,
}: {
	columns?: 3 | 4 | 5 | 6;
	children: ReactNode;
}) {
	const colClass = {
		3: "grid-cols-2 sm:grid-cols-3",
		4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
		5: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
		6: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
	}[columns];
	return (
		<div className={cn("grid items-center gap-x-8 gap-y-10", colClass)}>
			{children}
		</div>
	);
}

export function LogoCloudItem({
	name,
	displayName,
	logo,
	className,
}: {
	name: string;
	displayName?: boolean;
	logo?: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"flex items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0",
				className,
			)}
		>
			{logo ? (
				<div className="flex flex-col items-center gap-4 p-4">
					<span className="block max-h-8 max-w-35" aria-label={name}>
						{logo}
					</span>
					{displayName ? (
						<span className="text-lg font-bold tracking-tight text-foreground">
							{name}
						</span>
					) : null}
				</div>
			) : (
				<span className="text-lg font-bold tracking-tight text-foreground p-4">
					{name}
				</span>
			)}
		</div>
	);
}
