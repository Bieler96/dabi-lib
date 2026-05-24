import { cn } from "../../utils/cn";
import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Section, Container, SectionHeader } from "./Primitives";

export interface Feature {
	icon?: LucideIcon;
	title: string;
	description: string;
}

export interface FeaturesProps {
	eyebrow?: string;
	title: string;
	subtitle?: string;
	features: Feature[];
	columns?: 2 | 3 | 4;
}

export function Features({
	eyebrow,
	title,
	subtitle,
	features,
	columns = 3,
}: FeaturesProps) {
	return (
		<Section>
			<Container>
				<SectionHeader
					eyebrow={eyebrow}
					title={title}
					subtitle={subtitle}
				/>
				<FeatureGrid columns={columns}>
					{features.map((f, i) => (
						<FeatureCard
							key={i}
							icon={f.icon}
							title={f.title}
							description={f.description}
						/>
					))}
				</FeatureGrid>
			</Container>
		</Section>
	);
}

export function FeatureGrid({
	columns = 3,
	children,
}: {
	columns?: 2 | 3 | 4;
	children: ReactNode;
}) {
	const colClass = {
		2: "md:grid-cols-2",
		3: "md:grid-cols-2 lg:grid-cols-3",
		4: "md:grid-cols-2 lg:grid-cols-4",
	}[columns];
	return <div className={cn("grid gap-6", colClass)}>{children}</div>;
}

export function FeatureCard({
	icon: Icon,
	title,
	description,
	children,
}: {
	icon?: LucideIcon;
	title: ReactNode;
	description?: ReactNode;
	children?: ReactNode;
}) {
	return (
		<div className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50">
			{Icon && (
				<div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
					<Icon className="h-5 w-5" />
				</div>
			)}
			<h3 className="text-lg font-semibold text-card-foreground">
				{title}
			</h3>
			{description && (
				<p className="mt-2 text-sm leading-relaxed text-muted-foreground">
					{description}
				</p>
			)}
			{children}
		</div>
	);
}
