import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	Archive,
	ChevronDown,
	Copy,
	Download,
	Edit3,
	Eye,
	FolderOpen,
	MoreHorizontal,
	Settings,
	Share2,
	Trash2,
} from "lucide-react";
import { Button, buttonVariants } from "../components/Button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../components/DropdownMenu";

const meta = {
	title: "Components/DropdownMenu",
	component: DropdownMenu,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	render: () => <DropdownMenuExample />,
} satisfies Meta<typeof DropdownMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

function DropdownMenuExample({
	defaultOpen = false,
}: {
	defaultOpen?: boolean;
}) {
	return (
		<DropdownMenu defaultOpen={defaultOpen}>
			<DropdownMenuTrigger
				className={buttonVariants({ variant: "outline" })}
			>
				More actions
				<ChevronDown />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56">
				<DropdownMenuGroup>
					<DropdownMenuLabel>Document</DropdownMenuLabel>
					<DropdownMenuItem>
						<Eye />
						Preview
						<DropdownMenuShortcut>Ctrl P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<Edit3 />
						Rename
						<DropdownMenuShortcut>Ctrl R</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem disabled>
						<Download />
						Download
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuCheckboxItem defaultChecked>
					Show hidden files
				</DropdownMenuCheckboxItem>
				<DropdownMenuCheckboxItem>
					Keep menu pinned
				</DropdownMenuCheckboxItem>
				<DropdownMenuSeparator />
				<DropdownMenuRadioGroup defaultValue="comfortable">
					<DropdownMenuLabel>View density</DropdownMenuLabel>
					<DropdownMenuRadioItem value="compact">
						Compact
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="comfortable">
						Comfortable
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value="spacious">
						Spacious
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
				<DropdownMenuSeparator />
				<DropdownMenuSub>
					<DropdownMenuSubTrigger>
						<Share2 />
						Share
					</DropdownMenuSubTrigger>
					<DropdownMenuSubContent>
						<DropdownMenuItem>
							<Copy />
							Copy link
						</DropdownMenuItem>
						<DropdownMenuItem>
							<FolderOpen />
							Move to folder
						</DropdownMenuItem>
						<DropdownMenuItem>
							<Archive />
							Archive
						</DropdownMenuItem>
					</DropdownMenuSubContent>
				</DropdownMenuSub>
				<DropdownMenuItem>
					<Settings />
					Settings
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete
					<DropdownMenuShortcut>Del</DropdownMenuShortcut>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export const Default: Story = {};

export const Open: Story = {
	render: () => <DropdownMenuExample defaultOpen />,
};

export const IconTrigger: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger
				aria-label="Open document actions"
				className={buttonVariants({ size: "icon", variant: "outline" })}
			>
				<MoreHorizontal />
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-48">
				<DropdownMenuItem>
					<Eye />
					Preview
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Copy />
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};

export const ButtonTrigger: Story = {
	render: () => (
		<DropdownMenu>
			<DropdownMenuTrigger render={<Button variant="default" />}>
				Actions
				<ChevronDown />
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-48">
				<DropdownMenuItem>
					<Eye />
					Preview
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Edit3 />
					Rename
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Copy />
					Duplicate
				</DropdownMenuItem>
				<DropdownMenuItem variant="destructive">
					<Trash2 />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	),
};
