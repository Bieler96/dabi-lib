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
    title?: string;
    description?: string;
    className?: string;
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
}: SheetProps) {
    const [shouldRender, setShouldRender] = React.useState(isOpen);
    const [currentSide, setCurrentSide] = React.useState(side);

    React.useEffect(() => {
        if (isOpen) {
            setShouldRender(true);
            setCurrentSide(side);
        }
    }, [isOpen, side]);

    React.useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && isOpen) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    const handleAnimationEnd = (e: React.AnimationEvent) => {
        // We close the portal only when the sheet's out-animation finishes.
        // The animation names from CSS are sheetOutLeft, sheetOutRight, etc.
        if (!isOpen && e.animationName.toLowerCase().includes("sheetout")) {
            setShouldRender(false);
        }
    };

    if (!shouldRender) return null;

    const sideStyles = {
        top: "top-[1rem] inset-x-[1rem] border-b border-outline-variant animate-sheet-in-top data-[state=closed]:animate-sheet-out-top h-auto max-h-[80%]",
        bottom: "bottom-[1rem] inset-x-[1rem] border-t border-outline-variant animate-sheet-in-bottom data-[state=closed]:animate-sheet-out-bottom h-auto max-h-[80%]",
        left: "left-[1rem] inset-y-[1rem] border-r border-outline-variant animate-sheet-in-left data-[state=closed]:animate-sheet-out-left w-full sm:max-w-sm ml-0",
        right: "right-[1rem] inset-y-[1rem] border-l border-outline-variant animate-sheet-in-right data-[state=closed]:animate-sheet-out-right w-full sm:max-w-sm mr-0",
    };

    return createPortal(
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={clsx(
                    "absolute inset-0 bg-black/40 transition-opacity",
                    isOpen ? "animate-overlay-in" : "animate-overlay-out"
                )}
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Sheet Content */}
            <div
                role="dialog"
                aria-modal="true"
                data-state={isOpen ? "open" : "closed"}
                onAnimationEnd={handleAnimationEnd}
                className={clsx(
                    "rounded-[1rem] absolute bg-surface p-6 shadow-2xl transition ease-in-out focus:outline-none",
                    sideStyles[currentSide],
                    className
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                        <div className="grow">
                            {title && (
                                <h2 className="text-lg font-semibold text-on-surface leading-none mb-1">
                                    {title}
                                </h2>
                            )}
                            {description && (
                                <p className="text-sm text-on-surface-variant font-normal">
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
        document.body
    );
}

// Optional sub-components for consistent layout
export function SheetHeader({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={clsx("flex flex-col space-y-2 mb-4", className)}>{children}</div>;
}

export function SheetFooter({ children, className }: { children: React.ReactNode, className?: string }) {
    return <div className={clsx("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-4", className)}>{children}</div>;
}

export function SheetTitle({ children, className }: { children: React.ReactNode, className?: string }) {
    return <h2 className={clsx("text-lg font-semibold text-on-surface", className)}>{children}</h2>;
}

export function SheetDescription({ children, className }: { children: React.ReactNode, className?: string }) {
    return <p className={clsx("text-sm text-on-surface-variant", className)}>{children}</p>;
}
