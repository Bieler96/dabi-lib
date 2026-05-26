import type { Meta, StoryObj } from "@storybook/react-vite";
import { Slider } from "../components/Slider";
import { cn } from "../utils/cn";

const meta = {
	title: "Components/Slider",
	component: Slider,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		defaultValue: {
			control: "object",
		},
		value: {
			control: "object",
		},
		min: {
			control: "number",
		},
		max: {
			control: "number",
		},
	},
	args: {
		defaultValue: 30,
		min: 0,
		max: 100,
	},
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<div className="w-[calc(100vw-4rem)] max-w-xs min-w-48">
			<Slider {...args} />
		</div>
	),
};

export const RangeSlider: Story = {
	args: {
		defaultValue: [30, 70],
	},
	render: (args) => (
		<div className="w-[calc(100vw-4rem)] max-w-xs min-w-48">
			<Slider {...args} />
		</div>
	),
};

export const Vertical: Story = {
	args: {
		defaultValue: [20, 80],
	},
	render: (args) => (
		<div className="h-64">
			<Slider
				{...args}
				className={cn(
					"data-[orientation=vertical]:h-full",
					args.className,
				)}
				orientation="vertical"
			/>
		</div>
	),
};
