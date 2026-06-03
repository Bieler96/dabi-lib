import React from "react";
import { cn } from "../../utils/cn";

export interface SplitShellProps extends React.HTMLAttributes<HTMLDivElement> {
	primary: React.ReactNode;
	secondary: React.ReactNode;
	primaryWidth?: string; // e.g. "22rem"
	orientation?: "horizontal" | "vertical";
	side?: "left" | "right";
}

export const SplitShell = React.forwardRef<HTMLDivElement, SplitShellProps>(
	(
		{
			className,
			primary,
			secondary,
			primaryWidth = "22rem",
			orientation = "horizontal",
			side = "left",
			...props
		},
		ref,
	) => {
		if (orientation === "vertical") {
			return (
				<div
					ref={ref}
					className={cn(
						"flex h-full min-h-[24rem] flex-col",
						className,
					)}
					{...props}
				>
					<div className="border-b" style={{ height: primaryWidth }}>
						{primary}
					</div>
					<div className="min-h-0 flex-1">{secondary}</div>
				</div>
			);
		}
		return (
			<div
				ref={ref}
				className={cn(
					"flex h-full min-h-[24rem] w-full",
					side === "right" && "flex-row-reverse",
					className,
				)}
				{...props}
			>
				<div
					className="shrink-0 border-r"
					style={{ width: primaryWidth }}
				>
					{primary}
				</div>
				<div className="min-w-0 flex-1">{secondary}</div>
			</div>
		);
	},
);

SplitShell.displayName = "SplitShell";
