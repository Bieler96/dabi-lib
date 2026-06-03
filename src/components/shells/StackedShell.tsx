import React from "react";
import { cn } from "../../utils/cn";

export interface StackedShellProps extends React.HTMLAttributes<HTMLDivElement> {
	topNav: React.ReactNode;
	subNav?: React.ReactNode;
}

export const StackedShell = React.forwardRef<HTMLDivElement, StackedShellProps>(
	({ className, topNav, subNav, children, ...props }, ref) => (
		<div
			ref={ref}
			className={cn(
				"flex min-h-screen w-full flex-col bg-muted/30",
				className,
			)}
			{...props}
		>
			<div className="border-b bg-background">{topNav}</div>
			{subNav && <div className="border-b bg-background">{subNav}</div>}
			<main className="flex-1">{children}</main>
		</div>
	),
);

StackedShell.displayName = "StackedShell";
