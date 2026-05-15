import cx from 'clsx';

export type StatusProps = {
	variant?: "online" | "offline" | "maintenance" | "degraded";
	text?: string;
	ping?: boolean;
	className?: string;
}

export function Status({
	variant = "online",
	text,
	ping = false,
	className,
}: StatusProps) {
	const baseClasses = "flex flex-row gap-1 text-on-surface inline-flex items-center justify-center rounded-[var(--radius-component)] border border-outline-variant px-2 py-1 text-sm text-on-surface font-medium";

	const variantClasses = {
		online: "bg-[var(--color-status-online)]",
		offline: "bg-[var(--color-status-offline)]",
		maintenance: "bg-[var(--color-status-maintenance)]",
		degraded: "bg-[var(--color-status-degraded)]",
	};

	return (
		<>
			{text ? (
				<div className={cx(baseClasses, className)}>
					<div className="relative">
						<div className={cx(variantClasses[variant], "size-2 rounded-full")}></div>
						{ping &&
							<div className={cx(variantClasses[variant], "size-2 rounded-full absolute left-0 top-0 animate-ping")}></div>
						}
					</div>
					<span>{text}</span>
				</div>
			) : (
				<div className="relative">
					<div className={cx(variantClasses[variant], "size-2 rounded-full")}></div>
					{ping &&
						<div className={cx(variantClasses[variant], "size-2 rounded-full absolute left-0 top-0 animate-ping")}></div>
					}
				</div>
			)}
		</>
	);
}
