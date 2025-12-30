import {
	useFloating,
	offset,
	flip,
	shift,
	autoUpdate,
	type Placement,
} from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";

export interface PopoverProps {
	trigger: React.ReactNode;
	content: React.ReactNode;
	onHover?: boolean;
	className?: string;
	placement?: Placement;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	fullWidth?: boolean;
}

export function Popover({
	trigger,
	content,
	onHover = false,
	className,
	placement = "bottom",
	open: controlledOpen,
	onOpenChange,
	fullWidth = false,
}: PopoverProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const open = controlledOpen ?? internalOpen;
	const setOpen = onOpenChange ?? setInternalOpen;

	const timeoutRef = useRef<number | null>(null);

	const { refs, floatingStyles, update } = useFloating({
		placement,
		middleware: [offset(8), flip(), shift()],
		whileElementsMounted: autoUpdate,
		open,
		onOpenChange: setOpen,
	});

	const handleMouseEnter = () => {
		if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
		setOpen(true);
	};

	const handleMouseLeave = () => {
		timeoutRef.current = window.setTimeout(() => setOpen(false), 100);
	};

	useEffect(() => {
		if (!onHover && open) {
			const handleClickOutside = (event: MouseEvent) => {
				if (
					refs.reference.current instanceof Node &&
					refs.floating.current instanceof Node &&
					!refs.reference.current.contains(event.target as Node) &&
					!refs.floating.current.contains(event.target as Node)
				) {
					setOpen(false);
				}
			};
			document.addEventListener("mousedown", handleClickOutside);
			return () => document.removeEventListener("mousedown", handleClickOutside);
		}
	}, [open, onHover, refs, setOpen]);

	const triggerProps = onHover
		? {
			onMouseEnter: handleMouseEnter,
			onMouseLeave: handleMouseLeave,
		}
		: {
			onClick: () => {
				setOpen(!open);
				update();
			},
		};

	return (
		<div className={clsx("relative", fullWidth ? "w-full" : "inline-block")}>
			<div
				ref={refs.setReference}
				className={clsx("cursor-pointer", fullWidth ? "w-full" : "inline-block")}
				{...triggerProps}
			>
				{trigger}
			</div>

			<div
				ref={refs.setFloating}
				style={floatingStyles}
				className={clsx(
					"z-10 w-64 rounded-lg bg-surface border border-outline p-2 shadow-lg transition-all transform duration-200 ease-out",
					open
						? "opacity-100 scale-100 pointer-events-auto"
						: "opacity-0 scale-95 pointer-events-none",
					className
				)}
				onMouseEnter={onHover ? handleMouseEnter : undefined}
				onMouseLeave={onHover ? handleMouseLeave : undefined}
			>
				{content}
			</div>
		</div>
	);
}
