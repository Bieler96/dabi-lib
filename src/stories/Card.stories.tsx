import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/Card";

const meta = {
	title: "Components/Card",
	component: Card,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		className: {
			control: "text",
		},
		size: {
			control: "select",
			options: ["default", "sm"],
		},
		width: {
			control: "text",
		},
	},
	args: {
		className: "w-[70vw] sm:w-96 max-w-full",
		size: "default",
	},
	render: (args) => (
		<Card {...args}>
			<CardHeader>
				<CardTitle>Project overview</CardTitle>
				<CardDescription>
					Track recent activity and open tasks.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="grid gap-2 text-sm">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">
							Open tasks
						</span>
						<span className="font-medium">12</span>
					</div>
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground">Completed</span>
						<span className="font-medium">48</span>
					</div>
				</div>
			</CardContent>
			<CardFooter>
				<Button className="w-full" variant="outline">
					View details
				</Button>
			</CardFooter>
		</Card>
	),
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
	render: () => (
		<div className="grid gap-4 sm:grid-cols-2">
			<Card className="w-[70vw] sm:w-96 max-w-full">
				<CardHeader>
					<CardTitle>Default card</CardTitle>
					<CardDescription>
						Comfortable spacing for regular content.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Use this for summaries, settings, and dashboard panels.
					</p>
				</CardContent>
			</Card>
			<Card className="w-[70vw] sm:w-96 max-w-full" size="sm">
				<CardHeader>
					<CardTitle>Small card</CardTitle>
					<CardDescription>
						Compact spacing for dense layouts.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Use this when several cards need to sit close together.
					</p>
				</CardContent>
			</Card>
		</div>
	),
};

export const WithAction: Story = {
	render: () => (
		<Card className="w-[70vw] sm:w-96 max-w-full">
			<CardHeader>
				<CardTitle>Subscription</CardTitle>
				<CardDescription>Team plan renews on June 12.</CardDescription>
				<CardAction>
					<Button variant="outline">Manage</Button>
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="text-2xl font-semibold">$29</div>
				<p className="mt-1 text-muted-foreground">
					per user, billed monthly
				</p>
			</CardContent>
		</Card>
	),
};

export const WithFooter: Story = {
	render: () => (
		<Card className="w-[70vw] sm:w-96 max-w-full">
			<CardHeader>
				<CardTitle>Invite members</CardTitle>
				<CardDescription>
					Add teammates to your workspace.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">
					Members can view projects, comment on work, and receive
					updates.
				</p>
			</CardContent>
			<CardFooter className="flex justify-end gap-2">
				<Button className="flex-1 sm:flex-initial" variant="ghost">
					Cancel
				</Button>
				<Button className="flex-1 sm:flex-initial">Send invite</Button>
			</CardFooter>
		</Card>
	),
};

export const WithImage: Story = {
	render: () => (
		<Card className="w-[70vw] sm:w-96 max-w-full">
			<img
				alt="Abstract workspace"
				className="aspect-video object-cover"
				src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=640&q=80"
			/>
			<CardHeader>
				<CardTitle>Workspace</CardTitle>
				<CardDescription>
					Designed for focused team planning.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">
					Cards can include media before the header and keep rounded
					image edges.
				</p>
			</CardContent>
		</Card>
	),
};
