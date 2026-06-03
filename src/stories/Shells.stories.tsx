import type { Meta, StoryObj } from "@storybook/react-vite";
import { CenteredShell } from "../components/shells/CenteredShell";
import { HolyGrailShell } from "../components/shells/HolyGrailShell";
import { SidebarShell } from "../components/shells/SidebarShell";
import { SplitShell } from "../components/shells/SplitShell";
import { StackedShell } from "../components/shells/StackedShell";

const NavBar = () => (
	<div className="flex h-14 items-center justify-between px-6">
		<div className="font-semibold">Workspace</div>
		<div className="flex items-center gap-2 text-sm text-muted-foreground">
			<span>Projects</span>
			<span>Reports</span>
			<span>Settings</span>
		</div>
	</div>
);

const SubNav = () => (
	<div className="flex h-11 items-center gap-4 px-6 text-sm text-muted-foreground">
		<span className="font-medium text-foreground">Overview</span>
		<span>Tasks</span>
		<span>Files</span>
		<span>Activity</span>
	</div>
);

const SidebarContent = ({ compact = false }: { compact?: boolean }) => (
	<div className="grid gap-2 p-3 text-sm">
		{["Home", "Inbox", "Projects", "Reports", "Team"].map((item) => (
			<div
				key={item}
				className="rounded-md px-3 py-2 font-medium text-sidebar-foreground hover:bg-sidebar-accent"
			>
				{compact ? item.charAt(0) : item}
			</div>
		))}
	</div>
);

const ContentGrid = () => (
	<div className="grid gap-4 p-6 md:grid-cols-3">
		{["Revenue", "Active users", "Open work"].map((label, index) => (
			<div key={label} className="rounded-lg border bg-background p-4">
				<div className="text-sm text-muted-foreground">{label}</div>
				<div className="mt-2 text-2xl font-semibold">
					{["$48.2k", "12,840", "27"][index]}
				</div>
			</div>
		))}
		<div className="rounded-lg border bg-background p-4 md:col-span-2">
			<div className="font-medium">Roadmap</div>
			<div className="mt-4 grid gap-3">
				<div className="h-3 rounded bg-muted" />
				<div className="h-3 w-4/5 rounded bg-muted" />
				<div className="h-3 w-2/3 rounded bg-muted" />
			</div>
		</div>
		<div className="rounded-lg border bg-background p-4">
			<div className="font-medium">Status</div>
			<div className="mt-4 space-y-2 text-sm text-muted-foreground">
				<div>API healthy</div>
				<div>Sync complete</div>
				<div>3 pending reviews</div>
			</div>
		</div>
	</div>
);

const Panel = ({ title }: { title: string }) => (
	<div className="h-full p-4">
		<div className="text-sm font-medium">{title}</div>
		<div className="mt-4 grid gap-3">
			<div className="h-3 rounded bg-muted" />
			<div className="h-3 w-5/6 rounded bg-muted" />
			<div className="h-3 w-2/3 rounded bg-muted" />
		</div>
	</div>
);

const meta = {
	title: "Layout/Shells",
	component: CenteredShell,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		maxWidth: {
			control: "text",
		},
		className: {
			control: "text",
		},
	},
	args: {
		maxWidth: "28rem",
	},
	render: (args) => (
		<CenteredShell {...args}>
			<div className="rounded-lg border bg-card p-6 shadow-sm">
				<div className="text-lg font-semibold">Sign in</div>
				<p className="mt-2 text-sm text-muted-foreground">
					Continue to your workspace.
				</p>
				<div className="mt-6 grid gap-3">
					<div className="h-10 rounded-md border bg-background" />
					<div className="h-10 rounded-md border bg-background" />
					<div className="h-10 rounded-md bg-primary" />
				</div>
			</div>
		</CenteredShell>
	),
} satisfies Meta<typeof CenteredShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Centered: Story = {};

export const Stacked: Story = {
	render: () => (
		<StackedShell topNav={<NavBar />} subNav={<SubNav />}>
			<ContentGrid />
		</StackedShell>
	),
};

export const Sidebar: Story = {
	render: () => (
		<SidebarShell sidebar={<SidebarContent />}>
			<NavBar />
			<ContentGrid />
		</SidebarShell>
	),
};

export const CollapsedSidebar: Story = {
	render: () => (
		<SidebarShell collapsed sidebar={<SidebarContent compact />}>
			<NavBar />
			<ContentGrid />
		</SidebarShell>
	),
};

export const RightSidebar: Story = {
	render: () => (
		<SidebarShell side="right" sidebar={<SidebarContent />}>
			<NavBar />
			<ContentGrid />
		</SidebarShell>
	),
};

export const HolyGrail: Story = {
	render: () => (
		<HolyGrailShell
			header={<NavBar />}
			footer={
				<div className="flex h-12 items-center justify-between px-6 text-sm text-muted-foreground">
					<span>Last updated just now</span>
					<span>v1.4.0</span>
				</div>
			}
			left={<SidebarContent />}
			right={<Panel title="Inspector" />}
		>
			<ContentGrid />
		</HolyGrailShell>
	),
};

export const SplitHorizontal: Story = {
	render: () => (
		<div className="h-screen bg-background">
			<SplitShell
				primary={<Panel title="Conversation" />}
				secondary={<ContentGrid />}
			/>
		</div>
	),
};

export const SplitRight: Story = {
	render: () => (
		<div className="h-screen bg-background">
			<SplitShell
				side="right"
				primary={<Panel title="Details" />}
				secondary={<ContentGrid />}
			/>
		</div>
	),
};

export const SplitVertical: Story = {
	render: () => (
		<div className="h-screen bg-background">
			<SplitShell
				orientation="vertical"
				primaryWidth="14rem"
				primary={<Panel title="Timeline" />}
				secondary={<ContentGrid />}
			/>
		</div>
	),
};
