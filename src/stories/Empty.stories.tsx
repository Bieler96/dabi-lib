import type { Meta, StoryObj } from "@storybook/react-vite";
import { Search } from "lucide-react";
import type { ComponentProps } from "react";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyMedia,
	EmptyTitle,
} from "../components/Empty";

type EmptyStoryArgs = ComponentProps<typeof Empty> & {
	variant: "default" | "icon";
};

const meta = {
	title: "Components/Empty",
	component: Empty,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		variant: {
			control: "select",
			options: ["default", "icon"],
		},
	},
	args: {
		variant: "default",
	},
	render: ({ variant, ...args }) => (
		<Empty {...args}>
			{variant === "icon" && (
				<EmptyMedia variant={variant}>
					<Search />
				</EmptyMedia>
			)}
			<EmptyContent>
				<EmptyTitle>No data found</EmptyTitle>
				<EmptyDescription>
					Try adjusting your search or filter to find what you're
					looking for.
				</EmptyDescription>
			</EmptyContent>
		</Empty>
	),
} satisfies Meta<EmptyStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Icon: Story = {
	args: {
		variant: "icon",
	},
};
