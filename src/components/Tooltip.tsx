import type { Placement } from "@floating-ui/react";
import { Popover } from "./Popover";
import clsx from "clsx";

export interface TooltipProps {
	children: React.ReactNode;
	content: React.ReactNode;
	className?: string;
	placement?: Placement;
}

export function Tooltip({
	children,
	content,
	className,
	placement = "bottom",
}: TooltipProps) {
	return (
		<Popover
			trigger={children}
			content={content}
			onHover
			placement={placement}
			className={clsx(
				"px-2 py-1 text-sm pointer-events-none",
				className
			)}
		/>
	);
}