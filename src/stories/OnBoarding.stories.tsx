import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Bell, Check, Palette, ShieldCheck, Sparkles } from "lucide-react";
import {
	Onboarding,
	OnboardingBody,
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
	const handleComplete = () => {
		setStep(steps.length - 1);
		setCompleted(true);
	};

	return (
		<Onboarding
			layout={layout}
			defaultStep={defaultStep}
			step={controlled ? step : undefined}
			onStepChange={setStep}
			onComplete={handleComplete}
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

						<OnboardingBody>
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
						</OnboardingBody>
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

function SplitScrollableAreasExample() {
	const visualItems = Array.from({ length: 10 }, (_, index) => index + 1);
	const bodyItems = Array.from({ length: 14 }, (_, index) => index + 1);

	return (
		<Onboarding
			layout="split"
			onComplete={() => undefined}
			className="min-h-[720px]"
		>
			<OnboardingHeader>Unabhaengig scrollbar</OnboardingHeader>

			<OnboardingSteps>
				<OnboardingStep>
					<OnboardingVisual className="flex-col justify-start gap-4 p-6 lg:items-stretch">
						{visualItems.map((item) => (
							<div
								key={item}
								className="min-h-24 rounded-2xl border border-foreground/10 bg-background/70 p-4 text-sm text-foreground shadow-sm"
							>
								<p className="font-medium">
									Visual Bereich {item}
								</p>
								<p className="mt-2 text-muted-foreground">
									Dieser Inhalt gehoert zur linken Spalte und
									scrollt getrennt vom Textbereich.
								</p>
							</div>
						))}
					</OnboardingVisual>

					<OnboardingBody>
						<OnboardingTitle>
							Beide Split-Bereiche scrollen fuer sich
						</OnboardingTitle>
						<OnboardingDescription>
							Auf Desktop-Groessen bleibt der Step selbst fest.
							Die linke Visual-Spalte und die rechte
							Body-Spalte haben jeweils ihre eigene Scrollflaeche.
						</OnboardingDescription>
						<OnboardingContent>
							{bodyItems.map((item) => (
								<div
									key={item}
									className="rounded-lg border bg-card p-4 text-sm text-card-foreground shadow-sm"
								>
									<p className="font-medium">
										Body Inhalt {item}
									</p>
									<p className="mt-2 text-muted-foreground">
										Dieser Block gehoert zur rechten Spalte.
										Beim Scrollen bleibt die linke Spalte
										unabhaengig bedienbar.
									</p>
								</div>
							))}
						</OnboardingContent>
					</OnboardingBody>
				</OnboardingStep>
			</OnboardingSteps>

			<OnboardingFooter>
				<OnboardingNext className="w-full" lastLabel="Fertig">
					Weiter
				</OnboardingNext>
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

export const SplitScrollableAreas: Story = {
	render: () => <SplitScrollableAreasExample />,
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
