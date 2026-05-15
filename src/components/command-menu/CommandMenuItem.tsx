import React from "react";
import clsx from "clsx";

export interface CommandMenuItemProps {
	children: React.ReactNode;
	onSelect?: () => void;
	isActive?: boolean;
}

export const CommandMenuItem = React.forwardRef<HTMLLIElement, CommandMenuItemProps>(({ children, onSelect, isActive }, ref) => {
	return (
		<li
			ref={ref}
			onClick={onSelect}
			className={clsx(
				"flex items-center gap-[var(--space-2)] p-[var(--space-2)] rounded-[var(--radius-control)] cursor-pointer",
				{
					"bg-primary-container text-on-primary-container": isActive,
					"hover:bg-hover": !isActive,
				}
			)}
		>
			{children}
		</li>
	);
});
