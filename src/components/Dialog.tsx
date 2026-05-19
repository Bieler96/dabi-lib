import { createPortal } from "react-dom";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import clsx from "clsx";

export interface DialogProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	title?: ReactNode;
	description?: ReactNode;
	className?: string;
	overlayClassName?: string;
	paperClassName?: string;
	ariaLabel?: string;
	closeOnBackdropClick?: boolean;
	closeOnEscape?: boolean;
}

export function Dialog({
	open,
	onClose,
	children,
	title,
	description,
	className,
	overlayClassName,
	paperClassName,
	ariaLabel,
	closeOnBackdropClick = true,
	closeOnEscape = true,
}: DialogProps) {
	const [isRendered, setIsRendered] = useState(open);
	const panelRef = useRef<HTMLDivElement>(null);
	const previouslyFocusedElement = useRef<HTMLElement | null>(null);
	const previousBodyOverflow = useRef<string | null>(null);
	const titleId = useId();
	const descriptionId = useId();
	const canUseDom = typeof document !== "undefined";

	useEffect(() => {
		if (!canUseDom) {
			return;
		}

		if (open) {
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
	}, [open, canUseDom]);

	useEffect(() => {
		if (!canUseDom || !open) {
			return;
		}

		if (closeOnEscape) {
			const handleKeyDown = (event: KeyboardEvent) => {
				if (event.key === "Escape") {
					onClose();
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => document.removeEventListener("keydown", handleKeyDown);
		}
		return;
	}, [open, onClose, closeOnEscape, canUseDom]);

	useEffect(() => {
		if (!canUseDom) {
			return;
		}

		if (open) {
			const frame = requestAnimationFrame(() => {
				setIsRendered(true);
				panelRef.current?.focus();
			});
			return () => cancelAnimationFrame(frame);
		}

		if (!isRendered) {
			return;
		}

		const timer = window.setTimeout(() => {
			setIsRendered(false);
			previouslyFocusedElement.current?.focus?.();
		}, 200);

		return () => window.clearTimeout(timer);
	}, [open, isRendered, canUseDom]);

	if ((!open && !isRendered) || !canUseDom) return null;

	return createPortal(
		<div className={clsx("fixed inset-0 z-50", className)}>
			<div
				className={clsx(
					"absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200",
					open ? "opacity-100" : "opacity-0",
					overlayClassName,
				)}
				onClick={closeOnBackdropClick ? onClose : undefined}
				aria-hidden="true"
			/>

			<div className="fixed inset-0 flex items-center justify-center p-4">
				<div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-label={ariaLabel}
					aria-labelledby={title ? titleId : undefined}
					aria-describedby={description ? descriptionId : undefined}
					tabIndex={-1}
					className={clsx(
						"w-full max-w-lg rounded-[var(--radius-component)] border border-outline bg-surface p-6 shadow-lg outline-none transition-all duration-200 ease-out",
						open
							? "opacity-100 translate-y-0"
							: "opacity-0 translate-y-12",
						paperClassName,
					)}
					onClick={(event) => event.stopPropagation()}
				>
					{(title || description) && (
						<div className="mb-4 space-y-1">
							{title && (
								<div
									id={titleId}
									className="text-xl font-semibold text-on-surface"
								>
									{title}
								</div>
							)}
							{description && (
								<div
									id={descriptionId}
									className="text-sm text-on-surface-variant"
								>
									{description}
								</div>
							)}
						</div>
					)}
					{children}
				</div>
			</div>
		</div>,
		document.body,
	);
}
