import { useState, useCallback, type JSX } from 'react';
import { Confirm, type ConfirmProps } from '../components/Confirm';

type ConfirmOptions = Omit<ConfirmProps, 'open' | 'onClose' | 'onConfirm'>;

type UseConfirmReturn = {
	confirm: (options: ConfirmOptions) => Promise<boolean>;
	ConfirmationDialog: () => JSX.Element | null;
};

export const useConfirm = (): UseConfirmReturn => {
	const [options, setOptions] = useState<ConfirmOptions | null>(null);
	const [resolve, setResolve] = useState<((value: boolean) => void) | null>(
		null
	);
	const [open, setOpen] = useState(false);

	const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
		return new Promise<boolean>((res) => {
			setOptions(opts);
			setOpen(true);
			setResolve(() => res);
		});
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
		setTimeout(() => {
			if (resolve) {
				resolve(false);
			}
			setOptions(null);
		}, 200);
	}, [resolve]);

	const handleConfirm = useCallback(() => {
		setOpen(false);
		setTimeout(() => {
			if (resolve) {
				resolve(true);
			}
			setOptions(null);
		}, 200);
	}, [resolve]);

	const ConfirmationDialog = useCallback(() => {
		if (!options) {
			return null;
		}
		return (
			<Confirm
				open={open}
				onClose={handleClose}
				onConfirm={handleConfirm}
				{...options}
			/>
		);
	}, [options, open, handleClose, handleConfirm]);

	return { confirm, ConfirmationDialog };
};