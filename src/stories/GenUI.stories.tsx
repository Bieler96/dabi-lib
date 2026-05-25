import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Activity,
	AlertTriangle,
	CheckCircle2,
	CreditCard,
	RadioTower,
	TrendingUp,
	Users,
} from "lucide-react";

import type { FormBuilderField } from "../components/FormBuilder";
import { GenUIGrid, GenUIWidget, type GenUIGridRow } from "../components/GenUI";

type RevenueRow = {
	month: string;
	revenue: number;
	expenses: number;
	customers: number;
	status?: string;
};

type DummyUser = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	age: number;
	role: string;
	company?: {
		name?: string;
	};
};

type LeadFormValues = {
	name: string;
	email: string;
	plan: string;
	message: string;
	newsletter: boolean;
};

type OtelLogRow = {
	id: string;
	timestamp: string;
	severity: "INFO" | "WARN" | "ERROR";
	service: string;
	message: string;
	traceId: string;
	spanId: string;
	environment: string;
	attributes: string;
	latencyMs: number;
};

const leadFields: FormBuilderField<LeadFormValues>[] = [
	{
		name: "name",
		label: "Name",
		placeholder: "Jane Doe",
		required: true,
	},
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "jane@example.com",
		required: true,
	},
	{
		name: "plan",
		type: "select",
		label: "Plan",
		placeholder: "Plan auswaehlen",
		options: [
			{ value: "starter", label: "Starter" },
			{ value: "growth", label: "Growth" },
			{ value: "enterprise", label: "Enterprise" },
		],
	},
	{
		name: "message",
		type: "textarea",
		label: "Nachricht",
		placeholder: "Was soll als Naechstes passieren?",
	},
	{
		name: "newsletter",
		type: "checkbox",
		label: "Produktupdates erhalten",
	},
];

const revenueData: RevenueRow[] = [
	{ month: "Jan", revenue: 18600, expenses: 9800, customers: 120 },
	{ month: "Feb", revenue: 22400, expenses: 11100, customers: 142 },
	{ month: "Mar", revenue: 24800, expenses: 12300, customers: 158 },
	{ month: "Apr", revenue: 29100, expenses: 14700, customers: 181 },
	{ month: "May", revenue: 32600, expenses: 16300, customers: 204 },
	{ month: "Jun", revenue: 35400, expenses: 17100, customers: 229 },
];

const otelLogData: OtelLogRow[] = [
	{
		id: "log-1001",
		timestamp: "2026-05-25 09:41:12.245",
		severity: "INFO",
		service: "checkout-api",
		message: "Payment intent created",
		traceId: "4f6b2a8d0c9e41b7a612ef34d88c9012",
		spanId: "7c9a21ef102ab883",
		environment: "production",
		attributes: "http.method=POST, http.route=/checkout",
		latencyMs: 142,
	},
	{
		id: "log-1002",
		timestamp: "2026-05-25 09:41:13.018",
		severity: "WARN",
		service: "inventory-worker",
		message: "Stock reservation retry scheduled",
		traceId: "91ca640cf3ab4f1db3c258e6cb7ed6a9",
		spanId: "5fe27d6b93a045aa",
		environment: "production",
		attributes: "messaging.system=kafka, retry.count=2",
		latencyMs: 390,
	},
	{
		id: "log-1003",
		timestamp: "2026-05-25 09:41:15.774",
		severity: "ERROR",
		service: "billing-service",
		message: "Invoice export failed",
		traceId: "0ec3e45db4c74cf6b18e6b63246fd4b0",
		spanId: "e317d1a4d55b42c0",
		environment: "production",
		attributes: "exception.type=TimeoutError, peer.service=sap",
		latencyMs: 1840,
	},
	{
		id: "log-1004",
		timestamp: "2026-05-25 09:41:18.603",
		severity: "INFO",
		service: "frontend-web",
		message: "Order confirmation rendered",
		traceId: "4f6b2a8d0c9e41b7a612ef34d88c9012",
		spanId: "2f7dd8c8b114c9e1",
		environment: "production",
		attributes: "browser.name=Chrome, user.segment=business",
		latencyMs: 86,
	},
	{
		id: "log-1005",
		timestamp: "2026-05-25 09:41:22.117",
		severity: "WARN",
		service: "auth-service",
		message: "Token refresh nearing rate limit",
		traceId: "c7fd62f0ec874cf4a244f70e196e0d21",
		spanId: "10bf231ca44dcf2e",
		environment: "production",
		attributes: "enduser.id=usr_4218, rate.limit.remaining=8",
		latencyMs: 232,
	},
];

const otelLogVolumeData = [
	{ minute: "09:36", info: 188, warn: 21, error: 2 },
	{ minute: "09:37", info: 214, warn: 18, error: 3 },
	{ minute: "09:38", info: 201, warn: 27, error: 4 },
	{ minute: "09:39", info: 236, warn: 31, error: 5 },
	{ minute: "09:40", info: 248, warn: 26, error: 3 },
	{ minute: "09:41", info: 259, warn: 34, error: 7 },
];

const berlinMarkers = [
	{
		id: "alexanderplatz",
		longitude: 13.4132,
		latitude: 52.5219,
		title: "Alexanderplatz",
		description: "High-traffic city center location",
	},
	{
		id: "hackescher-markt",
		longitude: 13.4024,
		latitude: 52.5222,
		title: "Hackescher Markt",
		description: "Retail and transit cluster",
	},
	{
		id: "potsdamer-platz",
		longitude: 13.3769,
		latitude: 52.5096,
		title: "Potsdamer Platz",
		description: "Office and shopping area",
	},
	{
		id: "kreuzberg",
		longitude: 13.4314,
		latitude: 52.4991,
		title: "Kreuzberg",
		description: "Dense neighborhood demand",
	},
	{
		id: "charlottenburg",
		longitude: 13.3041,
		latitude: 52.5166,
		title: "Charlottenburg",
		description: "Western Berlin coverage",
	},
	{
		id: "neukoelln",
		longitude: 13.4499,
		latitude: 52.4811,
		title: "Neukoelln",
		description: "Growing delivery zone",
	},
];

const berlinGeoJson = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: { name: "Central service area" },
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[13.36, 52.532],
						[13.448, 52.532],
						[13.448, 52.486],
						[13.36, 52.486],
						[13.36, 52.532],
					],
				],
			},
		},
		{
			type: "Feature",
			properties: { name: "High-demand corridor" },
			geometry: {
				type: "LineString",
				coordinates: [
					[13.3769, 52.5096],
					[13.405, 52.52],
					[13.4314, 52.4991],
				],
			},
		},
	],
} satisfies GeoJSON.FeatureCollection;

const revenueStat = new GenUIWidget<RevenueRow>({
	id: "revenue-stat",
	type: "stat-card",
	title: "Revenue",
	description: "Current month",
	data: {
		label: "Revenue",
		value: "35.400 EUR",
		icon: <CreditCard className="size-4" />,
		trend: {
			value: "+8.6%",
			direction: "up",
			label: "vs. last month",
		},
	},
});

const customerStat = new GenUIWidget<RevenueRow>({
	id: "customer-stat",
	type: "stat-card",
	title: "Customers",
	description: "Active accounts",
	data: {
		label: "Customers",
		value: "229",
		icon: <Users className="size-4" />,
		trend: {
			value: "+25",
			direction: "up",
			label: "new this month",
		},
	},
});

const revenueChart = new GenUIWidget<RevenueRow>({
	id: "revenue-chart",
	type: "chart",
	title: "Revenue chart",
	description: "Revenue and expenses",
	chartType: "area",
	xKey: "month",
	data: revenueData,
	series: [
		{ key: "revenue", label: "Revenue", color: "var(--chart-1)" },
		{ key: "expenses", label: "Expenses", color: "var(--chart-2)" },
	],
});

const revenueTable = new GenUIWidget<RevenueRow>({
	id: "revenue-table",
	type: "data-table",
	title: "Revenue table",
	description: "Monthly details",
	data: revenueData,
	columns: [
		{ key: "month", header: "Month" },
		{
			key: "revenue",
			header: "Revenue",
			cell: (value) => `${Number(value).toLocaleString()} EUR`,
		},
		{
			key: "expenses",
			header: "Expenses",
			cell: (value) => `${Number(value).toLocaleString()} EUR`,
		},
		{ key: "customers", header: "Customers" },
	],
});

const revenueList = new GenUIWidget<RevenueRow>({
	id: "revenue-list",
	type: "list",
	title: "Revenue list",
	description: "Monthly highlights",
	data: revenueData.map((item) => ({
		...item,
		status: item.revenue > item.expenses * 2 ? "Healthy" : "Review",
	})),
	itemKey: "month",
	titleKey: "month",
	descriptionKey: "status",
	metaKey: "revenue",
	leading: () => <TrendingUp className="size-4" />,
	emptyMessage: "No revenue rows available.",
	dialogDrawer: {
		title: (row) => `${row.month} revenue`,
		description: (row) => `${row.customers} customers in this month`,
		children: (row) => (
			<div className="space-y-2 px-4 pb-4 text-sm md:px-0">
				<div className="flex justify-between gap-4">
					<span className="text-muted-foreground">Revenue</span>
					<span className="font-medium">
						{row.revenue.toLocaleString()} EUR
					</span>
				</div>
				<div className="flex justify-between gap-4">
					<span className="text-muted-foreground">Expenses</span>
					<span className="font-medium">
						{row.expenses.toLocaleString()} EUR
					</span>
				</div>
			</div>
		),
	},
});

const locationsMap = new GenUIWidget<RevenueRow>({
	id: "locations-map",
	type: "map",
	title: "Locations map",
	description: "Markers with clustering",
	center: [13.405, 52.52],
	zoom: 10,
	height: 420,
	cluster: {
		radius: 56,
		maxZoom: 13,
	},
	data: berlinMarkers,
});

const geoJsonMap = new GenUIWidget<RevenueRow>({
	id: "geojson-map",
	type: "map",
	title: "GeoJSON map",
	description: "Polygon and line features",
	center: [13.405, 52.51],
	zoom: 11,
	height: 420,
	data: berlinGeoJson,
	geoJsonLayer: {
		fillColor: "#0ea5e9",
		lineColor: "#0369a1",
		pointColor: "#0f766e",
	},
});

const leadForm = new GenUIWidget<LeadFormValues>({
	id: "lead-form",
	type: "form-builder",
	title: "Lead form",
	description: "FormBuilder embedded in GenUI",
	fields: leadFields,
	defaultValues: {
		plan: "growth",
		newsletter: true,
	},
	submitLabel: "Absenden",
	showReset: true,
	resetLabel: "Zuruecksetzen",
	onSubmit: (values) => console.log(values),
});

const liveStat = new GenUIWidget<RevenueRow>({
	id: "live-stat",
	type: "stat-card",
	title: "Fetched metric",
	description: "Uses fetcher",
	fetcher: async () => ({
		label: "Live requests",
		value: "12.840",
		icon: <Activity className="size-4" />,
		trend: {
			value: "+4.1%",
			direction: "up",
			label: "today",
		},
	}),
});

const detailsDialog = new GenUIWidget<RevenueRow>({
	id: "details-dialog",
	type: "dynamic-dialog-drawer",
	title: "Revenue details",
	description: "Opens as a dialog on desktop and a drawer on mobile",
	triggerLabel: "Open revenue details",
	triggerProps: {
		variant: "outline",
	},
	showWidgetHeaders: true,
	widgets: [revenueStat, customerStat, revenueChart],
	children: (
		<div className="px-4 pb-4 text-sm text-muted-foreground md:px-0">
			Review the latest revenue, customer growth, and monthly trend in one
			responsive overlay.
		</div>
	),
});

const usersTable = new GenUIWidget<DummyUser>({
	id: "dummy-users",
	type: "data-table",
	title: "DummyJSON users",
	description: "Fetched from https://dummyjson.com/users",
	fetchUrl: "https://dummyjson.com/users?limit=30",
	selectData: (response) =>
		(Array.isArray((response as { users?: unknown }).users)
			? (response as { users: DummyUser[] }).users
			: []) satisfies DummyUser[],
	maxHeight: 360,
	columns: [
		{ key: "id", header: "ID" },
		{
			key: "firstName",
			header: "Name",
			cell: (_value, row) => `${row.firstName} ${row.lastName}`,
		},
		{ key: "email", header: "Email" },
		{ key: "age", header: "Age" },
		{ key: "role", header: "Role" },
		{
			key: "company",
			header: "Company",
			cell: (_value, row) => row.company?.name ?? "-",
		},
	],
});

const rows: GenUIGridRow<RevenueRow>[] = [
	{
		id: "overview",
		columns: [
			{
				id: "revenue-stat",
				span: 4,
				smSpan: 6,
				widgets: [revenueStat],
			},
			{
				id: "customer-stat",
				span: 4,
				smSpan: 6,
				widgets: [customerStat],
			},
			{
				id: "live-stat",
				span: 4,
				smSpan: 12,
				widgets: [liveStat],
			},
			{
				id: "details-dialog",
				span: 12,
				widgets: [detailsDialog],
			},
		],
	},
	{
		id: "details",
		columns: [
			{
				id: "chart",
				title: "Chart",
				span: 7,
				widgets: [revenueChart],
			},
			{
				id: "table",
				title: "Table",
				span: 5,
				widgets: [revenueTable],
			},
		],
	},
	{
		id: "list",
		columns: [
			{
				id: "revenue-list",
				title: "List",
				span: 12,
				widgets: [revenueList],
			},
		],
	},
	{
		id: "locations",
		columns: [
			{
				id: "map",
				title: "Map",
				span: 12,
				widgets: [locationsMap],
			},
		],
	},
	{
		id: "geojson",
		columns: [
			{
				id: "geojson-map",
				title: "GeoJSON",
				span: 12,
				widgets: [geoJsonMap],
			},
		],
	},
];

const fetchedRows: GenUIGridRow<DummyUser>[] = [
	{
		id: "users",
		columns: [
			{
				id: "users-table",
				span: 12,
				widgets: [usersTable],
			},
		],
	},
];

const formRows: GenUIGridRow<LeadFormValues>[] = [
	{
		id: "form",
		columns: [
			{
				id: "lead-form",
				span: 6,
				widgets: [leadForm],
			},
		],
	},
];

const llmJsonRows: GenUIGridRow[] = [
	{
		id: "llm-overview",
		columns: [
			{
				id: "llm-confidence",
				span: 4,
				smSpan: 6,
				widgets: [
					{
						id: "llm-confidence-card",
						type: "stat-card",
						title: "LLM confidence",
						data: {
							label: "Confidence",
							value: "92%",
							description: "Generated from JSON",
							trend: {
								value: "+6%",
								direction: "up",
								label: "vs. previous run",
							},
						},
					},
				],
			},
			{
				id: "llm-cost",
				span: 4,
				smSpan: 6,
				widgets: [
					{
						id: "llm-cost-card",
						type: "stat-card",
						title: "Token cost",
						data: {
							label: "Token cost",
							value: "0.42 EUR",
							trend: {
								value: "-12%",
								direction: "down",
								label: "this hour",
							},
						},
					},
				],
			},
			{
				id: "llm-latency",
				span: 4,
				smSpan: 12,
				widgets: [
					{
						id: "llm-latency-card",
						type: "stat-card",
						title: "Latency",
						data: {
							label: "Latency",
							value: "680 ms",
							trend: {
								value: "stable",
								direction: "neutral",
							},
						},
					},
				],
			},
		],
	},
	{
		id: "llm-details",
		columns: [
			{
				id: "llm-chart",
				span: 6,
				title: "Generated chart",
				widgets: [
					{
						id: "llm-usage-chart",
						type: "chart",
						title: "Model usage",
						description: "Inline chart data from JSON",
						chartType: "bar",
						xKey: "day",
						data: [
							{ day: "Mon", input: 12000, output: 4200 },
							{ day: "Tue", input: 18400, output: 6100 },
							{ day: "Wed", input: 14200, output: 5300 },
							{ day: "Thu", input: 22000, output: 7800 },
							{ day: "Fri", input: 19500, output: 6900 },
						],
						series: [
							{
								key: "input",
								label: "Input tokens",
								color: "var(--chart-1)",
							},
							{
								key: "output",
								label: "Output tokens",
								color: "var(--chart-2)",
							},
						],
					},
				],
			},
			{
				id: "llm-table",
				span: 6,
				title: "Fetched JSON",
				widgets: [
					{
						id: "llm-users-table",
						type: "data-table",
						title: "Users from API JSON",
						description: "fetchUrl + dataPath from JSON config",
						fetchUrl: "https://dummyjson.com/users?limit=12",
						dataPath: "users",
						maxHeight: 320,
						columns: [
							{ key: "id", header: "ID" },
							{ key: "firstName", header: "First name" },
							{ key: "lastName", header: "Last name" },
							{ key: "email", header: "Email" },
							{ key: "age", header: "Age" },
						],
					},
				],
			},
			{
				id: "llm-list",
				span: 12,
				title: "Generated list",
				widgets: [
					{
						id: "llm-events-list",
						type: "list",
						title: "Recent events",
						description: "Inline list data from JSON",
						data: [
							{
								id: "evt-1",
								name: "Prompt generated",
								detail: "Dashboard JSON accepted",
								time: "09:12",
							},
							{
								id: "evt-2",
								name: "Fetcher completed",
								detail: "12 users loaded",
								time: "09:13",
							},
							{
								id: "evt-3",
								name: "Chart rendered",
								detail: "Usage series is available",
								time: "09:14",
							},
						],
						itemKey: "id",
						titleKey: "name",
						descriptionKey: "detail",
						metaKey: "time",
					},
				],
			},
		],
	},
];

const openTelemetryLoggingRows: GenUIGridRow[] = [
	{
		id: "otel-log-health",
		columns: [
			{
				id: "otel-ingest-rate",
				span: 4,
				smSpan: 6,
				widgets: [
					{
						id: "otel-ingest-rate-card",
						type: "stat-card",
						title: "Log ingest",
						description: "OpenTelemetry logs pipeline",
						data: {
							label: "Events / min",
							value: "1,842",
							icon: <RadioTower className="size-4" />,
							trend: {
								value: "+9.4%",
								direction: "up",
								label: "last 15 min",
							},
						},
					},
				],
			},
			{
				id: "otel-error-rate",
				span: 4,
				smSpan: 6,
				widgets: [
					{
						id: "otel-error-rate-card",
						type: "stat-card",
						title: "Errors",
						description: "SeverityText ERROR",
						data: {
							label: "Error logs",
							value: "24",
							icon: <AlertTriangle className="size-4" />,
							trend: {
								value: "+7",
								direction: "up",
								label: "last 5 min",
							},
						},
					},
				],
			},
			{
				id: "otel-trace-coverage",
				span: 4,
				smSpan: 12,
				widgets: [
					{
						id: "otel-trace-coverage-card",
						type: "stat-card",
						title: "Trace correlation",
						description: "Logs with trace_id and span_id",
						data: {
							label: "Coverage",
							value: "98.7%",
							icon: <CheckCircle2 className="size-4" />,
							trend: {
								value: "stable",
								direction: "neutral",
								label: "production",
							},
						},
					},
				],
			},
		],
	},
	{
		id: "otel-log-analysis",
		columns: [
			{
				id: "otel-volume-chart",
				span: 5,
				title: "Telemetry volume",
				widgets: [
					{
						id: "otel-log-volume-chart",
						type: "chart",
						title: "Logs by severity",
						description: "Grouped by OpenTelemetry SeverityText",
						chartType: "bar",
						xKey: "minute",
						data: otelLogVolumeData,
						series: [
							{
								key: "info",
								label: "INFO",
								color: "var(--chart-1)",
							},
							{
								key: "warn",
								label: "WARN",
								color: "var(--chart-2)",
							},
							{
								key: "error",
								label: "ERROR",
								color: "var(--chart-5)",
							},
						],
					},
				],
			},
			{
				id: "otel-recent-events",
				span: 7,
				title: "Trace-linked events",
				widgets: [
					{
						id: "otel-recent-events-list",
						type: "list",
						title: "Recent correlated logs",
						description:
							"Click an event to inspect resource and span metadata",
						data: otelLogData,
						itemKey: "id",
						titleKey: "message",
						descriptionKey: "service",
						metaKey: "severity",
						showDividers: true,
						dialogDrawer: {
							title: (row) => String(row.message ?? ""),
							description: (row) =>
								`${String(row.service ?? "")} | ${String(row.severity ?? "")}`,
							children: (row) => (
								<div className="space-y-3 px-4 pb-4 text-sm md:px-0">
									<div className="grid gap-2">
										<div className="flex justify-between gap-4">
											<span className="text-muted-foreground">
												Timestamp
											</span>
											<span className="font-medium">
												{String(row.timestamp ?? "")}
											</span>
										</div>
										<div className="flex justify-between gap-4">
											<span className="text-muted-foreground">
												Trace ID
											</span>
											<span className="break-all font-mono text-xs font-medium">
												{String(row.traceId ?? "")}
											</span>
										</div>
										<div className="flex justify-between gap-4">
											<span className="text-muted-foreground">
												Span ID
											</span>
											<span className="font-mono text-xs font-medium">
												{String(row.spanId ?? "")}
											</span>
										</div>
										<div className="flex justify-between gap-4">
											<span className="text-muted-foreground">
												Latency
											</span>
											<span className="font-medium">
												{String(row.latencyMs ?? "")} ms
											</span>
										</div>
									</div>
									<p className="break-words rounded-md bg-muted p-3 font-mono text-xs text-muted-foreground">
										{String(row.attributes ?? "")}
									</p>
								</div>
							),
						},
					},
				],
			},
		],
	},
	{
		id: "otel-log-table-row",
		columns: [
			{
				id: "otel-log-table",
				span: 12,
				title: "Structured log records",
				widgets: [
					{
						id: "otel-log-records-table",
						type: "data-table",
						title: "OpenTelemetry log records",
						description:
							"Resource, severity, trace_id, span_id and attributes in one table",
						data: otelLogData,
						maxHeight: 380,
						columns: [
							{ key: "timestamp", header: "Timestamp" },
							{
								key: "severity",
								header: "SeverityText",
								cell: (value) => (
									<span className="font-semibold">
										{String(value)}
									</span>
								),
							},
							{ key: "service", header: "service.name" },
							{ key: "message", header: "Body" },
							{
								key: "traceId",
								header: "trace_id",
								cell: (value) => (
									<span className="font-mono text-xs">
										{String(value).slice(0, 12)}...
									</span>
								),
							},
							{
								key: "spanId",
								header: "span_id",
								cell: (value) => (
									<span className="font-mono text-xs">
										{String(value)}
									</span>
								),
							},
							{
								key: "environment",
								header: "deployment.environment",
							},
						],
					},
				],
			},
		],
	},
];

const meta = {
	title: "Components/GenUI",
	component: GenUIExample,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof GenUIExample>;

function GenUIExample() {
	return (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<div className="mx-auto flex max-w-7xl flex-col gap-4">
				<GenUIGrid rows={rows} showColumnHeaders showWidgetHeaders />
				<GenUIGrid rows={fetchedRows} showWidgetHeaders />
			</div>
		</div>
	);
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};

export const FetchedUsersTable: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<GenUIGrid
				rows={fetchedRows}
				className="mx-auto max-w-5xl"
				showWidgetHeaders
			/>
		</div>
	),
};

export const FormBuilderWidget: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<GenUIGrid
				rows={formRows}
				className="mx-auto max-w-3xl"
				showWidgetHeaders
			/>
		</div>
	),
};

export const JsonGeneratedDashboard: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<GenUIGrid
				rows={llmJsonRows}
				className="mx-auto max-w-7xl"
				showColumnHeaders
				showWidgetHeaders
			/>
		</div>
	),
};

export const OpenTelemetryLogging: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<GenUIGrid
				rows={openTelemetryLoggingRows}
				className="mx-auto max-w-7xl"
				showColumnHeaders
				showWidgetHeaders
			/>
		</div>
	),
};

const redmineJson: GenUIGridRow[] = [
	{
		id: "redmine-stats-row",
		columns: [
			{
				id: "col-total-issues",
				span: 4,
				widgets: [
					{
						id: "stat-total",
						type: "stat-card",
						title: "Total Issues",
						data: {
							label: "Total Issues",
							value: "1,248",
							description: "All active projects",
							trend: {
								value: "+12",
								direction: "up",
								label: "this week",
							},
						},
					},
				],
			},
			{
				id: "col-open-issues",
				span: 4,
				widgets: [
					{
						id: "stat-open",
						type: "stat-card",
						title: "Open Issues",
						data: {
							label: "Open Issues",
							value: "342",
							description: "Requires action",
							trend: {
								value: "-5%",
								direction: "down",
								label: "vs. last week",
							},
						},
					},
				],
			},
			{
				id: "col-overdue-issues",
				span: 4,
				widgets: [
					{
						id: "stat-overdue",
						type: "stat-card",
						title: "Overdue",
						data: {
							label: "Overdue Issues",
							value: "18",
							description: "Past target date",
							trend: {
								value: "+3",
								direction: "up",
								label: "this week",
							},
						},
					},
				],
			},
		],
	},
	{
		id: "redmine-main-row",
		columns: [
			{
				id: "col-assigned",
				span: 8,
				widgets: [
					{
						id: "table-assigned",
						type: "data-table",
						title: "My Assigned Issues",
						data: [
							{
								id: "#4012",
								project: "Frontend Rework",
								tracker: "Bug",
								status: "In Progress",
								priority: "High",
								subject: "Fix navigation rendering on mobile",
							},
							{
								id: "#4008",
								project: "Backend API",
								tracker: "Feature",
								status: "New",
								priority: "Normal",
								subject: "Add endpoint for user preferences",
							},
							{
								id: "#3995",
								project: "Mobile App",
								tracker: "Task",
								status: "Feedback",
								priority: "Normal",
								subject: "Update splash screen assets",
							},
							{
								id: "#3980",
								project: "Frontend Rework",
								tracker: "Bug",
								status: "New",
								priority: "Urgent",
								subject: "Login button unresponsive on Safari",
							},
						],
						columns: [
							{
								key: "id",
								header: "ID",
							},
							{
								key: "project",
								header: "Project",
							},
							{
								key: "tracker",
								header: "Tracker",
							},
							{
								key: "status",
								header: "Status",
							},
							{
								key: "priority",
								header: "Priority",
							},
							{
								key: "subject",
								header: "Subject",
							},
						],
					},
				],
			},
			{
				id: "col-activity",
				span: 4,
				widgets: [
					{
						id: "list-activity",
						type: "list",
						title: "Recent Activity",
						itemKey: "id",
						titleKey: "action",
						descriptionKey: "project",
						metaKey: "time",
						dialogDrawer: {
							title: (row) => String(row.action ?? ""),
							description: (row) => String(row.project ?? ""),
							children: (row) => (
								<div className="space-y-3 px-4 pb-4 text-sm md:px-0">
									<div className="flex justify-between gap-4">
										<span className="text-muted-foreground">
											Activity ID
										</span>
										<span className="font-medium">
											{String(row.id ?? "")}
										</span>
									</div>
									<div className="flex justify-between gap-4">
										<span className="text-muted-foreground">
											Time
										</span>
										<span className="font-medium">
											{String(row.time ?? "")}
										</span>
									</div>
									<p className="text-muted-foreground">
										{String(row.details ?? "")}
									</p>
								</div>
							),
						},
						data: [
							{
								id: "act-1",
								action: "Issue #4012 Updated",
								project: "Frontend Rework",
								time: "10:32",
								details:
									"Status changed from New to In Progress by John Doe.",
							},
							{
								id: "act-2",
								action: "Issue #4015 Created",
								project: "Backend API",
								time: "09:45",
								details:
									"New feature request added for API rate limiting.",
							},
							{
								id: "act-3",
								action: "Status changed to Resolved",
								project: "Mobile App",
								time: "08:15",
								details:
									"Issue #3990 has been marked as resolved. Awaiting QA.",
							},
							{
								id: "act-4",
								action: "Comment added on #3998",
								project: "Frontend Rework",
								time: "Yesterday",
								details:
									"Sarah Connor commented: 'I will take a look at this tomorrow morning.'",
							},
							{
								id: "act-5",
								action: "Issue #3980 Assigned to you",
								project: "Frontend Rework",
								time: "Yesterday",
								details:
									"High priority bug assigned regarding the login button on Safari.",
							},
						],
					},
				],
			},
		],
	},
	{
		id: "redmine-chart-row",
		columns: [
			{
				id: "col-chart",
				span: 12,
				widgets: [
					{
						id: "chart-priority",
						type: "chart",
						title: "Issues by Priority",
						chartType: "bar",
						xKey: "priority",
						data: [
							{
								priority: "Low",
								open: 45,
								closed: 120,
							},
							{
								priority: "Normal",
								open: 210,
								closed: 540,
							},
							{
								priority: "High",
								open: 65,
								closed: 180,
							},
							{
								priority: "Urgent",
								open: 22,
								closed: 50,
							},
						],
						series: [
							{
								key: "open",
								label: "Open",
								color: "var(--chart-1)",
							},
							{
								key: "closed",
								label: "Closed",
								color: "var(--chart-2)",
							},
						],
					},
				],
			},
		],
	},
];
export const RedmineOverview: Story = {
	render: () => (
		<div className="min-h-screen bg-background p-4 sm:p-6">
			<GenUIGrid
				rows={redmineJson}
				className="mx-auto max-w-7xl"
				showColumnHeaders
				showWidgetHeaders
			/>
		</div>
	),
};
