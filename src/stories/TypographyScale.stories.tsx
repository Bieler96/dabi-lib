import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clipboard, RotateCcw } from "lucide-react";

import { Button } from "../components/Button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../components/Card";
import { Input } from "../components/Input";
import { Label } from "../components/Label";
import { Slider } from "../components/Slider";

type ScaleStep = {
	name: string;
	level: number;
	pixels: number;
	rem: number;
	lineHeight: number;
	letterSpacing: string;
};

const perfectFourthRatio = 1.333;
const stepNames = ["xs", "sm", "base", "lg", "xl", "2xl", "3xl", "4xl"];

const round = (value: number, decimals = 3) => Number(value.toFixed(decimals));

const formatPx = (value: number) => `${round(value, 2)}px`;

const formatRem = (value: number) => `${round(value, 3)}rem`;

const getLineHeight = (pixels: number) => {
	if (pixels < 14) return 1.5;
	if (pixels < 22) return 1.45;
	if (pixels < 34) return 1.25;
	return 1.12;
};

const getLetterSpacing = (pixels: number) => {
	if (pixels >= 48) return "-0.02em";
	if (pixels >= 32) return "-0.01em";
	return "0em";
};

function createScale(baseSize: number, ratio: number): ScaleStep[] {
	return stepNames.map((name, index) => {
		const level = index - 2;
		const pixels = round(baseSize * ratio ** level, 2);

		return {
			name,
			level,
			pixels,
			rem: round(pixels / 16, 3),
			lineHeight: getLineHeight(pixels),
			letterSpacing: getLetterSpacing(pixels),
		};
	});
}

function createCss(scale: ScaleStep[]) {
	const variables = scale
		.map(
			(step) =>
				`  --text-${step.name}: ${formatRem(step.rem)}; --leading-${step.name}: ${step.lineHeight}; --tracking-${step.name}: ${step.letterSpacing};`,
		)
		.join("\n");

	return `:root {\n${variables}\n}`;
}

function TypographyScaleTool() {
	const [baseSize, setBaseSize] = React.useState(16);
	const [sampleText, setSampleText] = React.useState(
		"Design systems need rhythm, contrast and calm.",
	);
	const [copied, setCopied] = React.useState(false);

	const scale = React.useMemo(
		() => createScale(baseSize, perfectFourthRatio),
		[baseSize],
	);
	const css = React.useMemo(() => createCss(scale), [scale]);
	const headlineStep = scale[scale.length - 1];
	const bodyStep = scale.find((step) => step.name === "base") ?? scale[2];

	const copyCss = async () => {
		await navigator.clipboard.writeText(css);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<div className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
			<style>
				{`
					.typography-scale-layout {
						grid-template-columns: minmax(0, 1fr);
					}

					@media (min-width: 768px) {
						.typography-scale-layout {
							grid-template-columns: 20rem minmax(0, 1fr);
						}

						.typography-scale-settings {
							position: sticky;
							top: 1.5rem;
							align-self: start;
						}
					}

					@media (min-width: 1280px) {
						.typography-scale-layout {
							grid-template-columns: 22rem minmax(0, 1fr);
						}
					}
				`}
			</style>
			<div className="typography-scale-layout mx-auto grid w-full max-w-7xl gap-4">
				<aside className="typography-scale-settings min-w-0">
					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>
								Modulare Groessen fuer UI, Headlines und Tokens.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-5">
							<div className="grid gap-2">
								<div className="flex items-center justify-between gap-3">
									<Label htmlFor="base-size">
										Basisgroesse
									</Label>
									<span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
										{baseSize}px
									</span>
								</div>
								<Slider
									value={baseSize}
									min={12}
									max={22}
									step={1}
									onValueChange={(value) =>
										setBaseSize(
											Array.isArray(value)
												? value[0]
												: value,
										)
									}
								/>
								<Input
									id="base-size"
									type="number"
									min={12}
									max={22}
									value={baseSize}
									onChange={(event) =>
										setBaseSize(Number(event.target.value))
									}
								/>
							</div>

							<div className="grid gap-2">
								<Label htmlFor="sample-text">
									Preview text
								</Label>
								<Input
									id="sample-text"
									value={sampleText}
									onChange={(event) =>
										setSampleText(event.target.value)
									}
								/>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setBaseSize(16);
									}}
								>
									<RotateCcw />
									Reset
								</Button>
								<Button type="button" onClick={copyCss}>
									<Clipboard />
									{copied ? "Copied" : "Copy CSS"}
								</Button>
							</div>
						</CardContent>
					</Card>
				</aside>

				<main className="grid min-w-0 gap-4">
					<Card className="min-h-[28rem] rounded-lg">
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription>
								Perfect Fourth 1.333 mit {baseSize}px Basis.
							</CardDescription>
						</CardHeader>
						<CardContent className="flex min-h-80 items-center">
							<div className="grid w-full gap-5 border-y py-8">
								<h1
									className="max-w-4xl font-semibold"
									style={{
										fontSize: formatPx(headlineStep.pixels),
										lineHeight: headlineStep.lineHeight,
										letterSpacing:
											headlineStep.letterSpacing,
									}}
								>
									{sampleText}
								</h1>
								<p
									className="max-w-2xl text-muted-foreground"
									style={{
										fontSize: formatPx(bodyStep.pixels),
										lineHeight: bodyStep.lineHeight,
									}}
								>
									Die Skala erzeugt konsistente Schritte fuer
									Produkttexte, Dashboards und redaktionelle
									Flaechen.
								</p>
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Scale</CardTitle>
							<CardDescription>
								Pixel, rem, line-height und tracking pro Stufe.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-2">
								{scale
									.slice()
									.reverse()
									.map((step) => (
										<div
											key={step.name}
											className="grid gap-3 rounded-lg border p-3 md:grid-cols-[5rem_8rem_1fr]"
										>
											<div className="font-mono text-sm text-muted-foreground">
												{step.name}
											</div>
											<div className="grid content-start gap-1 font-mono text-xs text-muted-foreground">
												<span>
													{formatPx(step.pixels)}
												</span>
												<span>
													{formatRem(step.rem)}
												</span>
												<span>
													lh {step.lineHeight}
												</span>
											</div>
											<div
												className="min-w-0 truncate font-medium"
												style={{
													fontSize: formatPx(
														step.pixels,
													),
													lineHeight: step.lineHeight,
													letterSpacing:
														step.letterSpacing,
												}}
											>
												{sampleText}
											</div>
										</div>
									))}
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>CSS Variables</CardTitle>
							<CardDescription>
								Tokens fuer direkte Nutzung im Projekt.
							</CardDescription>
							<CardAction>
								<Button
									type="button"
									size="icon-sm"
									variant="ghost"
									aria-label="Copy CSS"
									onClick={copyCss}
								>
									<Clipboard />
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent>
							<pre className="overflow-x-auto rounded-lg bg-muted p-4 text-xs leading-relaxed">
								<code>{css}</code>
							</pre>
						</CardContent>
					</Card>
				</main>
			</div>
		</div>
	);
}

const meta = {
	title: "Tools/Typography Scale",
	component: TypographyScaleTool,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof TypographyScaleTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
