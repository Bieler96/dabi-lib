import type { Preview } from "@storybook/react-vite";
import "../src/index.css";

const preview: Preview = {
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		layout: "centered",
	},
	decorators: [
		(Story) => (
			<div className="dabi-theme min-h-screen w-full p-8">
				<Story />
			</div>
		),
	],
};

export default preview;
