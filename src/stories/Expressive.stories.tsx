import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Bell, Settings } from "lucide-react";
import { useState } from "react";
import { Button } from "../components/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/Card";
import {
	ExpressiveSurface,
	ExpressiveWrapper,
	createExpressiveComponent,
} from "../components/Expressive";

const ExpressiveButton = createExpressiveComponent(Button, {
	size: "md",
	interaction: "scale",
});

function ActiveRadiusDemo() {
	const [active, setActive] = useState(false);

	return (
		<div className="grid gap-4 p-6">
			<ExpressiveSurface
				active={active}
				size="xl"
				activeRadius="sm"
				pressedRadius="xs"
				transitionPreset="emphasized"
			>
				<Card className="w-80 border-border bg-secondary text-secondary-foreground shadow-sm">
					<CardHeader>
						<CardTitle>Toggle active</CardTitle>
					</CardHeader>
					<CardContent>
						<Button
							variant="outline"
							onClick={() => setActive((value) => !value)}
						>
							Toggle radius
						</Button>
					</CardContent>
				</Card>
			</ExpressiveSurface>
		</div>
	);
}

const meta = {
	title: "Components/Expressive",
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Wrappers: Story = {
	render: () => (
		<div className="grid max-w-3xl gap-6 p-6">
			<div className="flex flex-wrap items-center gap-4">
				<ExpressiveWrapper size="sm" interaction="press">
					<Button variant="outline" size="sm">
						<Bell />
						Press
					</Button>
				</ExpressiveWrapper>

				<ExpressiveWrapper size="md" interaction="scale">
					<Button>
						Scale
						<ArrowRight />
					</Button>
				</ExpressiveWrapper>

				<ExpressiveWrapper size="lg" interaction="lift">
					<Button variant="secondary" size="lg">
						<Settings />
						Lift
					</Button>
				</ExpressiveWrapper>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<ExpressiveSurface>
					<Card className="w-full border-border bg-card shadow-sm">
						<CardHeader>
							<CardTitle>Expressive surface</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Hover keeps position stable while active and press
							states can morph the shape.
						</CardContent>
					</Card>
				</ExpressiveSurface>

				<ExpressiveSurface
					active
					size="xl"
					activeRadius="md"
					pressedRadius="sm"
					transitionPreset="emphasized"
				>
					<Card className="w-full border-border bg-secondary text-secondary-foreground shadow-sm">
						<CardHeader>
							<CardTitle>Active radius</CardTitle>
						</CardHeader>
						<CardContent className="text-sm text-muted-foreground">
							Radius morphs on active and pressed states, not on
							hover by default.
						</CardContent>
					</Card>
				</ExpressiveSurface>
			</div>
		</div>
	),
};

export const ComponentFactory: Story = {
	render: () => (
		<div className="flex flex-wrap items-center gap-4 p-6">
			<ExpressiveButton>Factory default</ExpressiveButton>
			<ExpressiveButton
				variant="outline"
				expressive={{
					interaction: "lift",
					size: "lg",
					transitionPreset: "soft",
				}}
			>
				Per instance
			</ExpressiveButton>
		</div>
	),
};

export const ActiveRadius: Story = {
	render: () => <ActiveRadiusDemo />,
};
