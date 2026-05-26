import {
	closestCenter,
	DndContext,
	KeyboardSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
	type DndContextProps,
	type DragEndEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core";
import {
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
	type SortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as React from "react";

import { cn } from "../utils/cn";
import { reorderItems } from "../utils/dnd";

type SortableRenderProps = {
	id: UniqueIdentifier;
	index: number;
	isDragging: boolean;
};

type SortableItemContextValue = {
	attributes: ReturnType<typeof useSortable>["attributes"];
	listeners: ReturnType<typeof useSortable>["listeners"];
	setActivatorNodeRef: ReturnType<typeof useSortable>["setActivatorNodeRef"];
	isDragging: boolean;
};

const SortableItemContext =
	React.createContext<SortableItemContextValue | null>(null);

type SortableListProps<T> = Omit<
	React.ComponentProps<"div">,
	"children" | "onChange"
> & {
	items: T[];
	getItemId: (item: T) => UniqueIdentifier;
	onItemsChange?: (items: T[], event: DragEndEvent) => void;
	onReorder?: (event: {
		activeId: UniqueIdentifier;
		overId: UniqueIdentifier;
		oldIndex: number;
		newIndex: number;
		items: T[];
	}) => void;
	children: (item: T, props: SortableRenderProps) => React.ReactNode;
	disabled?: boolean;
	strategy?: SortingStrategy;
	contextProps?: Omit<
		DndContextProps,
		"children" | "collisionDetection" | "onDragEnd" | "sensors"
	>;
};

function SortableList<T>({
	items,
	getItemId,
	onItemsChange,
	onReorder,
	children,
	className,
	disabled,
	strategy = verticalListSortingStrategy,
	contextProps,
	...props
}: SortableListProps<T>) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 6,
			},
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 150,
				tolerance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);
	const ids = React.useMemo(() => items.map(getItemId), [getItemId, items]);

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = ids.indexOf(active.id);
		const newIndex = ids.indexOf(over.id);

		if (oldIndex < 0 || newIndex < 0) {
			return;
		}

		const nextItems = reorderItems(items, active.id, over.id, getItemId);

		onItemsChange?.(nextItems, event);
		onReorder?.({
			activeId: active.id,
			overId: over.id,
			oldIndex,
			newIndex,
			items: nextItems,
		});
	}

	return (
		<DndContext
			collisionDetection={closestCenter}
			sensors={disabled ? undefined : sensors}
			onDragEnd={handleDragEnd}
			{...contextProps}
		>
			<SortableContext items={ids} strategy={strategy} disabled={disabled}>
				<div
					data-slot="sortable-list"
					className={cn("flex flex-col gap-2", className)}
					{...props}
				>
					{items.map((item, index) => {
						const id = getItemId(item);

						return (
							<SortableItem key={String(id)} id={id} disabled={disabled}>
								{({ isDragging }) =>
									children(item, { id, index, isDragging })
								}
							</SortableItem>
						);
					})}
				</div>
			</SortableContext>
		</DndContext>
	);
}

type SortableItemProps = Omit<React.ComponentProps<"div">, "children" | "id"> & {
	id: UniqueIdentifier;
	children:
		| React.ReactNode
		| ((props: { isDragging: boolean }) => React.ReactNode);
	disabled?: boolean;
};

function SortableItem({
	id,
	children,
	className,
	disabled,
	...props
}: SortableItemProps) {
	const {
		attributes,
		isDragging,
		listeners,
		setActivatorNodeRef,
		setNodeRef,
		transform,
		transition,
	} = useSortable({ id, disabled });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		...props.style,
	};
	const context = React.useMemo<SortableItemContextValue>(
		() => ({
			attributes,
			listeners,
			setActivatorNodeRef,
			isDragging,
		}),
		[attributes, listeners, setActivatorNodeRef, isDragging],
	);

	return (
		<SortableItemContext.Provider value={context}>
			<div
				ref={setNodeRef}
				data-slot="sortable-item"
				data-dragging={isDragging ? "" : undefined}
				className={cn(
					"touch-manipulation transition-shadow data-dragging:z-10 data-dragging:opacity-70",
					className,
				)}
				{...props}
				style={style}
			>
				{typeof children === "function" ? children({ isDragging }) : children}
			</div>
		</SortableItemContext.Provider>
	);
}

type SortableDragHandleProps = React.ComponentProps<"button">;

function SortableDragHandle({
	className,
	type = "button",
	...props
}: SortableDragHandleProps) {
	const context = React.useContext(SortableItemContext);

	if (!context) {
		throw new Error("SortableDragHandle must be used inside SortableItem.");
	}

	return (
		<button
			ref={context.setActivatorNodeRef}
			type={type}
			data-slot="sortable-drag-handle"
			data-dragging={context.isDragging ? "" : undefined}
			className={cn(
				"inline-flex size-8 cursor-grab touch-none items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50",
				className,
			)}
			{...context.attributes}
			{...context.listeners}
			{...props}
		/>
	);
}

export { SortableDragHandle, SortableItem, SortableList };
export type { SortableItemProps, SortableListProps };
