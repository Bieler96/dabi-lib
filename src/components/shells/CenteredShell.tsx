import React from "react";
import { cn } from "../../utils/cn";

export interface CenteredShellProps extends React.HTMLAttributes<HTMLDivElement> {
	maxWidth?: string;
}

export const CenteredShell = React.forwardRef<
	HTMLDivElement,
	CenteredShellProps
>(({ className, maxWidth = "28rem", children, style, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			"flex min-h-screen w-full items-center justify-center bg-background p-6",
			className,
		)}
		{...props}
	>
		<div className="w-full" style={{ maxWidth, ...style }}>
			{children}
		</div>
	</div>
));

CenteredShell.displayName = "CenteredShell";
