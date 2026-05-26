import { Button } from "../Button";
import { ArrowRight } from "lucide-react";
import { cn } from "../../utils/cn";
import type { HTMLAttributes, ReactNode } from "react";
import { Section, Container } from "./Primitives";

export type HeroLayoutVariant = "split" | "centered" | "stacked";

export type HeroVariant = "split" | "centered" | "apple" | "saas";

export interface HeroProps {
	variant?: HeroVariant;
	tone?: "default" | "muted" | "gradient" | "dark";
	eyebrow?: string;
	title: string;
	subtitle?: string;
	primaryCta?: { label: string; to: string };
	secondaryCta?: { label: string; to: string };
	image?: string;
	belowMedia?: ReactNode;
}

export function Hero({
	variant = "split",
	tone = "default",
	eyebrow,
	title,
	subtitle,
	primaryCta,
	secondaryCta,
	image,
	belowMedia,
}: HeroProps) {
	// Apple style — large centered type, minimal eyebrow, oversized headline
	if (variant === "apple") {
		return (
			<HeroRoot tone={tone}>
				<HeroLayout variant="centered">
					{eyebrow && (
						<HeroEyebrow variant="minimal">{eyebrow}</HeroEyebrow>
					)}
					<HeroTitle
						size="xl"
						className="font-semibold tracking-[-0.04em]"
					>
						{title}
					</HeroTitle>
					{subtitle && (
						<HeroSubtitle className="text-center text-xl md:text-2xl">
							{subtitle}
						</HeroSubtitle>
					)}
					{(primaryCta || secondaryCta) && (
						<HeroActions align="center">
							{primaryCta && (
								<Button size="lg" className="rounded-full px-6">
									{/* <Link to={primaryCta.to}> */}
									{primaryCta.label}
									{/* </Link> */}
								</Button>
							)}
							{secondaryCta && (
								<Button
									size="lg"
									variant="ghost"
									className="rounded-full px-6"
								>
									{/* <Link to={secondaryCta.to}> */}
									{secondaryCta.label}
									<ArrowRight className="ml-1 h-4 w-4" />
									{/* </Link> */}
								</Button>
							)}
						</HeroActions>
					)}
					{(image || belowMedia) && (
						<div className="mt-12 w-full">
							{belowMedia ?? (
								<HeroMedia aspect="wide">
									<img
										src={image}
										alt=""
										className="h-full w-full object-cover"
									/>
								</HeroMedia>
							)}
						</div>
					)}
				</HeroLayout>
			</HeroRoot>
		);
	}
	// SaaS — centered copy + framed product screenshot below
	if (variant === "saas") {
		return (
			<HeroRoot tone={tone === "default" ? "gradient" : tone}>
				<HeroLayout variant="stacked">
					<HeroContent align="center">
						{eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
						<HeroTitle size="lg">{title}</HeroTitle>
						{subtitle && (
							<HeroSubtitle className="mx-auto text-center">
								{subtitle}
							</HeroSubtitle>
						)}
						{(primaryCta || secondaryCta) && (
							<HeroActions align="center">
								{primaryCta && (
									<Button size="lg">
										{/* <Link to={primaryCta.to}> */}
										{primaryCta.label}
										<ArrowRight className="ml-1 h-4 w-4" />
										{/* </Link> */}
									</Button>
								)}
								{secondaryCta && (
									<Button size="lg" variant="outline">
										{/* <Link to={secondaryCta.to}> */}
										{secondaryCta.label}
										{/* </Link> */}
									</Button>
								)}
							</HeroActions>
						)}
					</HeroContent>
					{(image || belowMedia) && (
						<div className="mx-auto w-full max-w-5xl">
							{belowMedia ?? (
								<HeroMedia aspect="wide">
									<img
										src={image}
										alt=""
										className="h-full w-full object-cover"
									/>
								</HeroMedia>
							)}
						</div>
					)}
				</HeroLayout>
			</HeroRoot>
		);
	}
	// Centered — text-only centered hero
	if (variant === "centered") {
		return (
			<HeroRoot tone={tone}>
				<HeroLayout variant="centered">
					{eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
					<HeroTitle>{title}</HeroTitle>
					{subtitle && (
						<HeroSubtitle className="mx-auto text-center">
							{subtitle}
						</HeroSubtitle>
					)}
					{(primaryCta || secondaryCta) && (
						<HeroActions align="center">
							{primaryCta && (
								<Button size="lg">
									{/* <Link to={primaryCta.to}> */}
									{primaryCta.label}
									<ArrowRight className="ml-1 h-4 w-4" />
									{/* </Link> */}
								</Button>
							)}
							{secondaryCta && (
								<Button size="lg" variant="outline">
									{/* <Link to={secondaryCta.to}> */}
									{secondaryCta.label}
									{/* </Link> */}
								</Button>
							)}
						</HeroActions>
					)}
				</HeroLayout>
			</HeroRoot>
		);
	}
	return (
		<HeroRoot tone={tone}>
			<HeroLayout variant="split">
				<HeroContent>
					{eyebrow && <HeroEyebrow>{eyebrow}</HeroEyebrow>}
					<HeroTitle>{title}</HeroTitle>
					{subtitle && <HeroSubtitle>{subtitle}</HeroSubtitle>}
					{(primaryCta || secondaryCta) && (
						<HeroActions>
							{primaryCta && (
								<Button size="lg">
									{/* <Link to={primaryCta.to}> */}
									{primaryCta.label}
									<ArrowRight className="ml-1 h-4 w-4" />
									{/* </Link> */}
								</Button>
							)}
							{secondaryCta && (
								<Button size="lg" variant="outline">
									{/* <Link to={secondaryCta.to}> */}
									{secondaryCta.label}
									{/* </Link> */}
								</Button>
							)}
						</HeroActions>
					)}
				</HeroContent>
				{image && (
					<HeroMedia>
						<img
							src={image}
							alt=""
							className="h-full w-full object-cover"
						/>
					</HeroMedia>
				)}
			</HeroLayout>
		</HeroRoot>
	);
}

export function HeroRoot({
	className,
	children,
	tone = "default",
	...props
}: HTMLAttributes<HTMLElement> & {
	tone?: "default" | "muted" | "gradient" | "dark";
}) {
	const tones: Record<string, string> = {
		default: "",
		muted: "bg-muted/40",
		gradient:
			"bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent)]",
		dark: "bg-foreground text-background",
	};
	return (
		<Section
			className={cn("overflow-hidden border-b-0", tones[tone], className)}
			{...props}
		>
			{children}
		</Section>
	);
}

export function HeroLayout({
	children,
	variant = "split",
	className,
}: {
	children: ReactNode;
	variant?: HeroLayoutVariant;
	className?: string;
}) {
	const layouts: Record<HeroLayoutVariant, string> = {
		split: "grid gap-12 py-24 md:py-32 lg:grid-cols-2 lg:items-center",
		centered:
			"flex flex-col items-center text-center gap-8 py-28 md:py-40 max-w-4xl mx-auto",
		stacked: "flex flex-col gap-16 py-24 md:py-32",
	};
	return (
		<Container className={cn(layouts[variant], className)}>
			{children}
		</Container>
	);
}
export function HeroContent({
	children,
	align = "left",
}: {
	children: ReactNode;
	align?: "left" | "center";
}) {
	return (
		<div
			className={cn(
				"flex flex-col gap-6",
				align === "center" && "items-center text-center",
			)}
		>
			{children}
		</div>
	);
}

export function HeroEyebrow({
	children,
	variant = "pill",
}: {
	children: ReactNode;
	variant?: "pill" | "minimal";
}) {
	if (variant === "minimal") {
		return (
			<span className="text-sm font-medium uppercase tracking-[0.18em] text-primary">
				{children}
			</span>
		);
	}
	return (
		<span className="inline-flex w-fit items-center rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-medium uppercase tracking-wider text-muted-foreground backdrop-blur">
			{children}
		</span>
	);
}

export function HeroTitle({
	children,
	size = "lg",
	className,
}: {
	children: ReactNode;
	size?: "md" | "lg" | "xl";
	className?: string;
}) {
	const sizes = {
		md: "text-4xl md:text-5xl lg:text-6xl",
		lg: "text-5xl md:text-6xl lg:text-7xl",
		xl: "text-6xl md:text-7xl lg:text-8xl",
	};
	return (
		<h1
			className={cn(
				"text-balance font-bold leading-[1.05] tracking-tight text-foreground",
				sizes[size],
				className,
			)}
		>
			{children}
		</h1>
	);
}

export function HeroSubtitle({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<p
			className={cn(
				"max-w-xl text-lg leading-relaxed text-muted-foreground md:text-xl",
				className,
			)}
		>
			{children}
		</p>
	);
}

export function HeroActions({
	children,
	align = "left",
}: {
	children: ReactNode;
	align?: "left" | "center";
}) {
	return (
		<div
			className={cn(
				"mt-2 flex flex-wrap gap-3",
				align === "center" && "justify-center",
			)}
		>
			{children}
		</div>
	);
}

export function HeroMedia({
	children,
	aspect = "video",
	className,
}: {
	children: ReactNode;
	aspect?: "video" | "square" | "portrait" | "wide";
	className?: string;
}) {
	const aspects = {
		video: "aspect-[4/3]",
		square: "aspect-square",
		portrait: "aspect-[3/4]",
		wide: "aspect-[16/9]",
	};
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-2xl border border-border bg-muted shadow-2xl",
				aspects[aspect],
				className,
			)}
		>
			{children}
		</div>
	);
}
