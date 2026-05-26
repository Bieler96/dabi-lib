import {
	closestCorners,
	DndContext,
	DragOverlay,
	useDroppable,
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	type UniqueIdentifier,
} from "@dnd-kit/core";
import {
	arrayMove,
	rectSortingStrategy,
	SortableContext,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { Meta, StoryObj } from "@storybook/react";
import { GripVertical } from "lucide-react";
import * as React from "react";

import {
	SortableDragHandle,
	SortableItem,
	SortableList,
} from "../components/DragAndDrop";
import { List } from "../components/List";

const meta: Meta<typeof SortableList> = {
	title: "Components/DragAndDrop",
	component: SortableList,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof SortableList>;

const defaultTasks = [
	{
		id: "briefing",
		title: "Briefing lesen",
		description: "Ziele und Rahmenbedingungen klaeren",
	},
	{
		id: "wireframe",
		title: "Wireframe bauen",
		description: "Erste Struktur fuer die wichtigsten Screens",
	},
	{
		id: "handoff",
		title: "Handoff vorbereiten",
		description: "Assets, Komponenten und offene Fragen sammeln",
	},
];

const boardColumns = {
	backlog: [
		{
			id: "scope",
			title: "Scope pruefen",
			description: "Offene Anforderungen sammeln",
		},
		{
			id: "copy",
			title: "Texte finalisieren",
			description: "Headlines und CTA-Texte abstimmen",
		},
	],
	active: [
		{
			id: "visuals",
			title: "Visuals auswaehlen",
			description: "Bildwelt und Icons festlegen",
		},
		{
			id: "qa",
			title: "QA vorbereiten",
			description: "Checkliste fuer Review erstellen",
		},
	],
};

const gridItems = [
	{ id: "hero", label: "Hero" },
	{ id: "features", label: "Features" },
	{ id: "pricing", label: "Pricing" },
	{ id: "faq", label: "FAQ" },
	{ id: "footer", label: "Footer" },
	{ id: "contact", label: "Contact" },
];

type Task = (typeof defaultTasks)[number];
type ColumnId = keyof typeof boardColumns;

const columnEntries = [
	["backlog", "Backlog"],
	["active", "In Arbeit"],
] as const;

function findColumnId(
	columns: Record<ColumnId, Task[]>,
	id: UniqueIdentifier,
) {
	if (id in columns) {
		return id as ColumnId;
	}

	return Object.keys(columns).find((columnId) =>
		columns[columnId as ColumnId].some((item) => item.id === id),
	) as ColumnId | undefined;
}

function findTask(columns: Record<ColumnId, Task[]>, id: UniqueIdentifier) {
	return Object.values(columns)
		.flat()
		.find((task) => task.id === id);
}

function TaskCard({ task, dragging }: { task: Task; dragging?: boolean }) {
	return (
		<List>
			<List.Item>
				<List.Leading>
					{dragging ? (
						<div className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground">
							<GripVertical size={16} />
						</div>
					) : (
						<SortableDragHandle aria-label={`${task.title} verschieben`}>
							<GripVertical size={16} />
						</SortableDragHandle>
					)}
				</List.Leading>
				<List.Content>
					<List.Title>{task.title}</List.Title>
					<List.Description>{task.description}</List.Description>
				</List.Content>
			</List.Item>
		</List>
	);
}

function BoardColumn({
	id,
	title,
	tasks,
}: {
	id: ColumnId;
	title: string;
	tasks: Task[];
}) {
	const { setNodeRef } = useDroppable({ id });

	return (
		<div className="min-w-0">
			<div className="mb-2 text-sm font-medium">{title}</div>
			<SortableContext
				items={tasks.map((item) => item.id)}
				strategy={verticalListSortingStrategy}
			>
				<div
					ref={setNodeRef}
					className="flex min-h-48 flex-col gap-2 rounded-xl border bg-muted/30 p-2"
				>
					{tasks.map((task) => (
						<SortableItem key={task.id} id={task.id}>
							<TaskCard task={task} />
						</SortableItem>
					))}
				</div>
			</SortableContext>
		</div>
	);
}

export const SortableListExample: Story = {
	render: () => {
		const [tasks, setTasks] = React.useState(defaultTasks);

		return (
			<div className="w-115">
				<SortableList
					items={tasks}
					getItemId={(task) => task.id}
					onItemsChange={setTasks}
				>
					{(task) => (
						<List>
							<List.Item>
								<List.Leading>
									<SortableDragHandle aria-label={`${task.title} verschieben`}>
										<GripVertical size={16} />
									</SortableDragHandle>
								</List.Leading>
								<List.Content>
									<List.Title>{task.title}</List.Title>
									<List.Description>{task.description}</List.Description>
								</List.Content>
							</List.Item>
						</List>
					)}
				</SortableList>
			</div>
		);
	},
};

export const TwoLists: Story = {
	render: () => {
		const [columns, setColumns] = React.useState(boardColumns);
		const [activeId, setActiveId] =
			React.useState<UniqueIdentifier | null>(null);
		const activeTask = activeId ? findTask(columns, activeId) : undefined;

		function handleDragStart(event: DragStartEvent) {
			setActiveId(event.active.id);
		}

		function handleDragOver(event: DragOverEvent) {
			const { active, over } = event;

			if (!over) {
				return;
			}

			setColumns((currentColumns) => {
				const fromColumnId = findColumnId(currentColumns, active.id);
				const toColumnId = findColumnId(currentColumns, over.id);

				if (!fromColumnId || !toColumnId || fromColumnId === toColumnId) {
					return currentColumns;
				}

				const fromItems = currentColumns[fromColumnId];
				const toItems = currentColumns[toColumnId];
				const fromIndex = fromItems.findIndex((item) => item.id === active.id);
				const activeItem = fromItems[fromIndex];

				if (!activeItem) {
					return currentColumns;
				}

				const overIndex = toItems.findIndex((item) => item.id === over.id);

				if (fromColumnId === toColumnId) {
					if (overIndex < 0 || fromIndex === overIndex) {
						return currentColumns;
					}

					return {
						...currentColumns,
						[fromColumnId]: arrayMove(fromItems, fromIndex, overIndex),
					};
				}

				const insertIndex = overIndex >= 0 ? overIndex : toItems.length;

				return {
					...currentColumns,
					[fromColumnId]: fromItems.filter((item) => item.id !== active.id),
					[toColumnId]: [
						...toItems.slice(0, insertIndex),
						activeItem,
						...toItems.slice(insertIndex),
					],
				};
			});
		}

		function handleDragEnd(event: DragEndEvent) {
			const { active, over } = event;

			if (!over) {
				setActiveId(null);
				return;
			}

			const fromColumnId = findColumnId(columns, active.id);
			const toColumnId = findColumnId(columns, over.id);

			if (!fromColumnId || !toColumnId) {
				setActiveId(null);
				return;
			}

			const fromItems = columns[fromColumnId];
			const toItems = columns[toColumnId];
			const fromIndex = fromItems.findIndex((item) => item.id === active.id);
			const overIndex = toItems.findIndex((item) => item.id === over.id);

			if (fromIndex < 0 || overIndex < 0) {
				setActiveId(null);
				return;
			}

			if (fromColumnId === toColumnId) {
				setColumns((currentColumns) => {
					const currentItems = currentColumns[fromColumnId];
					const currentFromIndex = currentItems.findIndex(
						(item) => item.id === active.id,
					);
					const currentOverIndex = currentItems.findIndex(
						(item) => item.id === over.id,
					);

					if (
						currentFromIndex < 0 ||
						currentOverIndex < 0 ||
						currentFromIndex === currentOverIndex
					) {
						return currentColumns;
					}

					return {
						...currentColumns,
						[fromColumnId]: arrayMove(
							currentItems,
							currentFromIndex,
							currentOverIndex,
						),
					};
				});
				setActiveId(null);
				return;
			}

			setActiveId(null);
		}

		return (
			<DndContext
				collisionDetection={closestCorners}
				onDragStart={handleDragStart}
				onDragOver={handleDragOver}
				onDragEnd={handleDragEnd}
				onDragCancel={() => setActiveId(null)}
			>
				<div className="grid w-190 grid-cols-2 gap-4">
					{columnEntries.map(([columnId, title]) => (
						<BoardColumn
							key={columnId}
							id={columnId}
							title={title}
							tasks={columns[columnId]}
						/>
					))}
				</div>
				<DragOverlay>
					{activeTask ? (
						<div className="w-90 cursor-grabbing shadow-xl">
							<TaskCard task={activeTask} dragging />
						</div>
					) : null}
				</DragOverlay>
			</DndContext>
		);
	},
};

export const Grid: Story = {
	render: () => {
		const [items, setItems] = React.useState(gridItems);

		return (
			<div className="w-125">
				<SortableList
					items={items}
					getItemId={(item) => item.id}
					onItemsChange={setItems}
					strategy={rectSortingStrategy}
					className="grid grid-cols-3 gap-3"
				>
					{(item) => (
						<div className="flex aspect-square flex-col justify-between rounded-xl border bg-card p-3 text-card-foreground shadow-sm">
							<SortableDragHandle aria-label={`${item.label} verschieben`}>
								<GripVertical size={16} />
							</SortableDragHandle>
							<div className="text-sm font-medium">{item.label}</div>
						</div>
					)}
				</SortableList>
			</div>
		);
	},
};
