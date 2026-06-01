import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Check, Palette, ShieldCheck, Sparkles } from "lucide-react";
import {
	Onboarding,
	OnboardingContent,
	OnboardingDescription,
	OnboardingFooter,
	OnboardingHeader,
	OnboardingNext,
	OnboardingSkip,
	OnboardingStep,
	OnboardingSteps,
	OnboardingTitle,
	OnboardingVisual,
} from "../components/OnBoarding";

const steps = [
	{
		icon: Sparkles,
		title: "Willkommen in deinem Workspace",
		description:
			"Richte die wichtigsten Grundlagen ein und starte mit einer Oberflaeche, die sich schnell und fokussiert anfuehlt.",
		content: [
			"Persoenliche Startansicht",
			"Kurze Wege zu haeufigen Aktionen",
		],
	},
	{
		icon: Palette,
		title: "Passe den Look an",
		description:
			"Wahle Akzente und Layouts, die zu deiner Arbeitsweise passen. Die Einstellungen lassen sich spaeter jederzeit aendern.",
		content: [
			"Helle und dunkle Darstellung",
			"Kompakte oder grosszuegige Ansicht",
		],
	},
	{
		icon: Bell,
		title: "Bleib auf dem Laufenden",
		description:
			"Entscheide, welche Hinweise wirklich wichtig sind, damit Benachrichtigungen hilfreich bleiben.",
		content: ["Projektupdates", "Erwaehnungen und Freigaben"],
	},
	{
		icon: ShieldCheck,
		title: "Alles bereit",
		description:
			"Dein Onboarding ist abgeschlossen. Du kannst direkt loslegen oder die Einstellungen noch einmal pruefen.",
		content: ["Sichere Defaults", "Jederzeit anpassbar"],
	},
];

function OnboardingExample({
	layout = "stack",
	defaultStep = 0,
	controlled = false,
	showSkip = true,
}: {
	layout?: "stack" | "split";
	defaultStep?: number;
	controlled?: boolean;
	showSkip?: boolean;
}) {
	const [step, setStep] = useState(defaultStep);
	const [completed, setCompleted] = useState(false);

	return (
		<Onboarding
			layout={layout}
			defaultStep={defaultStep}
			step={controlled ? step : undefined}
			onStepChange={setStep}
			onComplete={() => setCompleted(true)}
			className="min-h-[720px]"
		>
			<OnboardingHeader>
				{completed
					? "Abgeschlossen"
					: `Schritt ${step + 1} von ${steps.length}`}
			</OnboardingHeader>

			<OnboardingSteps>
				{steps.map(({ icon: Icon, title, description, content }) => (
					<OnboardingStep key={title}>
						<OnboardingVisual>
							<Icon className="size-16" strokeWidth={1.5} />
						</OnboardingVisual>

						<div>
							<OnboardingTitle>{title}</OnboardingTitle>
							<OnboardingDescription>
								{description}
							</OnboardingDescription>
							<OnboardingContent>
								{content.map((item) => (
									<div
										key={item}
										className="flex items-center gap-3 rounded-lg border bg-card px-4 py-3 text-sm text-card-foreground shadow-sm"
									>
										<span className="flex size-6 items-center justify-center rounded-full bg-primary text-primary-foreground">
											<Check className="size-3.5" />
										</span>
										{item}
									</div>
								))}
							</OnboardingContent>
						</div>
					</OnboardingStep>
				))}
			</OnboardingSteps>

			<OnboardingFooter>
				<div className={showSkip ? "flex gap-3" : undefined}>
					{showSkip && (
						<OnboardingSkip className="flex-1">
							Ueberspringen
						</OnboardingSkip>
					)}
					<OnboardingNext className="flex-1" lastLabel="Loslegen">
						Weiter
					</OnboardingNext>
				</div>
			</OnboardingFooter>
		</Onboarding>
	);
}

const meta = {
	title: "Components/OnBoarding",
	component: Onboarding,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
	argTypes: {
		layout: {
			control: "select",
			options: ["stack", "split"],
		},
		defaultStep: {
			control: {
				type: "number",
				min: 0,
				max: steps.length - 1,
			},
		},
	},
	args: {
		layout: "stack",
		defaultStep: 0,
	},
	render: (args) => <OnboardingExample {...args} />,
} satisfies Meta<typeof Onboarding>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Stack: Story = {};

export const Split: Story = {
	args: {
		layout: "split",
	},
};

export const StartAtThirdStep: Story = {
	args: {
		defaultStep: 2,
	},
};

export const Controlled: Story = {
	render: (args) => <OnboardingExample {...args} controlled />,
};

export const WithoutSkip: Story = {
	render: (args) => <OnboardingExample {...args} showSkip={false} />,
};
