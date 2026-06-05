/* eslint-disable react-refresh/only-export-components */
import { motion, useReducedMotion } from "motion/react";
import {
	Children,
	type ComponentProps,
	cloneElement,
	createElement,
	forwardRef,
	type ComponentType,
	type CSSProperties,
	type ForwardedRef,
	type ReactElement,
	type ReactNode,
	isValidElement,
} from "react";
import { cn } from "../utils/cn";

type MotionSpanProps = ComponentProps<typeof motion.span>;
type MotionDivProps = ComponentProps<typeof motion.div>;
type ExpressiveTransitionKey =
	| "spatialDefault"
	| "spatialFast"
	| "effectDefault"
	| "emphasized"
	| "soft";
type ExpressiveInteraction = "scale" | "lift" | "press" | "none";
type ExpressiveSize = "xs" | "sm" | "md" | "lg" | "xl";
type ExpressiveRadiusToken = "none" | "xs" | "sm" | "md" | "lg" | "xl" | "full";
type ExpressiveRadius = ExpressiveRadiusToken | number | string;

const expressiveInteractionStates: Record<
	Exclude<ExpressiveInteraction, "none">,
	{
		hoverScale: number;
		hoverY: number;
		pressedScale: number;
		pressedY: number;
	}
> = {
	scale: {
		hoverScale: 1.035,
		hoverY: 0,
		pressedScale: 0.94,
		pressedY: 0,
	},
	lift: {
		hoverScale: 1.015,
		hoverY: -1,
		pressedScale: 0.985,
		pressedY: 1,
	},
	press: {
		hoverScale: 1,
		hoverY: 0,
		pressedScale: 0.96,
		pressedY: 1,
	},
};

const expressiveMotionTransitions = {
	spatialDefault: {
		type: "spring",
		stiffness: 420,
		damping: 28,
		mass: 0.7,
	},
	spatialFast: {
		type: "spring",
		stiffness: 560,
		damping: 34,
		mass: 0.55,
	},
	effectDefault: {
		type: "spring",
		stiffness: 500,
		damping: 32,
		mass: 0.5,
	},
	emphasized: {
		type: "spring",
		stiffness: 380,
		damping: 22,
		mass: 0.9,
	},
	soft: {
		type: "spring",
		stiffness: 260,
		damping: 24,
		mass: 0.8,
	},
} as const;

const expressiveRadiusScale: Record<ExpressiveRadiusToken, string> = {
	none: "0px",
	xs: "8px",
	sm: "10px",
	md: "12px",
	lg: "16px",
	xl: "24px",
	full: "9999px",
};

const expressiveRadiusStates: Record<
	ExpressiveSize,
	{
		rest: ExpressiveRadiusToken;
		hover: ExpressiveRadiusToken;
		pressed: ExpressiveRadiusToken;
	}
> = {
	xs: { rest: "xs", hover: "sm", pressed: "xs" },
	sm: { rest: "sm", hover: "md", pressed: "xs" },
	md: { rest: "md", hover: "lg", pressed: "sm" },
	lg: { rest: "lg", hover: "xl", pressed: "md" },
	xl: { rest: "xl", hover: "xl", pressed: "lg" },
};

function resolveExpressiveRadius(radius: ExpressiveRadius | undefined) {
	if (radius === undefined) {
		return undefined;
	}

	if (typeof radius === "number") {
		return `${radius}px`;
	}

	if (radius in expressiveRadiusScale) {
		return expressiveRadiusScale[radius as ExpressiveRadiusToken];
	}

	return radius;
}

type ExpressiveBehavior = {
	children?: ReactNode;
	active?: boolean;
	disabled?: boolean;
	interaction?: ExpressiveInteraction;
	size?: ExpressiveSize;
	radius?: ExpressiveRadius;
	activeRadius?: ExpressiveRadius;
	hoverRadius?: ExpressiveRadius;
	pressedRadius?: ExpressiveRadius;
	hoverScale?: number;
	pressedScale?: number;
	transitionPreset?: ExpressiveTransitionKey;
	clip?: boolean;
	syncChildRadius?: boolean;
};

type ExpressiveWrapperProps = Omit<MotionSpanProps, "children" | "transition"> &
	ExpressiveBehavior & {
		transition?: MotionSpanProps["transition"];
	};

type ExpressiveSurfaceProps = Omit<MotionDivProps, "children" | "transition"> &
	ExpressiveBehavior & {
		transition?: MotionDivProps["transition"];
	};

function getExpressiveState({
	active = false,
	disabled = false,
	interaction = "scale",
	size = "md",
	radius,
	activeRadius,
	hoverRadius,
	pressedRadius,
	hoverScale,
	pressedScale,
}: ExpressiveBehavior) {
	const radiusState = expressiveRadiusStates[size];
	const restingRadius = resolveExpressiveRadius(radius ?? radiusState.rest);
	const selectedRadius = resolveExpressiveRadius(
		activeRadius ?? pressedRadius ?? radiusState.pressed,
	);
	const activeHoverRadius = resolveExpressiveRadius(hoverRadius);
	const activePressedRadius = resolveExpressiveRadius(
		pressedRadius ?? activeRadius ?? radiusState.pressed,
	);
	const animateRadius = active ? selectedRadius : restingRadius;

	if (disabled || interaction === "none") {
		return {
			animate: { scale: 1, y: 0, borderRadius: animateRadius },
			whileHover: undefined,
			whileTap: undefined,
		};
	}

	const interactionState = expressiveInteractionStates[interaction];
	const hover = {
		borderRadius: activeHoverRadius ?? animateRadius,
		scale: hoverScale ?? interactionState.hoverScale,
		y: interactionState.hoverY,
	};
	const tap = {
		borderRadius: activePressedRadius,
		scale: pressedScale ?? interactionState.pressedScale,
		y: interactionState.pressedY,
	};

	return {
		animate: { scale: 1, y: 0, borderRadius: animateRadius },
		whileHover: hover,
		whileTap: tap,
	};
}

function useExpressiveTransition(
	preset: ExpressiveTransitionKey = "spatialDefault",
	transition?: MotionSpanProps["transition"],
) {
	const shouldReduceMotion = useReducedMotion();

	if (shouldReduceMotion) {
		return { duration: 0 };
	}

	return transition ?? expressiveMotionTransitions[preset];
}

function renderExpressiveChildren(
	children: ReactNode,
	syncChildRadius: boolean,
) {
	if (
		!syncChildRadius ||
		Children.count(children) !== 1 ||
		!isValidElement(children)
	) {
		return children;
	}

	const child = children as ReactElement<{ style?: CSSProperties }>;

	return cloneElement(child, {
		style: {
			...child.props.style,
			borderRadius: "inherit",
		},
	});
}

function ExpressiveWrapper({
	children,
	className,
	active = false,
	clip = true,
	disabled = false,
	interaction = "scale",
	size = "md",
	radius,
	activeRadius,
	hoverRadius,
	pressedRadius,
	hoverScale,
	pressedScale,
	syncChildRadius = true,
	transitionPreset = "spatialDefault",
	transition,
	style,
	...props
}: ExpressiveWrapperProps) {
	const expressiveState = getExpressiveState({
		active,
		disabled,
		interaction,
		size,
		radius,
		activeRadius,
		hoverRadius,
		pressedRadius,
		hoverScale,
		pressedScale,
	});
	const expressiveTransition = useExpressiveTransition(
		transitionPreset,
		transition,
	);

	return (
		<motion.span
			initial={false}
			animate={expressiveState.animate}
			whileHover={expressiveState.whileHover}
			whileTap={expressiveState.whileTap}
			transition={expressiveTransition}
			className={cn(
				"inline-flex max-w-full transform-gpu",
				clip && "overflow-hidden",
				className,
			)}
			style={
				{
					transformOrigin: "center",
					...style,
				} as CSSProperties
			}
			{...props}
		>
			{renderExpressiveChildren(children, syncChildRadius)}
		</motion.span>
	);
}

function ExpressiveSurface({
	children,
	className,
	active = false,
	clip = true,
	disabled = false,
	interaction = "lift",
	size = "lg",
	radius,
	activeRadius,
	hoverRadius,
	pressedRadius,
	hoverScale,
	pressedScale,
	syncChildRadius = true,
	transitionPreset = "soft",
	transition,
	style,
	...props
}: ExpressiveSurfaceProps) {
	const expressiveState = getExpressiveState({
		active,
		disabled,
		interaction,
		size,
		radius,
		activeRadius,
		hoverRadius,
		pressedRadius,
		hoverScale,
		pressedScale,
	});
	const expressiveTransition = useExpressiveTransition(
		transitionPreset,
		transition,
	);

	return (
		<motion.div
			initial={false}
			animate={expressiveState.animate}
			whileHover={expressiveState.whileHover}
			whileTap={expressiveState.whileTap}
			transition={expressiveTransition}
			className={cn(
				"flex max-w-full transform-gpu",
				clip && "overflow-hidden",
				className,
			)}
			style={
				{
					transformOrigin: "center",
					...style,
				} as CSSProperties
			}
			{...props}
		>
			{renderExpressiveChildren(children, syncChildRadius)}
		</motion.div>
	);
}

function createExpressiveComponent<Props extends object>(
	Component: ComponentType<Props>,
	defaults?: ExpressiveWrapperProps,
) {
	const ExpressiveComponent = forwardRef<
		unknown,
		Props & { expressive?: ExpressiveWrapperProps }
	>((props, ref: ForwardedRef<unknown>) => {
		const { expressive, ...componentProps } = props;

		return (
			<ExpressiveWrapper {...defaults} {...expressive}>
				{createElement(Component, { ...componentProps, ref } as Props)}
			</ExpressiveWrapper>
		);
	});

	ExpressiveComponent.displayName = `Expressive(${
		Component.displayName ?? Component.name ?? "Component"
	})`;

	return ExpressiveComponent;
}

const MotionWrapper = ExpressiveWrapper;

export {
	ExpressiveSurface,
	ExpressiveWrapper,
	MotionWrapper,
	createExpressiveComponent,
	expressiveMotionTransitions,
	expressiveRadiusScale,
	resolveExpressiveRadius,
	useExpressiveTransition,
};
export type {
	ExpressiveBehavior,
	ExpressiveInteraction,
	ExpressiveRadius,
	ExpressiveRadiusToken,
	ExpressiveSize,
	ExpressiveSurfaceProps,
	ExpressiveTransitionKey,
	ExpressiveWrapperProps,
};
