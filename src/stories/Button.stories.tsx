import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button";

const meta = {
	title: "Components/Button",
	component: Button,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: [
				"default",
				"outline",
				"secondary",
				"ghost",
				"destructive",
				"link",
			],
		},
		size: {
			control: "select",
			options: [
				"default",
				"xs",
				"sm",
				"lg",
				"icon",
				"icon-xs",
				"icon-sm",
				"icon-lg",
			],
		},
	},
	args: {
		children: "Button",
		variant: "default",
		size: "default",
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	),
};

export const Sizes: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4">
			<Button size="xs">Extra small</Button>
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
			<Button size="icon" aria-label="Add item">
				+
			</Button>
		</div>
	),
};

export const CustomMotionClasses: Story = {
	render: () => (
		<div className="grid gap-3 sm:grid-cols-2">
			<Button className="shrink-hover" variant="outline">
				shrink-hover
			</Button>
			<Button className="shrink-active" variant="outline">
				shrink-active
			</Button>
			<Button className="grow-hover" variant="secondary">
				grow-hover
			</Button>
			<Button className="grow-active" variant="secondary">
				grow-active
			</Button>
			<Button className="shrink-hover grow-active" variant="default">
				shrink-hover + grow-active
			</Button>
			<Button className="grow-hover shrink-active" variant="default">
				grow-hover + shrink-active
			</Button>
		</div>
	),
};

export const Disabled: Story = {
	args: {
		children: "Disabled",
		disabled: true,
	},
};
