import React from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import { ChevronLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type Direction = 1 | -1;
export type Layout = "stack" | "split";

interface OnboardingContextValue {
	step: number;
	total: number;
	direction: Direction;
	layout: Layout;
	next: () => void;
	back: () => void;
	goTo: (i: number) => void;
	setTotal: (n: number) => void;
	onComplete?: () => void;
	isFirst: boolean;
	isLast: boolean;
}

const OnboardingContext = React.createContext<OnboardingContextValue | null>(
	null,
);

function useOnboarding() {
	const ctx = React.useContext(OnboardingContext);
	if (!ctx) throw new Error("Onboarding.* must be used inside <Onboarding>");
	return ctx;
}

export interface OnboardingProps
	extends React.HTMLAttributes<HTMLDivElement> {
	defaultStep?: number;
	step?: number;
	onStepChange?: (step: number) => void;
	onComplete?: () => void;
	/**
	 * `stack` (default) — single column, ideal for mobile / narrow split screens.
	 * `split`           — two columns on `lg+` (visual left, content right),
	 *                     gracefully collapses to a single column below.
	 */
	layout?: Layout;
}

const Onboarding = React.forwardRef<HTMLDivElement, OnboardingProps>(
	(
		{
			className,
			children,
			defaultStep = 0,
			step,
			onStepChange,
			onComplete,
			layout = "stack",
			...props
		},
		ref,
	) => {
		const [internal, setInternal] = React.useState(defaultStep);
		const [total, setTotal] = React.useState(0);
		const [direction, setDirection] = React.useState<Direction>(1);

		const current = step ?? internal;
		const setStep = (n: number, dir: Direction) => {
			setDirection(dir);
			if (step === undefined) setInternal(n);
			onStepChange?.(n);
		};

		const value: OnboardingContextValue = {
			step: current,
			total,
			direction,
			layout,
			setTotal,
			onComplete,
			isFirst: current === 0,
			isLast: total > 0 && current === total - 1,
			next: () => {
				if (current < total - 1) setStep(current + 1, 1);
				else onComplete?.();
			},
			back: () => current > 0 && setStep(current - 1, -1),
			goTo: (i) => setStep(i, i > current ? 1 : -1),
		};

		return (
			<OnboardingContext.Provider value={value}>
				<div
					ref={ref}
					data-layout={layout}
					className={cn(
						"relative flex min-h-screen w-full flex-col overflow-hidden bg-background text-foreground",
						className,
					)}
					{...props}
				>
					{children}
				</div>
			</OnboardingContext.Provider>
		);
	},
);
Onboarding.displayName = "Onboarding";

const OnboardingSteps = ({
	children,
	className,
}: React.HTMLAttributes<HTMLDivElement>) => {
	const { step, direction, setTotal, next, back, isFirst, isLast } =
		useOnboarding();
	const steps = React.Children.toArray(children);

	React.useEffect(() => {
		setTotal(steps.length);
	}, [steps.length, setTotal]);

	const active = steps[step];

	return (
		<div
			className={cn(
				"relative flex-1 overflow-hidden touch-pan-y",
				className,
			)}
		>
			<AnimatePresence mode="wait" custom={direction}>
				<motion.div
					key={step}
					custom={direction}
					initial={{ opacity: 0, x: direction * 40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: direction * -40 }}
					transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
					drag="x"
					dragElastic={0.18}
					dragConstraints={{ left: 0, right: 0 }}
					dragDirectionLock
					onDragEnd={(_, info) => {
						const threshold = 80;
						const power = info.offset.x + info.velocity.x * 0.2;
						if (power < -threshold && !isLast) next();
						else if (power > threshold && !isFirst) back();
					}}
					className="absolute inset-0 flex cursor-grab flex-col overflow-y-auto active:cursor-grabbing"
				>
					{active}
				</motion.div>
			</AnimatePresence>
		</div>
	);
};

const OnboardingStep = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
	const { layout } = useOnboarding();
	return (
		<div
			ref={ref}
			className={cn(
				"flex flex-1 flex-col px-6 pb-40 pt-16 sm:px-10 sm:pt-20",
				// center content & cap width on larger screens
				"mx-auto w-full max-w-2xl",
				layout === "split" &&
					"lg:grid lg:max-w-6xl lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-44 lg:pt-24 xl:gap-20",
				className,
			)}
			{...props}
		>
			{children}
		</div>
	);
});
OnboardingStep.displayName = "OnboardingStep";

const OnboardingVisual = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
	const { layout } = useOnboarding();
	return (
		<div
			ref={ref}
			className={cn(
				"mx-auto mb-10 flex aspect-square w-full max-w-[220px] items-center justify-center rounded-[2.5rem] bg-gradient-to-br from-accent to-secondary text-foreground/80 shadow-inner sm:max-w-[260px]",
				layout === "split" &&
					"lg:mx-0 lg:mb-0 lg:max-w-none lg:rounded-[3rem]",
				className,
			)}
			{...props}
		/>
	);
});
OnboardingVisual.displayName = "OnboardingVisual";

const OnboardingBody = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("min-w-0", className)}
		{...props}
	/>
));
OnboardingBody.displayName = "OnboardingBody";

const OnboardingTitle = React.forwardRef<
	HTMLHeadingElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h1
		ref={ref}
		className={cn(
			"text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl",
			className,
		)}
		{...props}
	/>
));
OnboardingTitle.displayName = "OnboardingTitle";

const OnboardingDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn(
			"mt-3 max-w-md text-pretty text-base leading-relaxed text-muted-foreground lg:text-lg",
			className,
		)}
		{...props}
	/>
));
OnboardingDescription.displayName = "OnboardingDescription";

const OnboardingContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn("mt-8 flex flex-col gap-3", className)}
		{...props}
	/>
));
OnboardingContent.displayName = "OnboardingContent";

const OnboardingHeader = ({
	className,
	children,
}: React.HTMLAttributes<HTMLDivElement>) => {
	const { isFirst, back } = useOnboarding();
	return (
		<header
			className={cn(
				"absolute inset-x-0 top-0 z-10 flex h-14 items-center justify-between px-4 sm:h-16 sm:px-6 lg:px-10",
				className,
			)}
		>
			<Button
				variant="ghost"
				size="icon"
				onClick={back}
				disabled={isFirst}
				className="rounded-full"
				aria-label="Zurück"
			>
				<ChevronLeft />
			</Button>
			<div className="text-sm font-medium text-muted-foreground">
				{children}
			</div>
			<div className="size-9" />
		</header>
	);
};

const OnboardingProgress = ({ className }: { className?: string }) => {
	const { step, total, goTo } = useOnboarding();
	return (
		<div
			className={cn(
				"flex items-center justify-center gap-1.5",
				className,
			)}
		>
			{Array.from({ length: total }).map((_, i) => {
				const active = i === step;
				return (
					<button
						key={i}
						type="button"
						onClick={() => goTo(i)}
						aria-label={`Schritt ${i + 1}`}
						className={cn(
							"h-1.5 rounded-full transition-all duration-300",
							active
								? "w-8 bg-foreground"
								: "w-1.5 bg-foreground/20 hover:bg-foreground/40",
						)}
					/>
				);
			})}
		</div>
	);
};

const OnboardingFooter = ({
	className,
	children,
}: React.HTMLAttributes<HTMLDivElement>) => (
	<footer
		className={cn(
			"absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background via-background to-transparent px-6 pb-[max(2rem,env(safe-area-inset-bottom))] pt-10 sm:px-10",
			className,
		)}
	>
		<div className="mx-auto flex w-full max-w-md flex-col gap-5">
			<OnboardingProgress />
			{children}
		</div>
	</footer>
);

interface OnboardingNextProps extends React.ComponentProps<typeof Button> {
	lastLabel?: React.ReactNode;
}

const OnboardingNext = ({
	children,
	lastLabel = "Fertig",
	...props
}: OnboardingNextProps) => {
	const { next, isLast } = useOnboarding();
	return (
		<Button onClick={next} {...props}>
			{isLast ? lastLabel : (children ?? "Next")}
		</Button>
	);
};

const OnboardingSkip = ({
	children = "Skip",
	...props
}: React.ComponentProps<typeof Button>) => {
	const { onComplete } = useOnboarding();
	return (
		<Button variant="ghost" onClick={onComplete} {...props}>
			{children}
		</Button>
	);
};

export {
	Onboarding,
	OnboardingSteps,
	OnboardingStep,
	OnboardingVisual,
	OnboardingBody,
	OnboardingTitle,
	OnboardingDescription,
	OnboardingContent,
	OnboardingHeader,
	OnboardingProgress,
	OnboardingFooter,
	OnboardingNext,
	OnboardingSkip,
};
