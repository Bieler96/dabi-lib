import * as React from "react";
import { Ellipsis, Plus, X } from "lucide-react";

import { Button } from "./Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./Card";
import { Popover } from "./Popover";
import { cn } from "../utils/cn";

export interface DashboardWidgetDefinition {
	id: string;
	title: React.ReactNode;
	description?: React.ReactNode;
}

export interface DashboardWidgetRenderContext<TDashboardContext = unknown> {
	columnId: string;
	columnIndex: number;
	widgetIndex: number;
	dashboardContext?: TDashboardContext;
}

export abstract class DashboardWidget<TDashboardContext = unknown> {
	readonly id: string;
	readonly title: React.ReactNode;
	readonly description?: React.ReactNode;

	constructor(definition: DashboardWidgetDefinition) {
		this.id = definition.id;
		this.title = definition.title;
		this.description = definition.description;
	}

	abstract render(
		context: DashboardWidgetRenderContext<TDashboardContext>,
	): React.ReactNode;
}

export interface WidgetDashboardColumn<TDashboardContext = unknown> {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	widgets: DashboardWidget<TDashboardContext>[];
}

export interface WidgetDashboardProps<TDashboardContext = unknown>
	extends Omit<React.ComponentProps<"div">, "onChange"> {
	columns?: WidgetDashboardColumn<TDashboardContext>[];
	defaultColumns?: WidgetDashboardColumn<TDashboardContext>[];
	availableWidgets?: DashboardWidget<TDashboardContext>[];
	dashboardContext?: TDashboardContext;
	onColumnsChange?: (
		columns: WidgetDashboardColumn<TDashboardContext>[],
	) => void;
	columnWidth?: React.CSSProperties["width"];
	widgetMaxHeight?: React.CSSProperties["maxHeight"];
	showWidgetHeaders?: boolean;
	addColumnLabel?: React.ReactNode;
	emptyState?: React.ReactNode;
}

function createColumnId() {
	return `column-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function WidgetDashboard<TDashboardContext = unknown>({
	columns,
	defaultColumns = [],
	availableWidgets = [],
	dashboardContext,
	onColumnsChange,
	columnWidth = "420px",
	widgetMaxHeight = "calc(100dvh - 5.5rem)",
	showWidgetHeaders = false,
	addColumnLabel = "Add column",
	emptyState = "No columns yet.",
	className,
	...props
}: WidgetDashboardProps<TDashboardContext>) {
	const [internalColumns, setInternalColumns] =
		React.useState<WidgetDashboardColumn<TDashboardContext>[]>(
			defaultColumns,
		);
	const [addMenuOpen, setAddMenuOpen] = React.useState(false);
	const columnsRef = React.useRef<HTMLDivElement>(null);
	const pendingScrollColumnId = React.useRef<string | null>(null);
	const currentColumns = columns ?? internalColumns;

	React.useEffect(() => {
		if (!pendingScrollColumnId.current) {
			return;
		}

		const frame = window.requestAnimationFrame(() => {
			const columns = columnsRef.current;

			columns?.scrollTo({
				left: columns.scrollWidth,
				behavior: "smooth",
			});
			pendingScrollColumnId.current = null;
		});

		return () => window.cancelAnimationFrame(frame);
	}, [currentColumns]);

	const updateColumns = React.useCallback(
		(
			updater:
				| WidgetDashboardColumn<TDashboardContext>[]
				| ((
						columns: WidgetDashboardColumn<TDashboardContext>[],
				  ) => WidgetDashboardColumn<TDashboardContext>[]),
		) => {
			const nextColumns =
				typeof updater === "function"
					? updater(currentColumns)
					: updater;

			if (columns === undefined) {
				setInternalColumns(nextColumns);
			}

			onColumnsChange?.(nextColumns);
		},
		[columns, currentColumns, onColumnsChange],
	);

	const addColumn = React.useCallback(
		(widget?: DashboardWidget<TDashboardContext>) => {
			const columnId = createColumnId();
			pendingScrollColumnId.current = columnId;
			updateColumns((existingColumns) => [
				...existingColumns,
				{
					id: columnId,
					title: widget?.title,
					description: widget?.description,
					widgets: widget ? [widget] : [],
				},
			]);
			setAddMenuOpen(false);
		},
		[updateColumns],
	);

	const removeColumn = React.useCallback(
		(columnId: string) => {
			updateColumns((existingColumns) =>
				existingColumns.filter((column) => column.id !== columnId),
			);
		},
		[updateColumns],
	);

	const addColumnTrigger = (
		<Button
			type="button"
			variant="outline"
			size="icon-lg"
			aria-label={String(addColumnLabel)}
			className="rounded-xl bg-card shadow-lg"
		>
			<Plus />
		</Button>
	);

	const addColumnMenu = (
		<div className="flex min-w-56 flex-col gap-1">
			{availableWidgets.length > 0 ? (
				availableWidgets.map((widget) => (
					<button
						key={widget.id}
						type="button"
						data-slot="widget-dashboard-option"
						data-widget-id={widget.id}
						aria-label={`Add ${widget.id} column`}
						className="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
						onClick={() => addColumn(widget)}
					>
						<span className="block font-medium">{widget.title}</span>
						{widget.description && (
							<span className="block text-xs text-muted-foreground">
								{widget.description}
							</span>
						)}
					</button>
				))
			) : (
				<button
					type="button"
					className="rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
					onClick={() => addColumn()}
				>
					Empty column
				</button>
			)}
		</div>
	);

	return (
		<div
			data-slot="widget-dashboard"
			className={cn(
				"relative flex h-full min-h-0 overflow-hidden bg-background text-foreground",
				className,
			)}
			{...props}
		>
			{currentColumns.length > 0 ? (
				<div
					ref={columnsRef}
					data-slot="widget-dashboard-columns"
					className="flex min-h-0 flex-1 gap-2 overflow-x-auto px-6 py-0"
				>
					{currentColumns.map((column, columnIndex) => (
						<section
							key={column.id}
							data-slot="widget-dashboard-column"
							data-column-id={column.id}
							style={{ width: columnWidth }}
							className="flex max-h-full min-h-0 shrink-0 flex-col overflow-hidden rounded-2xl border border-border bg-card"
						>
							<div className="flex min-h-11 shrink-0 items-start justify-between gap-3 px-4 py-2.5">
								<div className="min-w-0">
									<h2 className="truncate text-base font-semibold leading-tight">
										{column.title ?? `Column ${columnIndex + 1}`}
									</h2>
									{column.description && (
										<p className="mt-0.5 truncate text-xs text-muted-foreground">
											{column.description}
										</p>
									)}
								</div>
								<Popover
									trigger={
										<Button
											type="button"
											variant="ghost"
											size="icon-xs"
											aria-label="Column options"
										>
											<Ellipsis />
										</Button>
									}
									content={
										<button
											type="button"
											className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm text-destructive transition-colors hover:bg-destructive/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
											onClick={() => removeColumn(column.id)}
										>
											<X className="size-3.5" />
											Remove column
										</button>
									}
									placement="bottom-end"
									className="w-44 border border-border bg-popover p-2 text-popover-foreground shadow-md"
								/>
							</div>
							<div className="flex min-h-0 flex-1 flex-col border-t border-border">
								{column.widgets.length > 0 ? (
									column.widgets.map((widget, widgetIndex) => (
										<Card
											key={widget.id}
											size="sm"
											style={{ maxHeight: widgetMaxHeight }}
											className="min-h-0 flex-1 rounded-none border-0 bg-transparent py-3 shadow-none ring-0 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-border"
										>
											{showWidgetHeaders && (
												<CardHeader>
													<CardTitle>{widget.title}</CardTitle>
													{widget.description && (
														<CardDescription>
															{widget.description}
														</CardDescription>
													)}
												</CardHeader>
											)}
											<CardContent className="min-h-0 flex-1 overflow-y-auto">
												{widget.render({
													columnId: column.id,
													columnIndex,
													widgetIndex,
													dashboardContext,
												})}
											</CardContent>
										</Card>
									))
								) : (
									<div className="m-4 rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
										Empty column
									</div>
								)}
							</div>
						</section>
					))}
					<div className="flex w-20 shrink-0 items-center justify-center">
						<Popover
							trigger={addColumnTrigger}
							content={addColumnMenu}
							open={addMenuOpen}
							onOpenChange={setAddMenuOpen}
							placement="left"
							className="w-auto border border-border bg-popover p-2 text-popover-foreground shadow-md"
						/>
					</div>
				</div>
			) : (
				<div className="m-6 flex min-h-48 flex-1 items-center justify-center rounded-2xl border border-dashed border-border p-6 text-sm text-muted-foreground">
					<div className="flex flex-col items-center gap-4">
						{emptyState}
						<Popover
							trigger={addColumnTrigger}
							content={addColumnMenu}
							open={addMenuOpen}
							onOpenChange={setAddMenuOpen}
							placement="top"
							className="w-auto border border-border bg-popover p-2 text-popover-foreground shadow-md"
						/>
					</div>
				</div>
			)}
		</div>
	);
}

export { WidgetDashboard };
