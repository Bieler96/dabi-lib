"use client";

import * as React from "react";
import type { ColumnDef } from "@tanstack/react-table";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	XAxis,
	YAxis,
} from "recharts";

import {
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
	type ChartConfig,
} from "./Chart";
import { DataTable } from "./DataTable";
import {
	Map as MapView,
	MapClusterLayer,
	MapControls,
	MapMarker,
	MarkerContent,
	MarkerPopup,
	type MapClusterMarker,
	type MapProps,
} from "./Map";
import { Skeleton } from "./Skeleton";
import { StatCard, type StatCardProps } from "./StatCard";
import { cn } from "../utils/cn";

type GenUIRecord = Record<string, unknown>;
type GenUIWidgetData<TRow extends GenUIRecord> =
	| StatCardProps
	| TRow[]
	| GenUIMapMarker[];
type GenUITableCell<TRow extends GenUIRecord> = {
	bivarianceHack(value: TRow[keyof TRow], row: TRow): React.ReactNode;
}["bivarianceHack"];

export interface GenUIWidgetBaseDefinition {
	id: string;
	title: React.ReactNode;
	description?: React.ReactNode;
}

export interface GenUIDataSource<TData> {
	data?: TData;
	fetchUrl?: string;
	fetchOptions?: RequestInit;
	fetcher?: () => TData | Promise<TData>;
	dataPath?: string;
	selectData?: (response: unknown) => TData;
}

export interface GenUIBaseWidgetDefinition<TData>
	extends GenUIWidgetBaseDefinition, GenUIDataSource<TData> {
	className?: string;
	loadingState?: React.ReactNode;
	errorState?: (error: Error) => React.ReactNode;
}

export interface GenUIStatCardDefinition extends GenUIBaseWidgetDefinition<StatCardProps> {
	type: "stat-card";
}

export interface GenUITableColumn<TRow extends GenUIRecord = GenUIRecord> {
	key: keyof TRow & string;
	header?: React.ReactNode;
	cell?: GenUITableCell<TRow>;
}

export interface GenUIDataTableDefinition<
	TRow extends GenUIRecord = GenUIRecord,
> extends GenUIBaseWidgetDefinition<TRow[]> {
	type: "data-table";
	columns?: GenUITableColumn<TRow>[];
	emptyMessage?: React.ReactNode;
	maxHeight?: React.CSSProperties["maxHeight"];
}

export interface GenUIChartSeries {
	key: string;
	label?: React.ReactNode;
	color?: string;
}

export interface GenUIChartDefinition<
	TRow extends GenUIRecord = GenUIRecord,
> extends GenUIBaseWidgetDefinition<TRow[]> {
	type: "chart";
	chartType?: "line" | "bar" | "area";
	xKey: keyof TRow & string;
	series: GenUIChartSeries[];
	height?: number | string;
	showLegend?: boolean;
}

export type GenUIMapMarker = MapClusterMarker;

export interface GenUIMapDefinition
	extends GenUIBaseWidgetDefinition<GenUIMapMarker[]> {
	type: "map";
	center?: [number, number];
	zoom?: number;
	height?: React.CSSProperties["height"];
	showControls?: boolean;
	cluster?:
		| boolean
		| {
				radius?: number;
				maxZoom?: number;
		  };
	onMarkerClick?: (marker: GenUIMapMarker) => void;
	onClusterClick?: (clusterId: number) => void;
	mapProps?: Omit<MapProps, "children" | "className" | "center" | "zoom">;
}

export type GenUIWidgetDefinition<TRow extends GenUIRecord = GenUIRecord> =
	| GenUIStatCardDefinition
	| GenUIDataTableDefinition<TRow>
	| GenUIChartDefinition<TRow>
	| GenUIMapDefinition;

interface GenUIWidgetRendererProps<TRow extends GenUIRecord = GenUIRecord> {
	definition: GenUIWidgetDefinition<TRow>;
}

type GenUIWidgetInput<TRow extends GenUIRecord = GenUIRecord> =
	| GenUIWidgetDefinition<TRow>
	| GenUIWidget<TRow>;

type GenUIResponsiveSpan = number;

export interface GenUIGridColumn<TRow extends GenUIRecord = GenUIRecord> {
	id: string;
	title?: React.ReactNode;
	description?: React.ReactNode;
	span?: GenUIResponsiveSpan;
	smSpan?: GenUIResponsiveSpan;
	mdSpan?: GenUIResponsiveSpan;
	lgSpan?: GenUIResponsiveSpan;
	widgets: GenUIWidgetInput<TRow>[];
	className?: string;
}

export interface GenUIGridRow<TRow extends GenUIRecord = GenUIRecord> {
	id: string;
	columns: GenUIGridColumn<TRow>[];
	gridColumns?: number;
	className?: string;
}

export interface GenUIGridProps<
	TRow extends GenUIRecord = GenUIRecord,
> extends React.ComponentProps<"div"> {
	rows: GenUIGridRow<TRow>[];
	gridColumns?: number;
	gap?: React.CSSProperties["gap"];
	showColumnHeaders?: boolean;
	showWidgetHeaders?: boolean;
}

function toError(error: unknown) {
	return error instanceof Error ? error : new Error(String(error));
}

function getValueAtPath(value: unknown, path?: string) {
	if (!path) {
		return value;
	}

	return path.split(".").reduce<unknown>((currentValue, key) => {
		if (currentValue === null || currentValue === undefined) {
			return undefined;
		}

		if (Array.isArray(currentValue)) {
			const index = Number(key);
			return Number.isInteger(index) ? currentValue[index] : undefined;
		}

		if (typeof currentValue === "object") {
			return (currentValue as Record<string, unknown>)[key];
		}

		return undefined;
	}, value);
}

function useGenUIData<TData>({
	data,
	fetchUrl,
	fetchOptions,
	fetcher,
	dataPath,
	selectData,
}: GenUIDataSource<TData>) {
	const [remoteData, setRemoteData] = React.useState<TData | undefined>();
	const [error, setError] = React.useState<Error | null>(null);
	const [loading, setLoading] = React.useState(Boolean(fetchUrl || fetcher));

	React.useEffect(() => {
		if (!fetchUrl && !fetcher) {
			setLoading(false);
			setRemoteData(undefined);
			setError(null);
			return;
		}

		const controller = new AbortController();
		let ignore = false;

		async function load() {
			setLoading(true);
			setError(null);

			try {
				const result = fetcher
					? await fetcher()
					: await fetch(fetchUrl as string, {
							...fetchOptions,
							signal: controller.signal,
						}).then((response) => {
							if (!response.ok) {
								throw new Error(
									`Request failed with ${response.status}`,
								);
							}

							return response.json() as Promise<unknown>;
						});

				const nextData = selectData
					? selectData(result)
					: (getValueAtPath(result, dataPath) as TData);

				if (!ignore) {
					setRemoteData(nextData);
				}
			} catch (caughtError) {
				if (!ignore && !controller.signal.aborted) {
					setError(toError(caughtError));
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		}

		void load();

		return () => {
			ignore = true;
			controller.abort();
		};
	}, [data, fetchUrl, fetchOptions, fetcher, dataPath, selectData]);

	return {
		data: data ?? remoteData,
		error,
		loading,
	};
}

function defaultLoadingState() {
	return (
		<div className="space-y-3">
			<Skeleton className="h-8 w-2/3" />
			<Skeleton className="h-32 w-full" />
		</div>
	);
}

function defaultErrorState(error: Error) {
	return (
		<div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
			{error.message}
		</div>
	);
}

function createColumns<TRow extends GenUIRecord>(
	rows: TRow[],
	columns?: GenUITableColumn<TRow>[],
): ColumnDef<TRow, unknown>[] {
	const resolvedColumns =
		columns ??
		Object.keys(rows[0] ?? {}).map<GenUITableColumn<TRow>>((key) => ({
			key: key as keyof TRow & string,
		}));

	return resolvedColumns.map((column) => ({
		accessorKey: column.key,
		header: () => column.header ?? column.key,
		cell: ({ row, getValue }) => {
			const value = getValue();

			return column.cell
				? column.cell(value as TRow[keyof TRow], row.original)
				: formatCellValue(value);
		},
	})) as ColumnDef<TRow, unknown>[];
}

function formatCellValue(value: unknown) {
	if (value === null || value === undefined) {
		return "-";
	}

	if (typeof value === "number") {
		return value.toLocaleString();
	}

	if (value instanceof Date) {
		return value.toLocaleDateString();
	}

	return String(value);
}

function GenUIDataTable<TRow extends GenUIRecord>({
	definition,
	data,
}: {
	definition: GenUIDataTableDefinition<TRow>;
	data: TRow[];
}) {
	const columns = React.useMemo(
		() => createColumns(data, definition.columns),
		[data, definition.columns],
	);

	if (data.length === 0 && definition.emptyMessage) {
		return (
			<div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
				{definition.emptyMessage}
			</div>
		);
	}

	if (definition.maxHeight) {
		return (
			<div
				className="overflow-auto"
				style={{ maxHeight: definition.maxHeight }}
			>
				<DataTable columns={columns} data={data} />
			</div>
		);
	}

	return <DataTable columns={columns} data={data} />;
}

function buildChartConfig(series: GenUIChartSeries[]) {
	return series.reduce<ChartConfig>((config, item, index) => {
		config[item.key] = {
			label: item.label ?? item.key,
			color: item.color ?? `var(--chart-${(index % 5) + 1})`,
		};

		return config;
	}, {});
}

function GenUIChart<TRow extends GenUIRecord>({
	definition,
	data,
}: {
	definition: GenUIChartDefinition<TRow>;
	data: TRow[];
}) {
	const chartConfig = React.useMemo(
		() => buildChartConfig(definition.series),
		[definition.series],
	);
	const chartType = definition.chartType ?? "line";
	const chartProps = {
		accessibilityLayer: true,
		data,
		margin: { left: 12, right: 12 },
	};
	const axes = (
		<>
			<CartesianGrid vertical={false} />
			<XAxis
				axisLine={false}
				dataKey={definition.xKey as string}
				tickLine={false}
				tickMargin={8}
			/>
			<YAxis axisLine={false} tickLine={false} tickMargin={8} />
			<ChartTooltip content={<ChartTooltipContent />} />
			{definition.showLegend !== false && (
				<ChartLegend content={<ChartLegendContent />} />
			)}
		</>
	);
	const style = definition.height ? { height: definition.height } : undefined;

	return (
		<ChartContainer
			className="min-h-[260px]"
			config={chartConfig}
			style={style}
		>
			{chartType === "bar" ? (
				<BarChart {...chartProps}>
					{axes}
					{definition.series.map((item) => (
						<Bar
							key={item.key}
							dataKey={item.key}
							fill={`var(--color-${item.key})`}
							radius={[4, 4, 0, 0]}
						/>
					))}
				</BarChart>
			) : chartType === "area" ? (
				<AreaChart {...chartProps}>
					{axes}
					{definition.series.map((item) => (
						<Area
							key={item.key}
							dataKey={item.key}
							fill={`var(--color-${item.key})`}
							fillOpacity={0.2}
							stroke={`var(--color-${item.key})`}
							type="monotone"
						/>
					))}
				</AreaChart>
			) : (
				<LineChart {...chartProps}>
					{axes}
					{definition.series.map((item) => (
						<Line
							key={item.key}
							dataKey={item.key}
							dot={false}
							stroke={`var(--color-${item.key})`}
							strokeWidth={2}
							type="monotone"
						/>
					))}
				</LineChart>
			)}
		</ChartContainer>
	);
}

function GenUIMap({
	definition,
	data,
}: {
	definition: GenUIMapDefinition;
	data: GenUIMapMarker[];
}) {
	const firstMarker = data[0];
	const center =
		definition.center ??
		(firstMarker
			? ([firstMarker.longitude, firstMarker.latitude] as [number, number])
			: ([0, 0] as [number, number]));
	const clusterOptions =
		typeof definition.cluster === "object" ? definition.cluster : {};
	const shouldCluster = definition.cluster !== false;

	return (
		<div
			className="min-h-[280px] overflow-hidden rounded-lg"
			style={{ height: definition.height ?? 360 }}
		>
			<MapView
				center={center}
				zoom={definition.zoom ?? (firstMarker ? 10 : 1)}
				{...definition.mapProps}
			>
				{definition.showControls !== false && <MapControls />}
				{shouldCluster ? (
					<MapClusterLayer
						markers={data}
						clusterRadius={clusterOptions.radius}
						clusterMaxZoom={clusterOptions.maxZoom}
						onMarkerClick={definition.onMarkerClick}
						onClusterClick={definition.onClusterClick}
					/>
				) : (
					data.map((marker, index) => (
						<MapMarker
							key={marker.id ?? index}
							longitude={marker.longitude}
							latitude={marker.latitude}
						>
							<MarkerContent />
							{(marker.title || marker.description) && (
								<MarkerPopup>
									<div className="space-y-1">
										{marker.title && (
											<div className="font-medium">
												{marker.title}
											</div>
										)}
										{marker.description && (
											<div className="text-muted-foreground">
												{marker.description}
											</div>
										)}
									</div>
								</MarkerPopup>
							)}
						</MapMarker>
					))
				)}
			</MapView>
		</div>
	);
}

function resolveWidgetDefinition<TRow extends GenUIRecord>(
	widget: GenUIWidgetInput<TRow>,
) {
	return widget instanceof GenUIWidget ? widget.definition : widget;
}

function GenUIWidgetRenderer<TRow extends GenUIRecord = GenUIRecord>({
	definition,
}: GenUIWidgetRendererProps<TRow>) {
	const { data, error, loading } = useGenUIData<GenUIWidgetData<TRow>>(
		definition as GenUIDataSource<GenUIWidgetData<TRow>>,
	);

	if (loading) {
		return definition.loadingState ?? defaultLoadingState();
	}

	if (error) {
		return definition.errorState?.(error) ?? defaultErrorState(error);
	}

	if (definition.type === "stat-card") {
		return (
			<StatCard
				size="sm"
				{...((data ?? definition.data) as StatCardProps)}
			/>
		);
	}

	if (definition.type === "data-table") {
		return (
			<GenUIDataTable
				definition={definition}
				data={(data ?? definition.data ?? []) as TRow[]}
			/>
		);
	}

	if (definition.type === "map") {
		return (
			<GenUIMap
				definition={definition}
				data={(data ?? definition.data ?? []) as GenUIMapMarker[]}
			/>
		);
	}

	return (
		<GenUIChart
			definition={definition}
			data={(data ?? definition.data ?? []) as TRow[]}
		/>
	);
}

function GenUIWidgetFrame<TRow extends GenUIRecord = GenUIRecord>({
	definition,
	showHeader,
}: {
	definition: GenUIWidgetDefinition<TRow>;
	showHeader?: boolean;
}) {
	const content = <GenUIWidgetRenderer definition={definition} />;

	if (definition.type === "stat-card") {
		return (
			<div className={cn("min-w-0", definition.className)}>{content}</div>
		);
	}

	return (
		<div
			data-slot="gen-ui-widget"
			className={cn(
				"min-w-0 overflow-hidden rounded-xl border border-border bg-card p-3 text-card-foreground",
				definition.className,
			)}
		>
			{showHeader && (
				<div className="mb-3 min-w-0">
					<h3 className="truncate text-sm font-medium">
						{definition.title}
					</h3>
					{definition.description && (
						<p className="mt-0.5 truncate text-xs text-muted-foreground">
							{definition.description}
						</p>
					)}
				</div>
			)}
			{content}
		</div>
	);
}

function GenUIGrid<TRow extends GenUIRecord = GenUIRecord>({
	rows,
	gridColumns = 12,
	gap = "1rem",
	showColumnHeaders = false,
	showWidgetHeaders = false,
	className,
	style,
	...props
}: GenUIGridProps<TRow>) {
	return (
		<div
			data-slot="gen-ui-grid"
			className={cn("flex min-w-0 flex-col", className)}
			style={{ gap, ...style }}
			{...props}
		>
			{rows.map((row) => (
				<div
					key={row.id}
					data-slot="gen-ui-grid-row"
					className={cn("grid min-w-0", row.className)}
					style={
						{
							"--gen-ui-grid-columns":
								row.gridColumns ?? gridColumns,
							"--gen-ui-grid-gap": gap,
						} as React.CSSProperties
					}
				>
					{row.columns.map((column) => (
						<section
							key={column.id}
							data-slot="gen-ui-grid-column"
							className={cn(
								"min-w-0 space-y-3",
								column.className,
							)}
							style={
								{
									"--gen-ui-column-span-base":
										row.gridColumns ?? gridColumns,
									"--gen-ui-column-span-sm":
										column.smSpan ??
										row.gridColumns ??
										gridColumns,
									"--gen-ui-column-span-md":
										column.mdSpan ??
										column.span ??
										row.gridColumns ??
										gridColumns,
									"--gen-ui-column-span-lg":
										column.lgSpan ??
										column.mdSpan ??
										column.span ??
										row.gridColumns ??
										gridColumns,
								} as React.CSSProperties
							}
						>
							{showColumnHeaders &&
								(column.title || column.description) && (
									<div className="min-w-0">
										{column.title && (
											<h2 className="truncate text-base font-semibold">
												{column.title}
											</h2>
										)}
										{column.description && (
											<p className="mt-0.5 truncate text-sm text-muted-foreground">
												{column.description}
											</p>
										)}
									</div>
								)}
							{column.widgets.map((widget) => {
								const definition =
									resolveWidgetDefinition(widget);

								return (
									<GenUIWidgetFrame
										key={definition.id}
										definition={definition}
										showHeader={showWidgetHeaders}
									/>
								);
							})}
						</section>
					))}
				</div>
			))}
		</div>
	);
}

export class GenUIWidget<TRow extends GenUIRecord = GenUIRecord> {
	readonly definition: GenUIWidgetDefinition<TRow>;
	readonly id: string;
	readonly title: React.ReactNode;
	readonly description?: React.ReactNode;

	constructor(definition: GenUIWidgetDefinition<TRow>) {
		this.definition = definition;
		this.id = definition.id;
		this.title = definition.title;
		this.description = definition.description;
	}

	render(): React.ReactNode {
		return (
			<div className={cn("min-w-0", this.definition.className)}>
				<GenUIWidgetRenderer definition={this.definition} />
			</div>
		);
	}
}

export { GenUIGrid, GenUIWidgetFrame, GenUIWidgetRenderer };
