import { Heart, MessageCircle, Repeat2, Search, Send } from "lucide-react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import {
	DashboardWidget,
	type DashboardWidgetRenderContext,
	WidgetDashboard,
	type WidgetDashboardColumn,
} from "../components/WidgetDashboard";
import { Input } from "../components/Input";
import { Button } from "../components/Button";

interface ThreadsDashboardContext {
	accountName: string;
}

function Avatar({ label }: { label: string }) {
	return (
		<div className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-xs font-semibold">
			{label}
		</div>
	);
}

function ThreadPost({
	name,
	time,
	children,
	avatar,
}: {
	name: string;
	time: string;
	children: React.ReactNode;
	avatar: string;
}) {
	return (
		<article className="flex gap-3 text-sm">
			<Avatar label={avatar} />
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-1">
					<span className="font-semibold">{name}</span>
					<span className="text-muted-foreground">{time}</span>
				</div>
				<div className="mt-1 leading-relaxed">{children}</div>
				<div className="mt-3 flex items-center gap-5 text-muted-foreground">
					<Heart className="size-4" />
					<MessageCircle className="size-4" />
					<Repeat2 className="size-4" />
					<Send className="size-4" />
				</div>
			</div>
		</article>
	);
}

class ForYouWidget extends DashboardWidget<ThreadsDashboardContext> {
	constructor() {
		super({
			id: "for-you",
			title: "Fuer dich",
			description: "Personal feed",
		});
	}

	render(context: DashboardWidgetRenderContext<ThreadsDashboardContext>) {
		return (
			<div className="space-y-5">
				<div className="flex items-center gap-3">
					<Avatar label="DU" />
					<div className="flex-1 rounded-xl border border-border px-3 py-2 text-muted-foreground">
						Was gibt's Neues,{" "}
						{context.dashboardContext?.accountName}?
					</div>
				</div>
				<ThreadPost name="cormistic" time="1 Tag" avatar="CO">
					Which terminal do you guys use? I've been looking into
					Ghostty lately!
				</ThreadPost>
				<ThreadPost name="joennandez" time="18 Std." avatar="JO">
					<span className="text-primary">@subspace.build</span>
					<div className="mt-3 aspect-video rounded-xl border border-border bg-muted" />
				</ThreadPost>
				<ThreadPost name="neal_mohan" time="16 Std." avatar="NM">
					Yesterday at Google IO, we announced flexible new plans and
					value with our subscription services.
				</ThreadPost>
			</div>
		);
	}
}

class AiWidget extends DashboardWidget<ThreadsDashboardContext> {
	constructor() {
		super({
			id: "ai",
			title: "AI",
			description: "2 Themen, 4 Profile",
		});
	}

	render() {
		return (
			<div className="space-y-5">
				<ThreadPost name="levelboss" time="7 Std." avatar="LB">
					Claude Code ist manchmal lustig. Da hat wohl jemand
					entschieden, ihn in echten Entwicklertagen rechnen zu
					lassen.
				</ThreadPost>
				<ThreadPost name="goooglegemini" time="9 Std." avatar="GG">
					Create an ultra-realistic indoor fashion collage using the
					uploaded face image as identity reference.
					<div className="mt-3 grid grid-cols-2 gap-1 overflow-hidden rounded-xl">
						<div className="aspect-[3/4] bg-chart-2/25" />
						<div className="aspect-[3/4] bg-chart-3/25" />
						<div className="aspect-[3/4] bg-chart-4/25" />
						<div className="aspect-[3/4] bg-chart-5/25" />
					</div>
				</ThreadPost>
			</div>
		);
	}
}

class SearchWidget extends DashboardWidget<ThreadsDashboardContext> {
	constructor() {
		super({
			id: "search",
			title: "Suchen",
			description: "Vorschlaege zum Folgen",
		});
	}

	render() {
		const profiles = [
			["nothing", "Nothing", "423.860 Follower"],
			["polygonrunway", "Polygon Runway", "71.187 Follower"],
			["ijustine", "iJustine", "651.390 Follower"],
			["microsoftdeveloper", "Microsoft Developer", "181.762 Follower"],
		];

		return (
			<div className="space-y-4">
				<div className="relative">
					<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
					<Input className="pl-9" placeholder="Suchen" />
				</div>
				<div className="space-y-4">
					{profiles.map(([name, handle, followers]) => (
						<div key={name} className="flex items-start gap-3">
							<Avatar label={name.slice(0, 2).toUpperCase()} />
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-semibold">
									{name}
								</p>
								<p className="truncate text-sm text-muted-foreground">
									{handle}
								</p>
								<p className="mt-2 text-xs text-muted-foreground">
									{followers}
								</p>
							</div>
							<Button>Follow</Button>
						</div>
					))}
				</div>
			</div>
		);
	}
}

const forYouWidget = new ForYouWidget();
const aiWidget = new AiWidget();
const searchWidget = new SearchWidget();

const defaultColumns: WidgetDashboardColumn<ThreadsDashboardContext>[] = [
	{
		id: "for-you",
		title: forYouWidget.title,
		widgets: [forYouWidget],
	},
	{
		id: "ai",
		title: aiWidget.title,
		description: aiWidget.description,
		widgets: [aiWidget],
	},
	{
		id: "search",
		title: searchWidget.title,
		widgets: [searchWidget],
	},
];

const meta = {
	title: "Components/WidgetDashboard",
	component: WidgetDashboard,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	render: () => (
		<div className="h-screen bg-background py-3">
			<WidgetDashboard
				defaultColumns={defaultColumns}
				availableWidgets={[forYouWidget, aiWidget, searchWidget]}
				dashboardContext={{ accountName: "@dabi" }}
			/>
		</div>
	),
} satisfies Meta<typeof WidgetDashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ThreadsLike: Story = {};
