import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../components/Drawer";
import { Button } from "../components/Button";

const meta = {
	title: "Components/Drawer",
	component: Drawer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		direction: {
			control: "select",
			options: ["bottom", "top", "right", "left"],
		},
		dismissible: {
			control: "boolean",
		},
		modal: {
			control: "boolean",
		},
	},
	args: {
		direction: "bottom",
		dismissible: true,
		modal: true,
	},
	render: (args) => (
		<Drawer {...args}>
			<DrawerTrigger asChild>
				<Button>Open drawer</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Project settings</DrawerTitle>
					<DrawerDescription>
						Manage the details that appear across your workspace.
					</DrawerDescription>
				</DrawerHeader>
				<div className="grid gap-3 px-4 pb-4">
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">Notifications</p>
						<p className="mt-1 text-muted-foreground">
							Weekly summaries are enabled for this project.
						</p>
					</div>
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">Members</p>
						<p className="mt-1 text-muted-foreground">
							Invite teammates and review pending access requests.
						</p>
					</div>
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button>Save changes</Button>
					</DrawerClose>
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	),
} satisfies Meta<typeof Drawer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Directions: Story = {
	render: () => (
		<div className="grid grid-cols-2 gap-3">
			{(["bottom", "top", "right", "left"] as const).map((direction) => (
				<Drawer key={direction} direction={direction}>
					<DrawerTrigger asChild>
						<Button variant="outline" className="capitalize">
							{direction}
						</Button>
					</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader>
							<DrawerTitle className="capitalize">{direction} drawer</DrawerTitle>
							<DrawerDescription>
								This drawer opens from the {direction} side.
							</DrawerDescription>
						</DrawerHeader>
						<div className="px-4 pb-4 text-muted-foreground">
							Use this variant for contextual actions, detail views, or compact
							forms.
						</div>
						<DrawerFooter>
							<DrawerClose asChild>
								<Button>Done</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			))}
		</div>
	),
};
