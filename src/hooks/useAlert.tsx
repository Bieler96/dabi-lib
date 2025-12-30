import { useState, useCallback, type JSX } from 'react';
import { Alert, type AlertProps } from '../components/Alert';

type AlertOptions = Omit<AlertProps, 'open' | 'onClose'>;

type UseAlertReturn = {
	alert: (options: AlertOptions) => Promise<void>;
	AlertDialog: () => JSX.Element | null;
};

export const useAlert = (): UseAlertReturn => {
	const [options, setOptions] = useState<AlertOptions | null>(null);
	const [resolve, setResolve] = useState<(() => void) | null>(null);
	const [open, setOpen] = useState(false);

	const alert = useCallback((opts: AlertOptions): Promise<void> => {
		return new Promise<void>((res) => {
			setOptions(opts);
			setOpen(true);
			setResolve(() => res);
		});
	}, []);

	const handleClose = useCallback(() => {
		setOpen(false);
		setTimeout(() => {
			if (resolve) {
				resolve();
			}
			setOptions(null);
		}, 200);
	}, [resolve]);

	const AlertDialog = useCallback(() => {
		if (!options) {
			return null;
		}
		return (
			<Alert open={open} onClose={handleClose} {...options} />
		);
	}, [options, open, handleClose]);

	return { alert, AlertDialog };
};