import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./Dialog";
import { Button } from "./Button";

export interface AlertProps {
	open: boolean;
	onClose: () => void;
	title: string;
	message: string;
	confirmText?: string;
}

export function Alert({
	open,
	onClose,
	title,
	message,
	confirmText = "OK",
}: AlertProps) {
	return (
		<Dialog
			open={open}
			onOpenChange={(nextOpen) => {
				if (!nextOpen) onClose();
			}}
		>
			<DialogContent>
				<div className="space-y-[var(--space-4)] text-center">
					<DialogTitle className="text-xl font-semibold">
						{title}
					</DialogTitle>
					<DialogDescription>{message}</DialogDescription>
				</div>
				<div className="flex justify-end gap-[var(--space-2)]">
					<Button onClick={onClose}>{confirmText}</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
