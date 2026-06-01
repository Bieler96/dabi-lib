import type { Meta } from "@storybook/react-vite";
import { CTA } from "../../components/blocks/CTA";

const meta = {
	title: "Blocks/CTA",
	component: CTA,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof CTA>;

export default meta;

export const Default = {
	args: {
		title: "Ready to get started?",
		subtitle: "Join us today and experience the difference!",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
	},
};
