import React from "react";
import { cn } from "../../utils/cn";

export interface SidebarShellProps extends React.HTMLAttributes<HTMLDivElement> {
	sidebar: React.ReactNode;
	sidebarWidth?: string; // e.g. "16rem"
	collapsed?: boolean;
	collapsedWidth?: string; // e.g. "3.5rem"
	side?: "left" | "right";
}

export const SidebarShell = React.forwardRef<HTMLDivElement, SidebarShellProps>(
	(
		{
			className,
			sidebar,
			sidebarWidth = "16rem",
			collapsed = false,
			collapsedWidth = "3.5rem",
			side = "left",
			children,
			...props
		},
		ref,
	) => {
		const width = collapsed ? collapsedWidth : sidebarWidth;
		return (
			<div
				ref={ref}
				className={cn(
					"flex min-h-[calc(100vh-0px)] w-full",
					side === "right" && "flex-row-reverse",
					className,
				)}
				{...props}
			>
				<aside
					className="shrink-0 border-r bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-out"
					style={{ width }}
				>
					<div className="sticky top-0 h-screen overflow-y-auto">
						{sidebar}
					</div>
				</aside>
				<div className="min-w-0 flex-1">{children}</div>
			</div>
		);
	},
);

SidebarShell.displayName = "SidebarShell";
