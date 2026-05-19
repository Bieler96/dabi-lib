import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import clsx from "clsx";
import { Button } from "./Button";

export type SheetSide = "top" | "bottom" | "left" | "right";

export interface SheetProps {
	isOpen: boolean;
	onClose: () => void;
	side?: SheetSide;
	children: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	className?: string;
	overlayClassName?: string;
	panelClassName?: string;
	ariaLabel?: string;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
}

/**
 * A Sheet component that slides in from different sides of the screen.
 * Supports "top", "bottom", "left", and "right" positions.
 */
export function Sheet({
	isOpen,
	onClose,
	side = "right",
	children,
	title,
	description,
	className,
	overlayClassName,
	panelClassName,
	ariaLabel,
	closeOnBackdropClick = true,
	closeOnEscape = true,
}: SheetProps) {
	const [shouldRender, setShouldRender] = React.useState(isOpen);
	const [currentSide, setCurrentSide] = React.useState(side);
	const panelRef = React.useRef<HTMLDivElement>(null);
	const previouslyFocusedElement = React.useRef<HTMLElement | null>(null);
	const previousBodyOverflow = React.useRef<string | null>(null);
	const titleId = React.useId();
	const descriptionId = React.useId();
	const canUseDom = typeof document !== "undefined";

	React.useEffect(() => {
		if (isOpen) {
			setShouldRender(true);
			setCurrentSide(side);
		}
	}, [isOpen, side]);

	React.useEffect(() => {
		if (!canUseDom) {
			return;
		}

		if (isOpen) {
			previouslyFocusedElement.current =
				document.activeElement as HTMLElement | null;
			previousBodyOverflow.current = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = previousBodyOverflow.current ?? "";
		}

		return () => {
			document.body.style.overflow = previousBodyOverflow.current ?? "";
		};
	}, [isOpen, canUseDom]);

	React.useEffect(() => {
		if (!canUseDom || !isOpen || !closeOnEscape) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose, closeOnEscape, canUseDom]);

	React.useEffect(() => {
		if (!canUseDom || !isOpen) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			panelRef.current?.focus();
		});

		return () => window.cancelAnimationFrame(frame);
	}, [isOpen, canUseDom]);

	const handleAnimationEnd = (e: React.AnimationEvent) => {
		// We close the portal only when the sheet's out-animation finishes.
		// The animation names from CSS are sheetOutLeft, sheetOutRight, etc.
		if (!isOpen && e.animationName.toLowerCase().includes("sheetout")) {
			setShouldRender(false);
			previouslyFocusedElement.current?.focus?.();
		}
	};

	if (!shouldRender || !canUseDom) return null;

	const sideStyles = {
		top: "top-[1rem] inset-x-[1rem] border-b border-outline-variant animate-sheet-in-top data-[state=closed]:animate-sheet-out-top h-auto max-h-[80%]",
		bottom: "bottom-[1rem] inset-x-[1rem] border-t border-outline-variant animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom h-auto max-h-[80%]",
		left: "left-[1rem] inset-y-[1rem] border-r border-outline-variant animate-sheet-in-left data-[state=closed]:animate-sheet-out-left w-full sm:max-w-sm ml-0",
		right: "right-[1rem] inset-y-[1rem] border-l border-outline-variant animate-sheet-in-right data-[state=closed]:animate-sheet-out-right w-full sm:max-w-sm mr-0",
	};

	return createPortal(
		<div className={clsx("fixed inset-0 z-50 overflow-hidden", className)}>
			<div
				className={clsx(
					"absolute inset-0 bg-black/40 transition-opacity",
					isOpen ? "animate-overlay-in" : "animate-overlay-out",
					overlayClassName,
				)}
				onClick={closeOnBackdropClick ? onClose : undefined}
				aria-hidden="true"
			/>

			<div
				role="dialog"
				aria-modal="true"
				aria-label={ariaLabel}
				aria-labelledby={title ? titleId : undefined}
				aria-describedby={description ? descriptionId : undefined}
				data-state={isOpen ? "open" : "closed"}
				onAnimationEnd={handleAnimationEnd}
				ref={panelRef}
				tabIndex={-1}
				className={clsx(
					"rounded-[var(--radius-component)] absolute bg-surface p-6 shadow-2xl transition ease-in-out outline-none",
					sideStyles[currentSide],
					panelClassName,
				)}
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex flex-col h-full">
					<div className="flex items-center justify-between mb-4 gap-4">
						<div className="grow min-w-0">
							{title && (
								<h2
									id={titleId}
									className="text-lg font-semibold text-on-surface leading-none mb-1"
								>
									{title}
								</h2>
							)}
							{description && (
								<p
									id={descriptionId}
									className="text-sm text-on-surface-variant font-normal"
								>
									{description}
								</p>
							)}
						</div>
						<Button
							onClick={onClose}
							variant="ghost"
							size="icon"
							aria-label="Close"
						>
							<X className="h-5 w-5" />
						</Button>
					</div>
					<div className="flex-1 overflow-y-auto">{children}</div>
				</div>
			</div>
		</div>,
		document.body,
	);
}

// Optional sub-components for consistent layout
export function SheetHeader({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx("flex flex-col space-y-2 mb-4", className)}>
			{children}
		</div>
	);
}

export function SheetFooter({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div
			className={clsx(
				"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4",
				className,
			)}
		>
			{children}
		</div>
	);
}

export function SheetTitle({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<h2
			className={clsx("text-lg font-semibold text-on-surface", className)}
		>
			{children}
		</h2>
	);
}

export function SheetDescription({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<p className={clsx("text-sm text-on-surface-variant", className)}>
			{children}
		</p>
	);
}
