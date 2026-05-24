import type { Meta, StoryObj } from "@storybook/react";
import {
	Bell,
	ChevronRight,
	CreditCard,
	Moon,
	Settings,
	User,
} from "lucide-react";
import { List } from "../components/List";

const meta: Meta<typeof List> = {
	title: "Components/List",
	component: List,
	parameters: {
		layout: "centered",
	},
};

export default meta;

type Story = StoryObj<typeof List>;

export const Basic: Story = {
	render: () => (
		<div className="w-95">
			<List>
				<List.Item>
					<List.Content>
						<List.Title>Einfacher Eintrag</List.Title>
					</List.Content>
				</List.Item>

				<List.Divider />

				<List.Item>
					<List.Content>
						<List.Title>Zweiter Eintrag</List.Title>
						<List.Description>
							Mit zusätzlicher Beschreibung
						</List.Description>
					</List.Content>
				</List.Item>
			</List>
		</div>
	),
};

export const WithIcons: Story = {
	render: () => (
		<div className="w-95">
			<List>
				<List.Item>
					<List.Leading>
						<Bell size={20} />
					</List.Leading>

					<List.Content>
						<List.Title>Benachrichtigungen</List.Title>
						<List.Description>
							Push, E-Mail und Updates
						</List.Description>
					</List.Content>

					<List.Trailing>
						<ChevronRight size={18} />
					</List.Trailing>
				</List.Item>

				<List.Divider />

				<List.Item>
					<List.Leading>
						<Moon size={20} />
					</List.Leading>

					<List.Content>
						<List.Title>Dark Mode</List.Title>
						<List.Description>
							Systemeinstellung verwenden
						</List.Description>
					</List.Content>

					<List.Trailing>
						<ChevronRight size={18} />
					</List.Trailing>
				</List.Item>
			</List>
		</div>
	),
};

export const SettingsList: Story = {
	render: () => (
		<div className="w-105">
			<List>
				<List.Subheader>Account</List.Subheader>

				<List.Item onClick={() => console.log("profile")}>
					<List.Leading>
						<User size={20} />
					</List.Leading>

					<List.Content>
						<List.Title>Profil</List.Title>
						<List.Description>
							Name, Avatar und persönliche Daten
						</List.Description>
					</List.Content>

					<List.Trailing>
						<ChevronRight size={18} />
					</List.Trailing>
				</List.Item>

				<List.Divider />

				<List.Item onClick={() => console.log("billing")}>
					<List.Leading>
						<CreditCard size={20} />
					</List.Leading>

					<List.Content>
						<List.Title>Abrechnung</List.Title>
						<List.Description>
							Zahlungsmethoden und Rechnungen
						</List.Description>
					</List.Content>

					<List.Trailing>
						<ChevronRight size={18} />
					</List.Trailing>
				</List.Item>

				<List.Subheader>System</List.Subheader>

				<List.Item onClick={() => console.log("settings")}>
					<List.Leading>
						<Settings size={20} />
					</List.Leading>

					<List.Content>
						<List.Title>Einstellungen</List.Title>
						<List.Description>
							App-Verhalten konfigurieren
						</List.Description>
					</List.Content>

					<List.Trailing>
						<ChevronRight size={18} />
					</List.Trailing>
				</List.Item>
			</List>
		</div>
	),
};

export const AvatarList: Story = {
	render: () => (
		<div className="w-105">
			<List>
				<List.Item>
					<List.Leading>
						<div className="flex size-10 items-center justify-center rounded-full bg-muted font-medium">
							DB
						</div>
					</List.Leading>

					<List.Content>
						<List.Title>David Bieler</List.Title>
						<List.Description>Frontend Developer</List.Description>
					</List.Content>

					<List.Trailing>
						<List.Meta>Online</List.Meta>
					</List.Trailing>
				</List.Item>

				<List.Divider />

				<List.Item>
					<List.Leading>
						<div className="flex size-10 items-center justify-center rounded-full bg-muted font-medium">
							MK
						</div>
					</List.Leading>

					<List.Content>
						<List.Title>Max Keller</List.Title>
						<List.Description>UI Designer</List.Description>
					</List.Content>

					<List.Trailing>
						<List.Meta>12:30</List.Meta>
					</List.Trailing>
				</List.Item>
			</List>
		</div>
	),
};
