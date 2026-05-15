import React, { useState } from 'react';
import cx from 'clsx';
import { X } from 'lucide-react';

export type ChipProps = {
	variant?: 'assist' | 'filter' | 'input' | 'suggestion';
	label: string;
	icon?: React.ReactNode;
	avatar?: React.ReactNode;
	onDelete?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	onClick?: () => void;
	selected?: boolean;
	disabled?: boolean;
	className?: string;
	colors?: {
		backgroundColorClass?: string;
		textColorClass?: string;
		borderColorClass?: string;
		hoverBackgroundColorClass?: string;
		selectedBackgroundColorClass?: string;
		selectedTextColorClass?: string;
		selectedBorderColorClass?: string;
		selectedHoverBackgroundColorClass?: string;
	};
};

export const Chip: React.FC<ChipProps> = ({
	variant = 'assist',
	label,
	icon,
	avatar,
	onDelete,
	onClick,
	selected,
	disabled = false,
	className,
	colors,
}) => {
	const [isHovered, setIsHovered] = useState(false);

		const baseClasses = 'text-on-surface inline-flex items-center justify-center rounded-[var(--radius-component)] border border-outline-variant px-2 py-1 text-sm text-on-surface transition-colors duration-150';

	const variantClasses = {
		assist: 'hover:bg-primary/10 dark:hover:bg-primary/20',
		filter: selected
			? 'border-transparent bg-primary-container text-on-primary-container cursor-pointer'
			: ' hover:bg-gray-50 cursor-pointer',
		input: '',
		suggestion: 'hover:bg-primary/10 dark:hover:bg-primary/20',
	};

	const chipClasses = cx(baseClasses, variantClasses[variant]);

	const dynamicClasses = cx({
		[colors?.backgroundColorClass ?? '']: !selected && !isHovered,
		[colors?.textColorClass ?? '']: !selected,
		[colors?.borderColorClass ?? '']: !selected,
		[colors?.hoverBackgroundColorClass ?? '']: !selected && isHovered,

		[colors?.selectedBackgroundColorClass ?? '']: selected && !isHovered,
		[colors?.selectedTextColorClass ?? '']: selected,
		[colors?.selectedBorderColorClass ?? '']: selected,
		[colors?.selectedHoverBackgroundColorClass ?? '']: selected && isHovered,

		'cursor-pointer': onClick && !disabled,
		'pointer-events-none opacity-50': disabled
		});

	return (
		<div
			className={cx(chipClasses, dynamicClasses, className)}
			onClick={onClick}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			{avatar}
			{icon && <span className="me-2">{icon}</span>}
			<span>{label}</span>
			{onDelete && (
				<button
					type="button"
					onClick={(event) => {
						event.stopPropagation();
						onDelete(event);
					}}
					className="ms-2 p-[0.2rem] rounded-[calc(var(--radius-component)_-_0.65rem)] hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-150"
				>
					<X className="size-4" />
				</button>
			)}
		</div>
	);
};
