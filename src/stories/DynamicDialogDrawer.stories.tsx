import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../components/Button";
import {
	DynamicDialogDrawer,
	DynamicDialogDrawerClose,
	DynamicDialogDrawerContent,
	DynamicDialogDrawerDescription,
	DynamicDialogDrawerFooter,
	DynamicDialogDrawerHeader,
	DynamicDialogDrawerTitle,
	DynamicDialogDrawerTrigger,
} from "../components/DynamicDialogDrawer";

type DynamicDialogDrawerStoryProps = React.ComponentProps<
	typeof DynamicDialogDrawer
> & {
	showCloseButton?: boolean;
};

function DynamicDialogDrawerStory({
	showCloseButton,
	...args
}: DynamicDialogDrawerStoryProps) {
	return (
		<DynamicDialogDrawer {...args}>
			<DynamicDialogDrawerTrigger render={<Button>Open</Button>} />
			<DynamicDialogDrawerContent showCloseButton={showCloseButton}>
				<DynamicDialogDrawerHeader>
					<DynamicDialogDrawerTitle>
						Update profile
					</DynamicDialogDrawerTitle>
					<DynamicDialogDrawerDescription>
						Change the details that appear on your public profile.
					</DynamicDialogDrawerDescription>
				</DynamicDialogDrawerHeader>
				<div className="grid gap-3 px-4 pb-4 md:px-0 md:pb-0">
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">
							Display name
						</p>
						<p className="mt-1 text-muted-foreground">
							Ada Lovelace
						</p>
					</div>
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">
							Visibility
						</p>
						<p className="mt-1 text-muted-foreground">
							Profile updates are visible to workspace members.
						</p>
					</div>
				</div>
				<DynamicDialogDrawerFooter>
					<DynamicDialogDrawerClose
						render={<Button>Save changes</Button>}
					/>
					<DynamicDialogDrawerClose
						render={<Button variant="outline">Cancel</Button>}
					/>
				</DynamicDialogDrawerFooter>
			</DynamicDialogDrawerContent>
		</DynamicDialogDrawer>
	);
}

const meta = {
	title: "Components/DynamicDialogDrawer",
	component: DynamicDialogDrawerStory,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		direction: {
			control: "select",
			options: ["bottom", "top", "right", "left"],
		},
		modal: {
			control: "boolean",
		},
		showCloseButton: {
			control: "boolean",
		},
	},
	args: {
		direction: "bottom",
		modal: true,
		showCloseButton: true,
	},
	render: (args) => <DynamicDialogDrawerStory {...args} />,
} satisfies Meta<typeof DynamicDialogDrawerStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
