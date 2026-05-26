import type * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../components/Dialog";
import { Button } from "../components/Button";

type DialogStoryProps = React.ComponentProps<typeof Dialog> & {
	showCloseButton?: boolean;
};

function DialogStory({ showCloseButton, ...args }: DialogStoryProps) {
	return (
		<Dialog {...args}>
			<DialogTrigger render={<Button>Open dialog</Button>} />
			<DialogContent showCloseButton={showCloseButton}>
				<DialogHeader>
					<DialogTitle>Invite teammate</DialogTitle>
					<DialogDescription>
						Send an invitation to someone who should collaborate on this
						workspace.
					</DialogDescription>
				</DialogHeader>
				<div className="grid gap-3">
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">Role</p>
						<p className="mt-1 text-muted-foreground">
							New members will join with editor access.
						</p>
					</div>
					<div className="rounded-lg border bg-background p-3">
						<p className="font-medium text-foreground">Notification</p>
						<p className="mt-1 text-muted-foreground">
							They will receive an email with a secure sign-in link.
						</p>
					</div>
				</div>
				<DialogFooter>
					<DialogClose render={<Button variant="outline">Cancel</Button>} />
					<DialogClose render={<Button>Send invite</Button>} />
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}

const meta = {
	title: "Components/Dialog",
	component: DialogStory,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	argTypes: {
		modal: {
			control: "boolean",
		},
		showCloseButton: {
			control: "boolean",
		},
	},
	args: {
		modal: true,
		showCloseButton: true,
	},
	render: (args) => <DialogStory {...args} />,
} satisfies Meta<typeof DialogStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithFooterCloseButton: Story = {
	render: () => (
		<Dialog>
			<DialogTrigger
				render={<Button variant="outline">Open footer close dialog</Button>}
			/>
			<DialogContent showCloseButton={false}>
				<DialogHeader>
					<DialogTitle>Archive project</DialogTitle>
					<DialogDescription>
						Archived projects are hidden from the active workspace but can be
						restored later.
					</DialogDescription>
				</DialogHeader>
				<div className="rounded-lg border bg-background p-3 text-muted-foreground">
					Project activity, comments, and files remain available in the
					archive.
				</div>
				<DialogFooter showCloseButton>
					<Button variant="destructive">Archive</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	),
};
