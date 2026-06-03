import React from "react";
import { cn } from "../../utils/cn";

export interface HolyGrailShellProps extends React.HTMLAttributes<HTMLDivElement> {
	header?: React.ReactNode;
	footer?: React.ReactNode;
	left?: React.ReactNode;
	right?: React.ReactNode;
	leftWidth?: string;
	rightWidth?: string;
}

export const HolyGrailShell = React.forwardRef<
	HTMLDivElement,
	HolyGrailShellProps
>(
	(
		{
			className,
			header,
			footer,
			left,
			right,
			leftWidth = "14rem",
			rightWidth = "16rem",
			children,
			...props
		},
		ref,
	) => (
		<div
			ref={ref}
			className={cn(
				"flex min-h-screen w-full flex-col bg-background",
				className,
			)}
			{...props}
		>
			{header && <header className="border-b">{header}</header>}
			<div className="flex flex-1">
				{left && (
					<aside
						className="shrink-0 border-r bg-sidebar"
						style={{ width: leftWidth }}
					>
						{left}
					</aside>
				)}
				<main className="min-w-0 flex-1">{children}</main>
				{right && (
					<aside
						className="shrink-0 border-l bg-sidebar"
						style={{ width: rightWidth }}
					>
						{right}
					</aside>
				)}
			</div>
			{footer && <footer className="border-t">{footer}</footer>}
		</div>
	),
);

HolyGrailShell.displayName = "HolyGrailShell";
