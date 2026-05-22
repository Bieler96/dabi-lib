import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormBuilder, type FormBuilderField } from "../components/FormBuilder";

type ContactFormValues = {
	name: string;
	email: string;
	role: string;
	budget: number | "";
	message: string;
	newsletter: boolean;
};

const fields: FormBuilderField<ContactFormValues>[] = [
	{
		name: "name",
		label: "Name",
		placeholder: "Jane Doe",
		required: true,
	},
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "jane@example.com",
		required: true,
		validate: (value) =>
			typeof value === "string" && value.includes("@")
				? undefined
				: "Bitte gib eine gueltige Email ein.",
	},
	{
		name: "role",
		type: "select",
		label: "Rolle",
		placeholder: "Rolle auswaehlen",
		options: [
			{ value: "designer", label: "Designer" },
			{ value: "developer", label: "Developer" },
			{ value: "founder", label: "Founder" },
		],
		required: true,
		selectContentProps: {
			alignItemWithTrigger: false,
			align: "start",
			sideOffset: 4,
		},
	},
	{
		name: "budget",
		type: "number",
		label: "Budget",
		placeholder: "5000",
		inputProps: {
			min: 0,
			step: 500,
		},
	},
	{
		name: "message",
		type: "textarea",
		label: "Nachricht",
		placeholder: "Was soll gebaut werden?",
	},
	{
		name: "newsletter",
		type: "checkbox",
		label: "Updates erhalten",
		description: "Schicke mir gelegentlich Produktneuigkeiten.",
	},
];

type LoginFormValues = {
	email: string;
	password: string;
	remember: boolean;
};

const loginFields: FormBuilderField<LoginFormValues>[] = [
	{
		name: "email",
		type: "email",
		label: "Email",
		placeholder: "you@example.com",
		required: true,
	},
	{
		name: "password",
		type: "password",
		label: "Passwort",
		placeholder: "Passwort eingeben",
		required: true,
		validate: (value) =>
			typeof value === "string" && value.length >= 8
				? undefined
				: "Das Passwort muss mindestens 8 Zeichen haben.",
	},
	{
		name: "remember",
		type: "checkbox",
		label: "Angemeldet bleiben",
		description: "Speichert die Sitzung auf diesem Geraet.",
	},
];

type ProjectBriefFormValues = {
	title: string;
	category: string;
	timeline: string;
	budget: number | "";
	details: string;
	nda: boolean;
};

const projectBriefFields: FormBuilderField<ProjectBriefFormValues>[] = [
	{
		name: "title",
		label: "Projektname",
		placeholder: "Website Relaunch",
		required: true,
	},
	{
		name: "category",
		type: "select",
		label: "Kategorie",
		placeholder: "Kategorie waehlen",
		options: [
			{ value: "website", label: "Website" },
			{ value: "shop", label: "Online-Shop" },
			{ value: "app", label: "App" },
			{ value: "branding", label: "Branding" },
		],
		required: true,
	},
	{
		name: "timeline",
		type: "select",
		label: "Zeitrahmen",
		placeholder: "Zeitrahmen waehlen",
		options: [
			{ value: "soon", label: "So schnell wie moeglich" },
			{ value: "month", label: "Innerhalb eines Monats" },
			{ value: "quarter", label: "Dieses Quartal" },
			{ value: "flexible", label: "Flexibel" },
		],
	},
	{
		name: "budget",
		type: "number",
		label: "Budget",
		placeholder: "10000",
		inputProps: {
			min: 0,
			step: 1000,
		},
	},
	{
		name: "details",
		type: "textarea",
		label: "Kurzbeschreibung",
		placeholder: "Beschreibe Ziel, Umfang und wichtige Anforderungen.",
		required: true,
		validate: (value) =>
			typeof value === "string" && value.length >= 20
				? undefined
				: "Bitte beschreibe das Projekt etwas genauer.",
	},
	{
		name: "nda",
		type: "checkbox",
		label: "NDA erforderlich",
		description: "Das Projekt enthaelt vertrauliche Informationen.",
	},
];

const meta = {
	title: "Components/FormBuilder",
	component: FormBuilder,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<typeof FormBuilder>;

export default meta;
type Story = StoryObj;

export const Default: Story = {
	render: () => (
		<div className="w-[min(520px,calc(100vw-2rem))]">
			<FormBuilder<ContactFormValues>
				fields={fields}
				defaultValues={{
					role: "developer",
					newsletter: true,
				}}
				submitLabel="Absenden"
				showReset
				resetLabel="Zuruecksetzen"
				onSubmit={(values) => console.log(values)}
			/>
		</div>
	),
};

export const Login: Story = {
	render: () => (
		<div className="w-[min(420px,calc(100vw-2rem))]">
			<FormBuilder<LoginFormValues>
				fields={loginFields}
				defaultValues={{
					remember: true,
				}}
				submitLabel="Einloggen"
				showReset
				resetLabel="Leeren"
				onSubmit={(values) => console.log(values)}
			/>
		</div>
	),
};

export const ProjectBrief: Story = {
	render: () => (
		<div className="w-[min(560px,calc(100vw-2rem))]">
			<FormBuilder<ProjectBriefFormValues>
				fields={projectBriefFields}
				defaultValues={{
					category: "website",
					timeline: "month",
				}}
				submitLabel="Briefing senden"
				showReset
				resetLabel="Zuruecksetzen"
				onSubmit={(values) => console.log(values)}
			/>
		</div>
	),
};
