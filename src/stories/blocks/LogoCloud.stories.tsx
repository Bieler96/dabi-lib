import type { Meta } from "@storybook/react-vite";
import { LogoCloud } from "../../components/blocks/LogoCloud";

const meta = {
	title: "Blocks/LogoCloud",
	component: LogoCloud,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof LogoCloud>;

export default meta;

export const Default = {
	args: {
		eyebrow: "Trusted by",
		title: "Thousands of teams worldwide",
		subtitle:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
		logos: [
			{
				name: "Company A",
				logo: (
					<img
						src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/6987f7f419f7ea51fb21153f_AlphaWave.svg"
						alt="Company A"
					/>
				),
			},
			{
				name: "Company B",
				logo: (
					<img
						src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/6987f7f5b3f7f93734101c70_Biosynthesis.svg"
						alt="Company B"
					/>
				),
			},
			{
				name: "Company C",
				logo: (
					<img
						src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/6987f7f5ee5826541e69120c_Alt%252BShift.svg"
						alt="Company C"
					/>
				),
			},
			{
				name: "Company D",
				logo: (
					<img
						src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/6987f7f785481737cc3c893f_BuildingBlocks.svg"
						alt="Company D"
					/>
				),
			},
			{
				name: "Company E",
				logo: (
					<img
						src="https://cdn.prod.website-files.com/6365d860c7b7a7191055eb8a/6987f7f99ab5c37f533b03e2_Clandestine.svg"
						alt="Company E"
					/>
				),
			},
		],
	},
};

export const WithoutImages = {
	args: {
		eyebrow: "Trusted by",
		title: "Thousands of teams worldwide",
		subtitle:
			"Lorem ipsum dolor sit amet consectetur adipisicing elit. Odio sed voluptate autem.",
		logos: [
			{
				name: "Company A",
			},
			{
				name: "Company B",
			},
			{
				name: "Company C",
			},
			{
				name: "Company D",
			},
			{
				name: "Company E",
			},
		],
	},
};
