import type { Meta, StoryObj } from "@storybook/react-vite";

import {
	Map,
	MapControls,
	MapGeoJSONLayer,
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

const berlinGeoJson = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: { name: "Mitte delivery zone" },
			geometry: {
				type: "Polygon",
				coordinates: [
					[
						[13.376, 52.53],
						[13.43, 52.53],
						[13.43, 52.5],
						[13.376, 52.5],
						[13.376, 52.53],
					],
				],
			},
		},
		{
			type: "Feature",
			properties: { name: "Spree route" },
			geometry: {
				type: "LineString",
				coordinates: [
					[13.365, 52.518],
					[13.39, 52.52],
					[13.421, 52.516],
				],
			},
		},
	],
} satisfies GeoJSON.FeatureCollection;

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

export const GeoJSON: Story = {
	render: (args) => (
		<Map {...args} center={[13.405, 52.52]} zoom={12}>
			<MapControls />
			<MapGeoJSONLayer data={berlinGeoJson} fitBounds />
		</Map>
	),
};
