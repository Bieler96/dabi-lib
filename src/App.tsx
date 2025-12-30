import { useState } from "react";
import { Button } from "./components/Button";
import { NavHost, useNavigation } from "./core/Router";
import { Sheet } from "./components/Sheet";
import { DataTableDemo, UserDetailsSheet } from "./screens/DataTableDemo";

// Screens.tsx
const HomeScreen = () => {
	const nav = useNavigation();
	return (
		<div className="p-8">
			<h1 className="text-3xl font-bold mb-6">Dabi-lib Components</h1>
			<div className="flex flex-col gap-4 items-start">
				<Button variant="filled" onClick={() => nav.navigate('details', { id: 42 })}>Go to Router Demo</Button>
				<Button variant="outlined" onClick={() => nav.navigate('sheet-demo')}>Go to Sheet Demo</Button>
				<Button variant="outlined" onClick={() => nav.navigate('datatable-demo')}>Go to DataTable Demo</Button>
			</div>
		</div>
	);
};

const SheetDemo = () => {
	const [activeSheet, setActiveSheet] = useState<"left" | "right" | "top" | "bottom" | null>(null);

	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-6">Sheet Side Demo</h1>
			<div className="grid grid-cols-2 gap-4 max-w-md">
				<Button variant="tonal" onClick={() => setActiveSheet("left")}>Open Left</Button>
				<Button variant="tonal" onClick={() => setActiveSheet("right")}>Open Right</Button>
				<Button variant="tonal" onClick={() => setActiveSheet("top")}>Open Top</Button>
				<Button variant="tonal" onClick={() => setActiveSheet("bottom")}>Open Bottom</Button>
			</div>

			<Sheet
				isOpen={activeSheet !== null}
				onClose={() => setActiveSheet(null)}
				side={activeSheet || "right"}
				title={`Sheet ${activeSheet}`}
				description={`This is the ${activeSheet} side navigation panel.`}
			>
				<div className="py-4">
					<p className="text-on-surface-variant">
						Content for the {activeSheet} sheet goes here.
						You can put anything inside!
					</p>
					<div className="mt-8 flex flex-col gap-2">
						<Button variant="filled" onClick={() => setActiveSheet(null)}>Close Action</Button>
						<Button variant="ghost" onClick={() => setActiveSheet(null)}>Cancel</Button>
					</div>
				</div>
			</Sheet>
		</div>
	);
};

const DetailsScreen = ({ id }: { id: number }) => {
	const nav = useNavigation();
	return (
		<div className="p-8">
			<h1 className="text-2xl font-bold mb-4">Details Screen (ID: {id})</h1>
			<div className="flex flex-col gap-4 items-start">
				<Button onClick={() => nav.navigate('confirm-dialog')}>
					Open Dialog
				</Button>
				<Button onClick={() => nav.navigate('options-sheet')}>
					Open Bottom Sheet (Router)
				</Button>
				<Button onClick={() => nav.navigate('settings-sheet')}>
					Open Right Sheet (Router)
				</Button>
				<Button variant="ghost" onClick={() => nav.popBackStack()}>
					Back
				</Button>
			</div>
		</div>
	);
};

const SettingsPage = () => {
	const nav = useNavigation();
	return (
		<div className="flex flex-col gap-4">
			<div className="space-y-4">
				<div className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/50">
					<span>Dark Mode</span>
					<div className="w-10 h-6 bg-primary rounded-full" />
				</div>
				<div className="flex items-center justify-between p-3 rounded-lg bg-surface-variant/50">
					<span>Notifications</span>
					<div className="w-10 h-6 bg-outline-variant rounded-full" />
				</div>
			</div>
			<Button variant="filled" className="mt-4" onClick={() => nav.popBackStack()}>
				Save Changes
			</Button>
		</div>
	);
};

const ConfirmDialog = () => {
	const nav = useNavigation();
	return (
		<div className="flex flex-col gap-2 p-2">
			<h3 className="text-lg font-semibold">Wirklich löschen?</h3>
			<p className="text-on-surface-variant">Diese Aktion kann nicht rückgängig gemacht werden.</p>
			<div className="flex flex-row gap-2 justify-end mt-4">
				<Button variant="ghost" onClick={nav.popBackStack}>Abbrechen</Button>
				<Button variant="filled" onClick={nav.popBackStack}>Löschen</Button>
			</div>
		</div>
	);
};

const OptionsSheet = () => {
	return (
		<div className="p-2">
			<h3 className="text-lg font-semibold mb-4">Optionen</h3>
			<div className="flex flex-col gap-2">
				<Button variant="ghost" className="justify-start">Teilen</Button>
				<Button variant="ghost" className="justify-start">Kopieren</Button>
				<Button variant="ghost" className="justify-start">Verschieben</Button>
			</div>
		</div>
	);
};

// App.tsx
export default function App() {
	return (
		<NavHost
			startDestination="home"
			builder={(nav) => {
				nav.screen('home', HomeScreen);
				nav.screen('sheet-demo', SheetDemo);
				nav.screen('details', DetailsScreen);
				nav.screen('datatable-demo', DataTableDemo);

				nav.dialog('confirm-dialog', ConfirmDialog);
				nav.bottomSheet('options-sheet', OptionsSheet);
				nav.sheet('settings-sheet', SettingsPage, {
					side: 'right',
					title: 'Settings',
					description: 'Manage your application preferences'
				});
				nav.sheet('user-details', UserDetailsSheet, {
					side: 'right',
					title: 'Benutzerdetails',
					description: 'Detaillierte Informationen und Aktionen'
				});
			}}
		/>
	);
}