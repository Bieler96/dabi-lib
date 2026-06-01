import {
	createContext,
	useContext,
	useId,
	useState,
	type ReactNode,
} from "react";
import { motion } from "motion/react";

type TabsContextValue = {
	value: string;
	setValue: (value: string) => void;
	hoveredValue: string | null;
	setHoveredValue: (value: string | null) => void;
	layoutId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
	const context = useContext(TabsContext);

	if (!context) {
		throw new Error("Tabs components must be used inside <Tabs />");
	}

	return context;
}

type TabsProps = {
	defaultValue: string;
	value?: string;
	onValueChange?: (value: string) => void;
	children: ReactNode;
	className?: string;
};

export function Tabs({
	defaultValue,
	value,
	onValueChange,
	children,
	className,
}: TabsProps) {
	const [internalValue, setInternalValue] = useState(defaultValue);
	const [hoveredValue, setHoveredValue] = useState<string | null>(null);
	const layoutId = useId();

	const currentValue = value ?? internalValue;

	function setValue(nextValue: string) {
		if (value === undefined) {
			setInternalValue(nextValue);
		}

		onValueChange?.(nextValue);
	}

	return (
		<TabsContext.Provider
			value={{
				value: currentValue,
				setValue,
				hoveredValue,
				setHoveredValue,
				layoutId,
			}}
		>
			<div className={className}>{children}</div>
		</TabsContext.Provider>
	);
}

type TabsListProps = {
	children: ReactNode;
	className?: string;
};

export function TabsList({ children, className }: TabsListProps) {
	const { setHoveredValue } = useTabs();

	return (
		<div
			onPointerLeave={() => setHoveredValue(null)}
			className={[
				"inline-flex items-center gap-1 rounded-xl border border-border bg-muted/10 p-1",
				className,
			].join(" ")}
		>
			{children}
		</div>
	);
}

type TabsTriggerProps = {
	value: string;
	children: ReactNode;
	className?: string;
};

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
	const {
		value: activeValue,
		setValue,
		hoveredValue,
		setHoveredValue,
		layoutId,
	} = useTabs();

	const isActive = activeValue === value;
	const isHovered = hoveredValue === value;

	return (
		<button
			type="button"
			onClick={() => setValue(value)}
			onPointerEnter={() => setHoveredValue(value)}
			className={[
				"cursor-pointer relative rounded-lg min-h-11 gap-1.5 px-3 py-2 sm:h-8 sm:min-h-0 sm:px-2.5 sm:py-0",
				className,
			].join(" ")}
		>
			{isHovered && (
				<motion.span
					layoutId={`tabs-hover-${layoutId}`}
					className="absolute inset-0 z-0 rounded-lg bg-muted/30"
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 35,
					}}
				/>
			)}

			{isActive && (
				<motion.span
					layoutId={`tabs-active-${layoutId}`}
					className="absolute inset-0 z-10 rounded-lg bg-muted text-muted-foreground shadow-sm"
					transition={{
						type: "spring",
						stiffness: 500,
						damping: 35,
					}}
				/>
			)}

			<span className="relative z-20">{children}</span>
		</button>
	);
}

type TabsContentProps = {
	value: string;
	children: ReactNode;
	className?: string;
};

export function TabsContent({ value, children, className }: TabsContentProps) {
	const { value: activeValue } = useTabs();

	if (activeValue !== value) {
		return null;
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 6 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.18, ease: "easeOut" }}
			className={className}
		>
			{children}
		</motion.div>
	);
}
