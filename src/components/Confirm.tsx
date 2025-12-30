import { Dialog } from './Dialog';
import { Button } from './Button';

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
	confirmText = 'Confirm',
	cancelText = 'Cancel',
}: ConfirmProps) {
	return (
		<Dialog open={open} onClose={onClose}>
			<div className="text-center">
				<h2 className="text-xl font-semibold mb-2">{title}</h2>
				<p className="mb-4 text-on-surface-variant">{message}</p>
				<div className="flex justify-end gap-2">
					<Button variant="outlined" onClick={onClose}>
						{cancelText}
					</Button>
					<Button onClick={onConfirm}>
						{confirmText}
					</Button>
				</div>
			</div>
		</Dialog>
	);
}