import clsx from "clsx";
import { Clipboard, Check } from 'lucide-react'
import { useEffect, useState } from 'react'

export type Size = "sm" | "md";

export type Variant = "outlined" | "ghost";

export interface CopyButtonProps {
	text: string;
	label?: string;
	labelCopied?: string;
	size?: Size;
	variant?: Variant;
	successfulCallback?: () => void;
	successulCallback?: () => void;
	className?: string;
	disabled?: boolean;
}

export function CopyButton({
	text,
	label,
	labelCopied,
	variant = "ghost",
	size = "md",
	successfulCallback,
	successulCallback,
	className,
	disabled = false,
}: CopyButtonProps) {
	const [copied, setCopied] = useState(false)
	const callback = successfulCallback ?? successulCallback;
	const [timeoutId, setTimeoutId] = useState<number | null>(null);

	const sizes = {
		sm: "size-4",
		md: "size-6"
	};
	const iconSizes = {
		sm: "size-4",
		md: "size-5"
	};
	const rounded = {
		sm: "rounded-[var(--radius-control)]",
		md: "rounded-[var(--radius-component)]"
	};
	const labelSizes = {
		sm: "text-sm",
		md: "text-base"
	};
	const variants = {
		outlined: "border border-primary text-primary hover:bg-primary/10 dark:hover:bg-primary/20",
		ghost: "bg-transparent text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text);
			setCopied(true);
			callback?.();
			if (timeoutId) {
				window.clearTimeout(timeoutId);
			}
			setTimeoutId(window.setTimeout(() => setCopied(false), 2000));
		} catch (err) {
			console.error('Copy failed', err);
		}
	}

	useEffect(() => {
		return () => {
			if (timeoutId) {
				window.clearTimeout(timeoutId);
			}
		};
	}, [timeoutId]);

	return (
		<button
			type="button"
			disabled={disabled}
			onClick={handleCopy}
			className={clsx(rounded[size], "cursor-pointer inline-flex items-center justify-center p-2 transition duration-150 disabled:cursor-not-allowed disabled:opacity-50", variants[variant], className)}
			aria-label="Copy to clipboard"
		>
			<span className={clsx(sizes[size], "relative flex items-center justify-center")}>
				<Clipboard className={`${iconSizes[size]} absolute inset-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${copied ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`} />
				<Check className={`${iconSizes[size]} absolute inset-0 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-transform duration-200 ${copied ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} text-success`} />
			</span>

			{label && <span className={clsx(labelSizes[size], "ml-2 me-1")}>{copied ? labelCopied || label : label}</span>}
		</button>
	)
}
