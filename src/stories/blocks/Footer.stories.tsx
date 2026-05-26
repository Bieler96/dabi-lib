import type { Meta } from "@storybook/react-vite";
import { Footer } from "../../components/blocks/Footer";

const meta = {
	title: "Blocks/Footer",
	component: Footer,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Footer>;

export default meta;

export const Default = {
	args: {
		brand: "Blocks",
		tagline: "Composable React page blocks for modern websites.",
		columns: [
			{
				title: "Product",
				links: [
					{ label: "Features", to: "/" },
					{ label: "Pricing", to: "/" },
				],
			},
			{
				title: "Company",
				links: [
					{ label: "About", to: "/" },
					{ label: "Contact", to: "/" },
				],
			},
			{
				title: "Legal",
				links: [
					{ label: "Privacy", to: "/" },
					{ label: "Terms", to: "/" },
				],
			},
		],
	},
};
