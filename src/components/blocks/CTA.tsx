import type { ReactNode } from "react";
import { Container, Section } from "./Primitives";
import { Button } from "../Button";

export interface CTAProps {
	title: string;
	subtitle?: string;
	primaryCta: { label: string; to: string };
	secondaryCta?: { label: string; to: string };
}

export function CTA({ title, subtitle, primaryCta, secondaryCta }: CTAProps) {
	return (
		<Section>
			<Container>
				<CTAPanel>
					<CTATitle>{title}</CTATitle>
					{subtitle && <CTASubtitle>{subtitle}</CTASubtitle>}
					<CTAActions>
						<Button size="lg" variant="secondary">
							{primaryCta.label}
						</Button>
						{secondaryCta && (
							<Button
								size="lg"
								variant="outline"
								className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
							>
								{secondaryCta.label}
							</Button>
						)}
					</CTAActions>
				</CTAPanel>
			</Container>
		</Section>
	);
}

export function CTAPanel({ children }: { children: ReactNode }) {
	return (
		<div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center md:px-16 md:py-24">
			{children}
		</div>
	);
}

export function CTATitle({ children }: { children: ReactNode }) {
	return (
		<h2 className="mx-auto max-w-2xl text-balance text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl">
			{children}
		</h2>
	);
}

export function CTASubtitle({ children }: { children: ReactNode }) {
	return (
		<p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/80">
			{children}
		</p>
	);
}

export function CTAActions({ children }: { children: ReactNode }) {
	return (
		<div className="mt-8 flex flex-wrap justify-center gap-3">
			{children}
		</div>
	);
}
