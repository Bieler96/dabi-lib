import { useEffect, useState, type ReactNode } from "react";
import clsx from "clsx";

export interface DialogProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
	classNameOverlay?: string | undefined
}

export function Dialog({
	open,
	onClose,
	children,
	classNameOverlay
}: DialogProps) {
	const [isRendered, setIsRendered] = useState(open);

	// Body scroll verhindern, wenn Dialog offen ist
	useEffect(() => {
		if (open) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);

	// Schließen mit Escape-Taste
	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (open) {
			document.addEventListener("keydown", handleKeyDown);
		}

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [open, onClose]);

	useEffect(() => {
		if (open) {
			const frame = requestAnimationFrame(() => {
				setIsRendered(true);
			});
			return () => cancelAnimationFrame(frame);
		}
		if (!isRendered) {
			return;
		}
		const timer = window.setTimeout(() => setIsRendered(false), 200);
		return () => clearTimeout(timer);
	}, [open, isRendered]);

	if (!open && !isRendered) return null;

	return (
		<>
			{/* Overlay */}
			<div
				className={clsx(
					"fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-200",
					open ? "opacity-100" : "opacity-0",
					classNameOverlay
				)}
			></div>

			{/* Dialog */}
			<div
				className="fixed inset-0 flex items-center justify-center z-50 p-4"
				onClick={onClose}
			>
				<div
					className={clsx(
						"bg-surface border border-outline rounded-lg shadow-lg max-w-lg w-full p-6 relative transition-all duration-200 ease-out",
						open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
					)}
					onClick={(e) => e.stopPropagation()}
				>
					{children}
				</div>
			</div>
		</>
	);
}
