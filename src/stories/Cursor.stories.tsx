import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cursor } from "../components/cursor/Cursor";

const meta = {
	title: "Components/Cursor",
	component: Cursor,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Cursor>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="min-h-screen bg-neutral-50 px-8 py-10 text-neutral-950">
			<Cursor />

			<div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-5xl flex-col justify-center gap-10">
				<div className="max-w-2xl space-y-4">
					<p className="text-sm font-medium uppercase tracking-[0.18em] text-neutral-500">
						Cursor
					</p>
					<h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
						Magnetic hover targets
					</h1>
					<p className="text-lg leading-8 text-neutral-600">
						Move the pointer across the buttons and panels to see
						the cursor lock to elements marked with{" "}
						<code>data-cursor</code>.
					</p>
				</div>

				<div className="grid gap-4 md:grid-cols-3">
					<button
						type="button"
						data-cursor
						data-cursor-radius="20"
						className="h-14 rounded-2xl bg-neutral-950 px-6 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800"
					>
						Primary action
					</button>
					<button
						type="button"
						data-cursor
						data-cursor-radius="999"
						className="h-14 rounded-full border border-neutral-300 bg-white px-6 text-sm font-medium text-neutral-950 shadow-sm transition hover:border-neutral-950"
					>
						Rounded action
					</button>
					<a
						href="#cursor-card"
						data-cursor
						data-cursor-radius="14"
						className="flex h-14 items-center justify-center rounded-xl bg-lime-300 px-6 text-sm font-semibold text-neutral-950 transition hover:bg-lime-200"
					>
						Linked target
					</a>
				</div>

				<div className="grid gap-4 md:grid-cols-2">
					<div
						id="cursor-card"
						data-cursor
						data-cursor-radius="24"
						className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
					>
						<h2 className="text-xl font-semibold">Large target</h2>
						<p className="mt-3 text-sm leading-6 text-neutral-600">
							The cursor expands to the dimensions of the hovered
							element with a soft inset around it.
						</p>
					</div>

					<div
						data-cursor
						data-cursor-variant="grow"
						className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm"
					>
						<h2 className="text-xl font-semibold">Grow movement</h2>
						<p className="mt-3 text-sm leading-6 text-neutral-600">
							The cursor grows from its center to create a large
							circular target
						</p>
					</div>

					<div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
						<h2 className="text-xl font-semibold">Text movement</h2>
						<p
							data-cursor
							data-cursor-variant="text"
							className="mt-3 text-sm leading-6 text-neutral-600"
						>
							The cursor forms into a pill to better select text.
						</p>
					</div>

					<div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
						<h2 className="text-xl font-semibold">
							Default movement
						</h2>
						<p className="mt-3 text-sm leading-6 text-neutral-600">
							Areas without the data attribute keep the cursor in
							its compact default state.
						</p>
					</div>
				</div>
			</div>
		</div>
	),
};
