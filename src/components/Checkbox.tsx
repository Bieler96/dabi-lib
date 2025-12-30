import clsx from "clsx";

export interface CheckboxProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
	label?: string;
	disabled?: boolean;
	className?: string;
}

export function Checkbox({
	checked,
	onChange,
	label,
	disabled = false,
	className = "",
}: CheckboxProps) {
	return (
		<label
			className={clsx(
				"flex items-center gap-2 cursor-pointer",
				disabled && "pointer-events-none opacity-50",
				className,
			)}
		>
			<input
				type="checkbox"
				checked={checked}
				onChange={(e) => onChange(e.target.checked)}
				disabled={disabled}
				className="sr-only peer"
			/>

			<div
				className={clsx(
					"w-5 h-5 border-2 rounded-md flex items-center justify-center transition-colors duration-150",
					checked
						? "bg-primary border-primary"
						: "border-outline",
				)}
			>
				{checked && (
					<svg
						className="w-3 h-3 text-on-primary"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="3"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<polyline points="20 6 9 17 4 12" />
					</svg>
				)}
			</div>

			{label && <span className="select-none text-base font-medium">{label}</span>}
		</label>
	);
}