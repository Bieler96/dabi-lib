import * as React from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./Card";
import { cn } from "../utils/cn";

export interface StatCardProps extends React.ComponentProps<typeof Card> {
	label: React.ReactNode;
	value: React.ReactNode;
	description?: React.ReactNode;
	icon?: React.ReactNode;
	trend?: {
		value: React.ReactNode;
		direction?: "up" | "down" | "neutral";
		label?: React.ReactNode;
	};
}

function StatCard({
	label,
	value,
	description,
	icon,
	trend,
	className,
	...props
}: StatCardProps) {
	const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp;

	return (
		<Card className={cn("gap-3", className)} {...props}>
			<CardHeader className="gap-0.5">
				<CardDescription>{label}</CardDescription>
				{icon && (
					<CardAction className="text-muted-foreground">
						{icon}
					</CardAction>
				)}
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold tabular-nums">
					{value}
				</div>
				{trend && (
					<div
						className={cn(
							"mt-2 flex flex-wrap items-center gap-1 text-xs",
							trend.direction === "up" && "text-emerald-600",
							trend.direction === "down" && "text-destructive",
							(!trend.direction ||
								trend.direction === "neutral") &&
								"text-muted-foreground",
						)}
					>
						{trend.direction && trend.direction !== "neutral" && (
							<TrendIcon className="size-3.5" />
						)}
						<span className="font-medium">{trend.value}</span>
						{trend.label && (
							<span className="text-muted-foreground">
								{trend.label}
							</span>
						)}
					</div>
				)}
				{description && (
					<CardTitle className="mt-3 text-sm text-muted-foreground">
						{description}
					</CardTitle>
				)}
			</CardContent>
		</Card>
	);
}

export { StatCard };
