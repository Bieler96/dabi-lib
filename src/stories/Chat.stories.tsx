import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatMessage } from "../components/Chat";
import { Button } from "../components/Button";
import { Info } from "lucide-react";
import React from "react";

const messageDate = new Date("2026-05-26T14:32:00");

const meta = {
	title: "Components/Chat",
	component: ChatMessage,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["User", "Bot"],
		},
		content: {
			control: "text",
		},
		timestamp: {
			control: "date",
		},
	},
	args: {
		type: "Bot",
		content: "Hi, wie kann ich dir helfen?",
		timestamp: messageDate,
	},
} satisfies Meta<typeof ChatMessage>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const UserMessage: Story = {
	args: {
		type: "User",
		content: "Kannst du mir eine kurze Zusammenfassung schreiben?",
		timestamp: new Date("2026-05-26T14:33:00"),
	},
};

export const BotMessage: Story = {
	args: {
		type: "Bot",
		content:
			"Klar. Schick mir den Text, dann fasse ich ihn dir kompakt zusammen.",
		timestamp: new Date("2026-05-26T14:34:00"),
	},
};

export const WithoutTimestamp: Story = {
	args: {
		type: "Bot",
		content: "Diese Nachricht wird ohne Zeitstempel dargestellt.",
		timestamp: null,
	},
};

export const Conversation: Story = {
	render: () => (
		<div className="flex w-[min(36rem,calc(100vw-2rem))] flex-col gap-2">
			<ChatMessage
				type="Bot"
				content="Hi, was bauen wir heute?"
				// timestamp={new Date("2026-05-26T14:30:00")}
			/>
			<ChatMessage
				type="User"
				content="Eine Chat-Komponente mit Storybook-Beispielen."
				// timestamp={new Date("2026-05-26T14:31:00")}
			/>
			<ChatMessage
				type="Bot"
				content="Perfekt. Ich zeige einzelne Nachrichten und einen kompletten Verlauf."
				// timestamp={new Date("2026-05-26T14:32:00")}
			/>
		</div>
	),
};

function ExampleWithInfoWindowStory() {
	const [open, setOpen] = React.useState(false);
	const containerRef = React.useRef<HTMLDivElement>(null);
	const chatRef = React.useRef<HTMLDivElement>(null);
	const [centerOffset, setCenterOffset] = React.useState(0);

	React.useLayoutEffect(() => {
		const updateCenterOffset = () => {
			const container = containerRef.current;
			const chat = chatRef.current;

			if (!container || !chat) {
				return;
			}

			setCenterOffset(
				Math.max((container.clientWidth - chat.clientWidth) / 2, 0),
			);
		};

		updateCenterOffset();

		const resizeObserver = new ResizeObserver(updateCenterOffset);

		if (containerRef.current) {
			resizeObserver.observe(containerRef.current);
		}

		if (chatRef.current) {
			resizeObserver.observe(chatRef.current);
		}

		return () => resizeObserver.disconnect();
	}, []);

	return (
		<div className="relative flex w-full flex-col overflow-x-hidden">
			<Button
				size="icon"
				variant="ghost"
				className="self-end shrink-active"
				onClick={() => setOpen((prev) => !prev)}
				aria-label="Toggle info"
			>
				<Info />
			</Button>

			<div ref={containerRef} className="flex w-full flex-row gap-4">
				{/* chat container */}
				<div
					ref={chatRef}
					className="flex w-full max-w-6xl flex-col gap-2 transition-transform duration-300 ease-out"
					style={{
						transform: `translateX(${open ? 0 : centerOffset}px)`,
					}}
				>
					<ChatMessage
						type="Bot"
						content="Hi, was bauen wir heute?"
					/>
					<ChatMessage
						type="User"
						content="Eine Chat-Komponente mit Storybook-Beispielen."
					/>
					<ChatMessage
						type="Bot"
						content="Perfekt. Ich zeige einzelne Nachrichten und einen kompletten Verlauf."
					/>
				</div>
			</div>

			{/* info panel */}
			<div className="pointer-events-none absolute top-10 right-0 w-64 overflow-visible">
				<aside
					className={
						open
							? "pointer-events-auto w-64 scale-100 translate-x-0 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground opacity-100 transition-all duration-300 ease-out"
							: "pointer-events-none w-64 scale-50 translate-x-64 rounded-lg border border-border bg-card p-4 text-sm text-muted-foreground opacity-0 transition-all duration-300 ease-out"
					}
				>
					Chat details
				</aside>
			</div>
		</div>
	);
}

export const ExampleWithInfoWindow: Story = {
	render: () => <ExampleWithInfoWindowStory />,
};
