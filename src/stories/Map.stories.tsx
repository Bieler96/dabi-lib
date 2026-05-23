import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Map,
	MapControls,
	MapMarker,
	MarkerContent,
	MarkerPopup,
} from "../components/Map";

type MapStoryArgs = {
	className?: string;
};

const meta = {
	title: "Components/Map",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	args: {
		className: "h-[420px] w-[85vw] max-w-4xl overflow-hidden rounded-xl",
	},
	argTypes: {
		className: {
			control: "text",
		},
	},
} satisfies Meta<MapStoryArgs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: (args) => (
		<Map {...args} center={[13.405, 52.52]} zoom={11}>
			<MapControls />
			<MapMarker longitude={13.405} latitude={52.52}>
				<MarkerContent />
				<MarkerPopup>Berlin</MarkerPopup>
			</MapMarker>
		</Map>
	),
};
