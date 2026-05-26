import type { Meta, StoryObj } from "@storybook/react-vite";
import {
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
} from "../components/Chart";

const monthlyVisitors = [
	{ month: "Jan", desktop: 186, mobile: 80 },
	{ month: "Feb", desktop: 305, mobile: 200 },
	{ month: "Mar", desktop: 237, mobile: 120 },
	{ month: "Apr", desktop: 73, mobile: 190 },
	{ month: "May", desktop: 209, mobile: 130 },
	{ month: "Jun", desktop: 214, mobile: 140 },
];

const chartConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1)",
	},
	mobile: {
		label: "Mobile",
		color: "var(--chart-2)",
	},
} satisfies ChartConfig;

type ChartStoryArgs = {
	className?: string;
};

const meta = {
	title: "Components/Chart",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		className: "h-[320px] w-[80vw] max-w-3xl",
	},
	argTypes: {
		className: {
			control: "text",
		},
	},
} satisfies Meta<ChartStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LineExample: Story = {
	render: (args) => (
		<ChartContainer {...args} config={chartConfig}>
			<LineChart
				accessibilityLayer
				data={monthlyVisitors}
				margin={{ left: 12, right: 12 }}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					axisLine={false}
					dataKey="month"
					tickLine={false}
					tickMargin={8}
				/>
				<YAxis axisLine={false} tickLine={false} tickMargin={8} />
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Line
					dataKey="desktop"
					stroke="var(--color-desktop)"
					strokeWidth={2}
					type="monotone"
					dot={false}
				/>
				<Line
					dataKey="mobile"
					stroke="var(--color-mobile)"
					strokeWidth={2}
					type="monotone"
					dot={false}
				/>
			</LineChart>
		</ChartContainer>
	),
};

export const BarExample: Story = {
	render: (args) => (
		<ChartContainer {...args} config={chartConfig}>
			<BarChart accessibilityLayer data={monthlyVisitors}>
				<CartesianGrid vertical={false} />
				<XAxis
					axisLine={false}
					dataKey="month"
					tickLine={false}
					tickMargin={8}
				/>
				<YAxis axisLine={false} tickLine={false} tickMargin={8} />
				<ChartTooltip content={<ChartTooltipContent />} />
				<ChartLegend content={<ChartLegendContent />} />
				<Bar
					dataKey="desktop"
					fill="var(--color-desktop)"
					radius={[4, 4, 0, 0]}
				/>
				<Bar
					dataKey="mobile"
					fill="var(--color-mobile)"
					radius={[4, 4, 0, 0]}
				/>
			</BarChart>
		</ChartContainer>
	),
};
