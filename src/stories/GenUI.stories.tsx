import type { Meta, StoryObj } from "@storybook/react-vite";
import { Activity, CreditCard, Users } from "lucide-react";

import { GenUIGrid, GenUIWidget, type GenUIGridRow } from "../components/GenUI";

type RevenueRow = {
	month: string;
	revenue: number;
	expenses: number;
	customers: number;
};

const revenueData: RevenueRow[] = [
	{ month: "Jan", revenue: 18600, expenses: 9800, customers: 120 },
	{ month: "Feb", revenue: 22400, expenses: 11100, customers: 142 },
	{ month: "Mar", revenue: 24800, expenses: 12300, customers: 158 },
	{ month: "Apr", revenue: 29100, expenses: 14700, customers: 181 },
	{ month: "May", revenue: 32600, expenses: 16300, customers: 204 },
	{ month: "Jun", revenue: 35400, expenses: 17100, customers: 229 },
];

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

const rows: GenUIGridRow<RevenueRow>[] = [
	{
		id: "overview",
		columns: [
			{
				id: "revenue-stat",
				span: 4,
				widgets: [revenueStat],
			},
			{
				id: "customer-stat",
				span: 4,
				widgets: [customerStat],
			},
			{
				id: "live-stat",
				span: 4,
				widgets: [liveStat],
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
		<div className="min-h-screen bg-background p-6">
			<GenUIGrid
				rows={rows}
				className="mx-auto max-w-7xl"
				showColumnHeaders
				showWidgetHeaders
			/>
		</div>
	);
}

export default meta;
type Story = StoryObj<typeof meta>;

export const Dashboard: Story = {};
