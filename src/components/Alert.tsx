
import { Dialog } from './Dialog';
import { Button } from './Button';

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
	confirmText = 'OK',
}: AlertProps) {
	return (
		<Dialog open={open} onClose={onClose}>
			<div className="space-y-[var(--space-4)] text-center">
				<h2 className="text-xl font-semibold">{title}</h2>
				<p className="text-on-surface-variant">{message}</p>
				<div className="flex justify-end gap-[var(--space-2)]">
					<Button onClick={onClose}>
						{confirmText}
					</Button>
				</div>
			</div>
		</Dialog>
	);
}
