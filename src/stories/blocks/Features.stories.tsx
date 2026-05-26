import type { Meta } from "@storybook/react-vite";
import { Features } from "../../components/blocks/Features";
import { BarChart3, Globe, Shield, Sparkles, Users, Zap } from "lucide-react";

const meta = {
	title: "Blocks/Features",
	component: Features,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Features>;

export default meta;

export const Default = {
	args: {
		eyebrow: "Our Features",
		title: "What We Offer",
		subtitle:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
		features: [
			{
				icon: Zap,
				title: "Feature One",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
			{
				icon: Shield,
				title: "Feature Two",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
			{
				icon: Sparkles,
				title: "Feature Three",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
			{
				icon: BarChart3,
				title: "Feature Four",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
			{
				icon: Users,
				title: "Feature Five",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
			{
				icon: Globe,
				title: "Feature Six",
				description:
					"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
			},
		],
	},
};
