import { motion } from "motion/react";
import { useCursor } from "./useCursor";
import "./cursor.css";

export function Cursor() {
	const cursor = useCursor();

	return (
		<motion.div
			className={`custom-cursor custom-cursor--${cursor.variant}`}
			style={cursor.style}
		/>
	);
}
