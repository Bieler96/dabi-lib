import * as React from "react";
import { cn } from "../../utils/cn";

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export interface ContainerProps extends DivProps {
	size?: "sm" | "md" | "lg" | "xl" | "full";
	gutter?: "none" | "sm" | "md" | "lg";
}

const containerSize = {
	sm: "max-w-2xl",
	md: "max-w-4xl",
	lg: "max-w-6xl",
	xl: "max-w-7xl",
	full: "max-w-none",
};

const containerGutter = {
	none: "px-0",
	sm: "px-3",
	md: "px-4 sm:px-6",
	lg: "px-6 sm:px-8 lg:px-10",
};

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
	({ className, size = "lg", gutter = "md", ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"mx-auto w-full",
				containerSize[size],
				containerGutter[gutter],
				className,
			)}
			{...props}
		/>
	),
);

Container.displayName = "Container";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
	spacing?: "sm" | "md" | "lg" | "xl";
	as?: "section" | "div" | "article" | "header" | "footer";
}

const sectionSpacing = {
	sm: "py-6",
	md: "py-10",
	lg: "py-16",
	xl: "py-24",
};

export const Section = React.forwardRef<HTMLElement, SectionProps>(
	({ className, spacing = "md", as: Tag = "section", ...props }, ref) => (
		<Tag
			ref={ref as never}
			className={cn(sectionSpacing[spacing], className)}
			{...props}
		/>
	),
);

Section.displayName = "Section";

export interface StackProps extends DivProps {
	gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
	align?: "start" | "center" | "end" | "stretch";
}

const gapMap = {
	none: "gap-0",
	xs: "gap-1",
	sm: "gap-2",
	md: "gap-4",
	lg: "gap-6",
	xl: "gap-10",
};

const alignMap = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	stretch: "items-stretch",
};

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
	({ className, gap = "md", align = "stretch", ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex flex-col",
				gapMap[gap],
				alignMap[align],
				className,
			)}
			{...props}
		/>
	),
);

Stack.displayName = "Stack";

export interface ClusterProps extends DivProps {
	gap?: StackProps["gap"];
	align?: "start" | "center" | "end" | "baseline";
	justify?: "start" | "center" | "end" | "between" | "around";
	wrap?: boolean;
}

const clusterAlign = {
	start: "items-start",
	center: "items-center",
	end: "items-end",
	baseline: "items-baseline",
};

const clusterJustify = {
	start: "justify-start",
	center: "justify-center",
	end: "justify-end",
	between: "justify-between",
	around: "justify-around",
};

export const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
	(
		{
			className,
			gap = "md",
			align = "center",
			justify = "start",
			wrap = true,
			...props
		},
		ref,
	) => (
		<div
			ref={ref}
			className={cn(
				"flex",
				wrap && "flex-wrap",
				gapMap[gap],
				clusterAlign[align],
				clusterJustify[justify],
				className,
			)}
			{...props}
		/>
	),
);

Cluster.displayName = "Cluster";

export interface GridLayoutProps extends DivProps {
	minItem?: string; // e.g. "16rem"
	gap?: StackProps["gap"];
	cols?: number; // fixed columns override
}

export const GridLayout = React.forwardRef<HTMLDivElement, GridLayoutProps>(
	(
		{ className, minItem = "16rem", gap = "md", cols, style, ...props },
		ref,
	) => (
		<div
			ref={ref}
			className={cn("grid", gapMap[gap], className)}
			style={{
				gridTemplateColumns: cols
					? `repeat(${cols}, minmax(0, 1fr))`
					: `repeat(auto-fit, minmax(min(${minItem}, 100%), 1fr))`,
				...style,
			}}
			{...props}
		/>
	),
);

GridLayout.displayName = "GridLayout";

export const Center = React.forwardRef<HTMLDivElement, DivProps>(
	({ className, ...props }, ref) => (
		<div
			ref={ref}
			className={cn("flex items-center justify-center", className)}
			{...props}
		/>
	),
);
Center.displayName = "Center";

export interface DividerProps extends DivProps {
	orientation?: "horizontal" | "vertical";
	label?: React.ReactNode;
}
export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
	({ className, orientation = "horizontal", label, ...props }, ref) => {
		if (orientation === "vertical") {
			return (
				<div
					ref={ref}
					className={cn("w-px self-stretch bg-border", className)}
					{...props}
				/>
			);
		}
		if (label) {
			return (
				<div
					ref={ref}
					className={cn("flex items-center gap-3", className)}
					{...props}
				>
					<div className="h-px flex-1 bg-border" />
					<span className="text-xs uppercase tracking-wider text-muted-foreground">
						{label}
					</span>
					<div className="h-px flex-1 bg-border" />
				</div>
			);
		}
		return (
			<div
				ref={ref}
				className={cn("h-px w-full bg-border", className)}
				{...props}
			/>
		);
	},
);

Divider.displayName = "Divider";
