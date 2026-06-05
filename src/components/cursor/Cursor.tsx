import { motion } from "motion/react";
import { useCursor } from "./useCursor";
// import "./cursor.css";
import {
	Grip,
	Move,
	Play,
	Plus,
	Search,
	ZoomIn,
	type LucideIcon,
} from "lucide-react";

const icons: Record<string, LucideIcon> = {
	grip: Grip,
	move: Move,
	play: Play,
	plus: Plus,
	search: Search,
	zoom: ZoomIn,
};

export function Cursor() {
	const cursor = useCursor();
	const Icon = cursor.icon ? icons[cursor.icon] : null;

	return (
		<motion.div
			className={`custom-cursor custom-cursor--${cursor.variant}`}
			style={cursor.style}
		>
			{cursor.variant === "icon" && Icon && (
				<motion.div
					className="cursor__icon"
					initial={false}
					animate={{
						scale: 1,
						opacity: 1,
					}}
				>
					<Icon size={20} strokeWidth={2.2} />
				</motion.div>
			)}
		</motion.div>
	);
}
