import type { Meta } from "@storybook/react-vite";
import { Hero } from "../../components/blocks/Hero";

const meta = {
	title: "Blocks/Hero",
	component: Hero,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;

export const Default = {
	args: {
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const NoImage = {
	args: {
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
	},
};

export const NoSecondaryCta = {
	args: {
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const NoEyebrow = {
	args: {
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const NoSubtitle = {
	args: {
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const LayoutSplit = {
	args: {
		layout: "split",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const LayoutCentered = {
	args: {
		layout: "centered",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
	},
};

export const LayoutStacked = {
	args: {
		layout: "stacked",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const VariantSplit = {
	args: {
		variant: "split",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const VariantCentered = {
	args: {
		variant: "centered",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
	},
};

export const VariantApple = {
	args: {
		variant: "apple",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};

export const VariantSaas = {
	args: {
		variant: "saas",
		eyebrow: "Introducing",
		title: "The Ultimate Product for Your Needs",
		subtitle:
			"Discover the features and benefits of our product that will revolutionize your workflow.",
		primaryCta: { label: "Get Started", to: "/get-started" },
		secondaryCta: { label: "Learn More", to: "/learn-more" },
		image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
	},
};
