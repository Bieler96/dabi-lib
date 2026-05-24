import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, CreditCard, TrendingUp, Users } from "lucide-react";

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
