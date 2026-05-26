import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "./Dialog";
import { Button } from "./Button";

export interface ConfirmProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	title: string;
	message: string;
	confirmText?: string;
	cancelText?: string;
}

export function Confirm({
	open,
	onClose,
	onConfirm,
	title,
	message,
	confirmText = "Confirm",
	cancelText = "Cancel",
}: ConfirmProps) {
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
					<Button variant="outlined" onClick={onClose}>
						{cancelText}
					</Button>
					<Button onClick={onConfirm}>{confirmText}</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
