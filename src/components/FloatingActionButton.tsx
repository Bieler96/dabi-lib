import clsx from "clsx";
import React from "react";

export interface FloatingActionButtonProps {
	icon: React.ReactNode;
	label?: string;
	extended?: boolean;
	onClick?: () => void;
	className?: string;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
	icon,
	label,
	extended = false,
	onClick,
	className,
}) => {
	return (
		<button
			className={clsx(
				"inline-flex items-center justify-center font-medium transition-all duration-150 ease-in-out cursor-pointer",
				"h-14",
				"bg-primary text-on-primary shadow-md hover:shadow-lg",
				extended
					? "w-auto px-6 rounded-2xl"
					: "w-auto px-4 rounded-2xl",
				className
			)}
			onClick={onClick}
		>
			{extended ? (
				<>
					<span
						className={clsx(
							"flex items-center justify-center w-6 h-6 transition-all duration-150 ease-in-out",
							label && "mr-3"
						)}
					>
						{icon}
					</span>
					<span
						className={clsx(
							"whitespace-nowrap transition-all duration-150 ease-in-out",
							"opacity-100 translate-x-0"
						)}
					>
						{label}
					</span>
				</>
			) : (
				<span
					className={clsx(
						"flex items-center justify-center w-6 h-6 transition-all duration-150 ease-in-out"
					)}
				>
					{icon}
				</span>
			)}
		</button>
	);
};