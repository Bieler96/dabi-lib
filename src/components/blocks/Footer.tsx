import type { ReactNode } from "react";
import { Container } from "./Primitives";
import { Button, buttonVariants } from "../Button";

export interface FooterLink {
	label: string;
	to: string;
}

export interface FooterColumn {
	title: string;
	links: FooterLink[];
}

export interface FooterProps {
	brand: string;
	tagline?: string;
	columns?: FooterColumn[];
	copyright?: string;
}

export function Footer({
	brand,
	tagline,
	columns = [],
	copyright,
}: FooterProps) {
	return (
		<FooterRoot>
			<div className="grid gap-12 lg:grid-cols-[2fr_3fr]">
				<FooterBrand brand={brand} tagline={tagline} />
				{columns.length > 0 && (
					<FooterColumns>
						{columns.map((col, i) => (
							<FooterColumnBlock key={i} title={col.title}>
								{col.links.map((link, j) => (
									<FooterLinkItem key={j} to={link.to}>
										{link.label}
									</FooterLinkItem>
								))}
							</FooterColumnBlock>
						))}
					</FooterColumns>
				)}
			</div>
			<FooterBottom>
				{copyright ??
					`© ${new Date().getFullYear()} ${brand}. All rights reserved.`}
			</FooterBottom>
		</FooterRoot>
	);
}

export function FooterRoot({ children }: { children: ReactNode }) {
	return (
		<footer className="bg-background py-16">
			<Container>{children}</Container>
		</footer>
	);
}

export function FooterBrand({
	brand,
	tagline,
}: {
	brand: ReactNode;
	tagline?: ReactNode;
}) {
	return (
		<div>
			<div className="text-xl font-bold tracking-tight text-foreground">
				{brand}
			</div>
			{tagline && (
				<p className="mt-2 max-w-sm text-sm text-muted-foreground">
					{tagline}
				</p>
			)}
		</div>
	);
}

export function FooterColumns({ children }: { children: ReactNode }) {
	return (
		<div className="grid grid-cols-2 gap-8 sm:grid-cols-3">{children}</div>
	);
}

export function FooterColumnBlock({
	title,
	children,
}: {
	title: ReactNode;
	children: ReactNode;
}) {
	return (
		<div>
			<h4 className="text-sm font-semibold text-foreground">{title}</h4>
			<ul className="mt-4 space-y-2">{children}</ul>
		</div>
	);
}

export function FooterLinkItem({
	to,
	children,
}: {
	to: string;
	children: ReactNode;
}) {
	return (
		<li>
			<a
				href={to}
				className={buttonVariants({ variant: "link", size: "sm" })}
			>
				<div className="text-sm text-muted-foreground transition-colors hover:text-foreground">
					{children}
				</div>
			</a>
		</li>
	);
}

export function FooterBottom({ children }: { children: ReactNode }) {
	return (
		<div className="mt-12 border-t border-border pt-6 text-xs text-muted-foreground">
			{children}
		</div>
	);
}
