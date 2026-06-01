import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/Tabs";

const meta = {
	title: "Components/Tabs",
	component: Tabs,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<Tabs
			defaultValue="overview"
			className="w-[min(640px,calc(100vw-2rem))]"
		>
			<TabsList>
				<TabsTrigger value="overview">Overview</TabsTrigger>
				<TabsTrigger value="analytics">Analytics</TabsTrigger>
				<TabsTrigger value="settings">Settings</TabsTrigger>
			</TabsList>

			<div className="mt-6">
				<TabsContent value="overview">
					<div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
						Overview Content
					</div>
				</TabsContent>

				<TabsContent value="analytics">
					<div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
						Analytics Content
					</div>
				</TabsContent>

				<TabsContent value="settings">
					<div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
						Settings Content
					</div>
				</TabsContent>
			</div>
		</Tabs>
	),
};
