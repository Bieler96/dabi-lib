import React from "react";
import { cn } from "../../utils/cn";

export interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
	header?: React.ReactNode;
	footer?: React.ReactNode;
	stickyHeader?: boolean;
	stickyFooter?: boolean;
}

export const AppShell = React.forwardRef<HTMLDivElement, AppShellProps>(
	(
		{
			className,
			header,
			footer,
			stickyHeader = true,
			stickyFooter = false,
			children,
			...props
		},
		ref,
	) => (
		<div
			ref={ref}
			className={cn(
				"flex min-h-screen w-full flex-col bg-background text-foreground",
				className,
			)}
			{...props}
		>
			{header ? (
				<header
					className={cn(
						"z-30 border-b bg-background/80 backdrop-blur",
						stickyHeader && "sticky top-0",
					)}
				>
					{header}
				</header>
			) : null}
			<main className="flex-1">{children}</main>
			{footer ? (
				<footer
					className={cn(
						"z-30 border-t bg-background/80 backdrop-blur",
						stickyFooter && "sticky bottom-0",
					)}
				>
					{footer}
				</footer>
			) : null}
		</div>
	),
);

AppShell.displayName = "AppShell";
