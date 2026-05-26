import { cva } from "class-variance-authority";
import { cn } from "../utils/cn";

type ChatMessageType = "User" | "Bot";

interface ChatMessageProps {
	type: ChatMessageType;
	content: string;
	timestamp?: Date | null;
}

const ChatMessageStyle = cva("", {
	variants: {
		type: {
			User: "bg-primary text-primary-foreground",
			Bot: "text-foreground",
		},
	},
});

const ChatMessageWrapperStyle = cva("", {
	variants: {
		type: {
			User: "self-end items-end",
			Bot: "self-start items-start",
		},
	},
});

const ChatMessageTimestampStyle = cva("", {
	variants: {
		type: {
			User: "right-1 text-foreground/70",
			Bot: "left-1 text-foreground/70",
		},
	},
});

function ChatMessage({ type, content, timestamp = null }: ChatMessageProps) {
	return (
		<div
			className={cn(
				"group relative flex max-w-[80%] flex-col",
				ChatMessageWrapperStyle({ type }),
			)}
		>
			<div
				className={cn(
					"rounded-lg p-4 text-sm whitespace-pre-wrap",
					ChatMessageStyle({ type }),
				)}
			>
				{content}
			</div>
			{timestamp && (
				<div
					className={cn(
						"pointer-events-none absolute top-full mt-1 px-1 text-xs opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100",
						ChatMessageTimestampStyle({ type }),
					)}
				>
					{timestamp.toLocaleTimeString()}
				</div>
			)}
		</div>
	);
}

export { ChatMessage };
