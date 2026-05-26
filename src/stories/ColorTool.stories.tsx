import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Clipboard, Palette, Pipette, RotateCcw } from "lucide-react";

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

type Rgb = {
	r: number;
	g: number;
	b: number;
};

type Hsl = {
	h: number;
	s: number;
	l: number;
};

type Shade = {
	name: string;
	hex: string;
	foreground: string;
	contrast: number;
};

const defaultColor = "#10b981";
const shadeStops = [
	{ name: "50", lightness: 96 },
	{ name: "100", lightness: 91 },
	{ name: "200", lightness: 84 },
	{ name: "300", lightness: 73 },
	{ name: "400", lightness: 62 },
	{ name: "500", lightness: 50 },
	{ name: "600", lightness: 42 },
	{ name: "700", lightness: 34 },
	{ name: "800", lightness: 26 },
	{ name: "900", lightness: 20 },
	{ name: "950", lightness: 13 },
];

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

const round = (value: number, decimals = 2) => Number(value.toFixed(decimals));

function normalizeHex(value: string) {
	const trimmed = value.trim().replace("#", "");

	if (/^[\da-f]{3}$/i.test(trimmed)) {
		return `#${trimmed
			.split("")
			.map((char) => char + char)
			.join("")}`.toLowerCase();
	}

	if (/^[\da-f]{6}$/i.test(trimmed)) {
		return `#${trimmed}`.toLowerCase();
	}

	return null;
}

function hexToRgb(hex: string): Rgb {
	const normalized = normalizeHex(hex) ?? defaultColor;
	const value = Number.parseInt(normalized.slice(1), 16);

	return {
		r: (value >> 16) & 255,
		g: (value >> 8) & 255,
		b: value & 255,
	};
}

function componentToHex(value: number) {
	return clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0");
}

function rgbToHex({ r, g, b }: Rgb) {
	return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function rgbToHsl({ r, g, b }: Rgb): Hsl {
	const nextR = r / 255;
	const nextG = g / 255;
	const nextB = b / 255;
	const max = Math.max(nextR, nextG, nextB);
	const min = Math.min(nextR, nextG, nextB);
	const delta = max - min;
	const l = (max + min) / 2;

	if (delta === 0) {
		return { h: 0, s: 0, l: round(l * 100) };
	}

	const s = delta / (1 - Math.abs(2 * l - 1));
	let h = 0;

	if (max === nextR) h = ((nextG - nextB) / delta) % 6;
	if (max === nextG) h = (nextB - nextR) / delta + 2;
	if (max === nextB) h = (nextR - nextG) / delta + 4;

	return {
		h: Math.round((h * 60 + 360) % 360),
		s: round(s * 100),
		l: round(l * 100),
	};
}

function hslToRgb({ h, s, l }: Hsl): Rgb {
	const nextS = clamp(s, 0, 100) / 100;
	const nextL = clamp(l, 0, 100) / 100;
	const c = (1 - Math.abs(2 * nextL - 1)) * nextS;
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = nextL - c / 2;
	let [r, g, b] = [0, 0, 0];

	if (h < 60) [r, g, b] = [c, x, 0];
	else if (h < 120) [r, g, b] = [x, c, 0];
	else if (h < 180) [r, g, b] = [0, c, x];
	else if (h < 240) [r, g, b] = [0, x, c];
	else if (h < 300) [r, g, b] = [x, 0, c];
	else [r, g, b] = [c, 0, x];

	return {
		r: (r + m) * 255,
		g: (g + m) * 255,
		b: (b + m) * 255,
	};
}

function hslToHex(hsl: Hsl) {
	return rgbToHex(hslToRgb(hsl));
}

function getRelativeLuminance({ r, g, b }: Rgb) {
	const [nextR, nextG, nextB] = [r, g, b].map((channel) => {
		const value = channel / 255;
		return value <= 0.03928
			? value / 12.92
			: ((value + 0.055) / 1.055) ** 2.4;
	});

	return 0.2126 * nextR + 0.7152 * nextG + 0.0722 * nextB;
}

function getContrastRatio(colorA: string, colorB: string) {
	const luminanceA = getRelativeLuminance(hexToRgb(colorA));
	const luminanceB = getRelativeLuminance(hexToRgb(colorB));
	const light = Math.max(luminanceA, luminanceB);
	const dark = Math.min(luminanceA, luminanceB);

	return round((light + 0.05) / (dark + 0.05));
}

function getReadableForeground(hex: string) {
	const whiteContrast = getContrastRatio(hex, "#ffffff");
	const blackContrast = getContrastRatio(hex, "#111827");

	return whiteContrast >= blackContrast ? "#ffffff" : "#111827";
}

function createShades(color: string, saturationOffset: number): Shade[] {
	const hsl = rgbToHsl(hexToRgb(color));
	const saturation = clamp(hsl.s + saturationOffset, 8, 96);

	return shadeStops.map((stop) => {
		const lightness =
			stop.name === "500" ? clamp(hsl.l, 34, 62) : stop.lightness;
		const hex = hslToHex({
			h: hsl.h,
			s: saturation,
			l: lightness,
		});
		const foreground = getReadableForeground(hex);

		return {
			name: stop.name,
			hex,
			foreground,
			contrast: getContrastRatio(hex, foreground),
		};
	});
}

function rotateHue(color: string, degrees: number) {
	const hsl = rgbToHsl(hexToRgb(color));
	return hslToHex({ ...hsl, h: (hsl.h + degrees + 360) % 360 });
}

function createCss(shades: Shade[], baseColor: string) {
	const shadeVariables = shades
		.map((shade) => `  --brand-${shade.name}: ${shade.hex};`)
		.join("\n");
	const primary = shades.find((shade) => shade.name === "500") ?? shades[5];
	const foreground = getReadableForeground(primary.hex);

	return `:root {
${shadeVariables}
  --primary: ${primary.hex};
  --primary-foreground: ${foreground};
  --ring: ${baseColor};
  --chart-1: ${primary.hex};
  --chart-2: ${rotateHue(baseColor, 42)};
  --chart-3: ${rotateHue(baseColor, 112)};
  --chart-4: ${rotateHue(baseColor, 188)};
  --chart-5: ${rotateHue(baseColor, 276)};
}`;
}

function ColorTool() {
	const [color, setColor] = React.useState(defaultColor);
	const [saturationOffset, setSaturationOffset] = React.useState(0);
	const [copied, setCopied] = React.useState(false);

	const normalizedColor = normalizeHex(color) ?? defaultColor;
	const hsl = React.useMemo(
		() => rgbToHsl(hexToRgb(normalizedColor)),
		[normalizedColor],
	);
	const shades = React.useMemo(
		() => createShades(normalizedColor, saturationOffset),
		[normalizedColor, saturationOffset],
	);
	const css = React.useMemo(
		() => createCss(shades, normalizedColor),
		[normalizedColor, shades],
	);
	const harmonies = React.useMemo(
		() => [
			{ name: "Base", hex: normalizedColor },
			{ name: "Analog", hex: rotateHue(normalizedColor, 32) },
			{ name: "Triad", hex: rotateHue(normalizedColor, 120) },
			{ name: "Split", hex: rotateHue(normalizedColor, 208) },
			{ name: "Accent", hex: rotateHue(normalizedColor, 276) },
		],
		[normalizedColor],
	);

	const copyCss = async () => {
		await navigator.clipboard.writeText(css);
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1400);
	};

	return (
		<div className="min-h-screen bg-background p-4 text-foreground sm:p-6 lg:p-8">
			<style>
				{`
					.color-tool-layout {
						grid-template-columns: minmax(0, 1fr);
					}

					@media (min-width: 768px) {
						.color-tool-layout {
							grid-template-columns: 20rem minmax(0, 1fr);
						}

						.color-tool-settings {
							position: sticky;
							top: 1.5rem;
							align-self: start;
						}
					}

					@media (min-width: 1280px) {
						.color-tool-layout {
							grid-template-columns: 22rem minmax(0, 1fr);
						}
					}
				`}
			</style>
			<div className="color-tool-layout mx-auto grid w-full max-w-7xl gap-4">
				<aside className="color-tool-settings min-w-0">
					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Settings</CardTitle>
							<CardDescription>
								Farbskala, UI-Tokens und Kontrastwerte.
							</CardDescription>
						</CardHeader>
						<CardContent className="grid gap-5">
							<div className="grid gap-2">
								<Label htmlFor="brand-color">Brand color</Label>
								<div className="grid grid-cols-[3rem_1fr] gap-2">
									<label
										htmlFor="brand-color-picker"
										className="flex h-11 cursor-pointer items-center justify-center rounded-lg border border-input sm:h-8"
										style={{
											backgroundColor: normalizedColor,
										}}
									>
										<Pipette className="size-4 text-white mix-blend-difference" />
									</label>
									<Input
										id="brand-color"
										value={color}
										onChange={(event) =>
											setColor(event.target.value)
										}
									/>
								</div>
								<input
									id="brand-color-picker"
									type="color"
									value={normalizedColor}
									onChange={(event) =>
										setColor(event.target.value)
									}
									className="sr-only"
								/>
							</div>

							<div className="grid gap-2">
								<div className="flex items-center justify-between gap-3">
									<Label>Saturation</Label>
									<span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">
										{saturationOffset > 0 ? "+" : ""}
										{saturationOffset}
									</span>
								</div>
								<Slider
									value={saturationOffset}
									min={-24}
									max={24}
									step={1}
									onValueChange={(value) =>
										setSaturationOffset(
											Array.isArray(value)
												? value[0]
												: value,
										)
									}
								/>
							</div>

							<div className="rounded-lg border p-3">
								<div className="mb-3 flex items-center gap-2 text-sm font-medium">
									<Palette className="size-4" />
									Current color
								</div>
								<div className="grid grid-cols-3 gap-2 font-mono text-xs text-muted-foreground">
									<div>
										H
										<div className="text-foreground">
											{hsl.h}
										</div>
									</div>
									<div>
										S
										<div className="text-foreground">
											{hsl.s}%
										</div>
									</div>
									<div>
										L
										<div className="text-foreground">
											{hsl.l}%
										</div>
									</div>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-2">
								<Button
									type="button"
									variant="outline"
									onClick={() => {
										setColor(defaultColor);
										setSaturationOffset(0);
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
					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Palette</CardTitle>
							<CardDescription>
								Shades fuer Hintergruende, Border und Actions.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid overflow-hidden rounded-lg border sm:grid-cols-11">
								{shades.map((shade) => (
									<div
										key={shade.name}
										className="grid min-h-24 content-between gap-3 p-3"
										style={{
											backgroundColor: shade.hex,
											color: shade.foreground,
										}}
									>
										<div className="font-mono text-xs">
											{shade.name}
										</div>
										<div className="grid gap-1 font-mono text-xs">
											<span>{shade.hex}</span>
											<span>{shade.contrast}:1</span>
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>

					<Card className="rounded-lg">
						<CardHeader>
							<CardTitle>Preview</CardTitle>
							<CardDescription>
								Semantische Tokens in typischen UI-Zustaenden.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 md:grid-cols-[1.1fr_0.9fr]">
								<div
									className="grid min-h-72 content-between rounded-lg p-6"
									style={{
										backgroundColor: shades[1].hex,
										color: shades[9].hex,
									}}
								>
									<div>
										<div className="mb-2 text-sm font-medium">
											Product dashboard
										</div>
										<div className="max-w-md text-3xl font-semibold leading-tight">
											Calm colors, useful contrast and
											clear hierarchy.
										</div>
									</div>
									<div className="flex flex-wrap gap-2">
										<div
											className="rounded-lg px-3 py-2 text-sm font-medium"
											style={{
												backgroundColor: shades[6].hex,
												color: shades[6].foreground,
											}}
										>
											Primary action
										</div>
										<div
											className="rounded-lg border px-3 py-2 text-sm font-medium"
											style={{
												borderColor: shades[4].hex,
												color: shades[8].hex,
											}}
										>
											Secondary
										</div>
									</div>
								</div>

								<div className="grid gap-3">
									{harmonies.map((harmony) => {
										const foreground =
											getReadableForeground(harmony.hex);
										return (
											<button
												key={harmony.name}
												type="button"
												className="grid min-h-16 grid-cols-[1fr_auto] items-center gap-3 rounded-lg border p-3 text-left"
												onClick={() =>
													setColor(harmony.hex)
												}
											>
												<span>
													<span className="block text-sm font-medium">
														{harmony.name}
													</span>
													<span className="font-mono text-xs text-muted-foreground">
														{harmony.hex}
													</span>
												</span>
												<span
													className="size-10 rounded-md"
													style={{
														backgroundColor:
															harmony.hex,
														color: foreground,
													}}
												/>
											</button>
										);
									})}
								</div>
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
	title: "Tools/Color Tool",
	component: ColorTool,
	parameters: {
		layout: "fullscreen",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof ColorTool>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
