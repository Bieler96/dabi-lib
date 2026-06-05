import { motion } from "motion/react";
import { type ComponentProps, type ReactNode } from "react";

const expressiveMotion = {
	spatialDefault: {
		type: "spring",
		stiffness: 420,
		damping: 28,
		mass: 0.7,
	},
	effectDefault: {
		type: "spring",
		stiffness: 500,
		damping: 32,
		mass: 0.5,
	},
} as const;

function MotionWrapper({
	children,
	size = "md",
	disabled = false,
	style,
	...props
}: Omit<ComponentProps<typeof motion.span>, "className"> & {
	children?: ReactNode;
	size?: "sm" | "md" | "lg";
	disabled?: boolean;
}) {
	void size;

	return (
		<motion.span
			initial={false}
			animate={{ scale: 1 }}
			whileHover={!disabled ? { scale: 1.035 } : undefined}
			whileTap={!disabled ? { scale: 0.94 } : undefined}
			transition={expressiveMotion.spatialDefault}
			style={{
				display: "inline-flex",
				overflow: "hidden",
				...style,
			}}
			{...props}
		>
			{children}
		</motion.span>
	);
}

export { MotionWrapper };
