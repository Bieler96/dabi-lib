import { useEffect, useRef, useState } from "react";
import { useMotionValue, useSpring } from "motion/react";

type CursorVariant = "default" | "magnetic" | "grow";

export function useCursor() {
	const hoveredElement = useRef<HTMLElement | null>(null);
	const pointer = useRef({ x: 0, y: 0 });

	const [variant, setVariant] = useState<CursorVariant>("default");

	const x = useMotionValue(0);
	const y = useMotionValue(0);
	const width = useMotionValue(22);
	const height = useMotionValue(22);
	const radius = useMotionValue(999);

	const springX = useSpring(x, { stiffness: 1800, damping: 70, mass: 0.25 });
	const springY = useSpring(y, { stiffness: 1800, damping: 70, mass: 0.25 });

	const springWidth = useSpring(width, {
		stiffness: 1200,
		damping: 55,
		mass: 0.25,
	});
	const springHeight = useSpring(height, {
		stiffness: 1200,
		damping: 55,
		mass: 0.25,
	});
	const springRadius = useSpring(radius, {
		stiffness: 1200,
		damping: 55,
		mass: 0.25,
	});

	const scale = useMotionValue(1);

	const springScale = useSpring(scale, {
		stiffness: 1400,
		damping: 45,
		mass: 0.2,
	});

	useEffect(() => {
		const updateFromElement = (element: HTMLElement) => {
			const rect = element.getBoundingClientRect();

			const cursorVariant =
				(element.dataset.cursorVariant as CursorVariant | undefined) ??
				"magnetic";

			setVariant(cursorVariant);

			if (cursorVariant === "grow") {
				x.set(pointer.current.x);
				y.set(pointer.current.y);
				width.set(42);
				height.set(42);
				radius.set(999);
			} else {
				x.set(rect.left + rect.width / 2);
				y.set(rect.top + rect.height / 2);
				width.set(rect.width + 14);
				height.set(rect.height + 14);
				radius.set(Number(element.dataset.cursorRadius ?? 18));
			}
		};

		const updateDefault = () => {
			x.set(pointer.current.x);
			y.set(pointer.current.y);
			width.set(22);
			height.set(22);
			radius.set(999);
			setVariant("default");
		};

		const onPointerMove = (event: PointerEvent) => {
			pointer.current = {
				x: event.clientX,
				y: event.clientY,
			};

			const target = event.target as HTMLElement;
			const element = target.closest<HTMLElement>("[data-cursor]");

			hoveredElement.current = element;

			if (element) {
				updateFromElement(element);
			} else {
				updateDefault();
			}
		};

		const onScrollOrResize = () => {
			const element = hoveredElement.current;

			if (element) {
				updateFromElement(element);
			} else {
				updateDefault();
			}
		};

		const onPointerDown = () => {
			scale.set(0.82);
		};

		const onPointerUp = () => {
			scale.set(1);
		};

		window.addEventListener("pointermove", onPointerMove);
		window.addEventListener("scroll", onScrollOrResize, true);
		window.addEventListener("resize", onScrollOrResize);
		window.addEventListener("pointerdown", onPointerDown);
		window.addEventListener("pointerup", onPointerUp);
		window.addEventListener("pointercancel", onPointerUp);

		return () => {
			window.removeEventListener("pointermove", onPointerMove);
			window.removeEventListener("scroll", onScrollOrResize, true);
			window.removeEventListener("resize", onScrollOrResize);
			window.removeEventListener("pointerdown", onPointerDown);
			window.removeEventListener("pointerup", onPointerUp);
			window.removeEventListener("pointercancel", onPointerUp);
		};
	}, [x, y, width, height, radius]);

	return {
		variant,
		style: {
			x: springX,
			y: springY,
			width: springWidth,
			height: springHeight,
			borderRadius: springRadius,
			scale: springScale,
		},
	};
}
