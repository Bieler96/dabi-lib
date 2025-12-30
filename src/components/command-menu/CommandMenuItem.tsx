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
				"flex items-center gap-2 p-2 rounded-lg cursor-pointer",
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