import * as React from "react";
import {
	BarChart3,
	ChevronRight,
	Folder,
	Home,
	Layers,
	Plus,
	Settings,
} from "lucide-react";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "./components/Collapsible";
import {
	FormBuilder,
	type FormBuilderField,
} from "./components/FormBuilder";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarRail,
	SidebarSeparator,
	SidebarTrigger,
} from "./components/Sidebar";

type SidebarMenuItemConfig = {
	id: string;
	title: string;
	description: string;
	icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type SidebarMenuGroupConfig = {
	id: string;
	label: string;
	items: SidebarMenuItemConfig[];
};

type NewSidebarItemFormValues = {
	title: string;
	groupId: string;
};

type NewSidebarGroupFormValues = {
	label: string;
};

const UNGROUPED_GROUP_ID = "__ungrouped__";

const initialUngroupedMenuItems: SidebarMenuItemConfig[] = [
	{
		id: "dashboard",
		title: "Dashboard",
		description: "Kennzahlen und aktuelle Aktivitaeten",
		icon: Home,
	},
	{
		id: "projects",
		title: "Projekte",
		description: "Alle laufenden Projektbereiche",
		icon: Folder,
	},
];

const initialMenuGroups: SidebarMenuGroupConfig[] = [
	{
		id: "workspace",
		label: "Workspace",
		items: [
			{
				id: "analytics",
				title: "Analytics",
				description: "Reports, Trends und Auswertungen",
				icon: BarChart3,
			},
			{
				id: "settings",
				title: "Einstellungen",
				description: "Workspace und Nutzerverwaltung",
				icon: Settings,
			},
		],
	},
];

function createMenuItem(title: string): SidebarMenuItemConfig {
	const id = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

	return {
		id,
		title,
		description: `Dynamisch erstellte Seite fuer ${title}`,
		icon: Layers,
	};
}

function createMenuGroup(label: string): SidebarMenuGroupConfig {
	const id = `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

	return {
		id,
		label,
		items: [],
	};
}

function getMenuItems(
	ungroupedItems: SidebarMenuItemConfig[],
	groups: SidebarMenuGroupConfig[],
) {
	return [
		...ungroupedItems,
		...groups.flatMap((group) => group.items),
	];
}

function SidebarMenuEntry({
	item,
	isActive,
	onSelect,
}: {
	item: SidebarMenuItemConfig;
	isActive: boolean;
	onSelect: () => void;
}) {
	const Icon = item.icon;

	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				isActive={isActive}
				tooltip={item.title}
				onClick={onSelect}
			>
				<Icon />
				<span>{item.title}</span>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}

function CollapsibleSidebarGroup({
	group,
	activeItemId,
	onSelectItem,
}: {
	group: SidebarMenuGroupConfig;
	activeItemId: string;
	onSelectItem: (itemId: string) => void;
}) {
	const [open, setOpen] = React.useState(true);

	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<SidebarGroup>
				<CollapsibleTrigger className="flex h-8 w-full items-center gap-2 rounded-md px-2 text-left text-xs font-medium text-sidebar-foreground/70 ring-sidebar-ring outline-hidden transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 group-data-[collapsible=icon]:hidden">
					<ChevronRight
						className={
							open
								? "size-4 rotate-90 transition-transform"
								: "size-4 transition-transform"
						}
					/>
					<span className="truncate">{group.label}</span>
				</CollapsibleTrigger>
				<CollapsibleContent>
					<SidebarGroupContent>
						<SidebarMenu>
							{group.items.map((item) => (
								<SidebarMenuEntry
									key={item.id}
									item={item}
									isActive={activeItemId === item.id}
									onSelect={() => onSelectItem(item.id)}
								/>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</CollapsibleContent>
			</SidebarGroup>
		</Collapsible>
	);
}

function App() {
	const [ungroupedMenuItems, setUngroupedMenuItems] = React.useState<
		SidebarMenuItemConfig[]
	>(initialUngroupedMenuItems);
	const [menuGroups, setMenuGroups] =
		React.useState<SidebarMenuGroupConfig[]>(initialMenuGroups);
	const [activeItemId, setActiveItemId] = React.useState(
		initialUngroupedMenuItems[0].id,
	);
	const [formValues, setFormValues] =
		React.useState<NewSidebarItemFormValues>({
			title: "",
			groupId: UNGROUPED_GROUP_ID,
		});
	const [groupFormValues, setGroupFormValues] =
		React.useState<NewSidebarGroupFormValues>({
			label: "",
		});

	const formFields = React.useMemo<
		FormBuilderField<NewSidebarItemFormValues>[]
	>(
		() => [
			{
				name: "title",
				label: "Titel",
				placeholder: "z.B. Kunden",
				required: true,
				validate: (value) =>
					typeof value === "string" && value.trim().length >= 2
						? undefined
						: "Bitte gib mindestens 2 Zeichen ein.",
			},
			{
				name: "groupId",
				type: "select",
				label: "Gruppe optional",
				placeholder: "Ohne Gruppe",
				options: [
					{
						value: UNGROUPED_GROUP_ID,
						label: "Ohne Gruppe",
					},
					...menuGroups.map((group) => ({
						value: group.id,
						label: group.label,
					})),
				],
			},
		],
		[menuGroups],
	);
	const groupFormFields = React.useMemo<
		FormBuilderField<NewSidebarGroupFormValues>[]
	>(
		() => [
			{
				name: "label",
				label: "Gruppenname",
				placeholder: "z.B. Admin",
				required: true,
				validate: (value) =>
					typeof value === "string" && value.trim().length >= 2
						? undefined
						: "Bitte gib mindestens 2 Zeichen ein.",
			},
		],
		[],
	);

	const menuItems = React.useMemo(
		() => getMenuItems(ungroupedMenuItems, menuGroups),
		[ungroupedMenuItems, menuGroups],
	);
	const activeItem =
		menuItems.find((item) => item.id === activeItemId) ?? menuItems[0];

	function handleAddItem(values: NewSidebarItemFormValues) {
		const trimmedTitle = values.title.trim();
		if (!trimmedTitle) {
			return;
		}

		const item = createMenuItem(trimmedTitle);

		if (values.groupId === UNGROUPED_GROUP_ID) {
			setUngroupedMenuItems((currentItems) => [...currentItems, item]);
		} else {
			setMenuGroups((currentGroups) =>
				currentGroups.map((group) =>
					group.id === values.groupId
						? {
								...group,
								items: [...group.items, item],
							}
						: group,
				),
			);
		}

		setActiveItemId(item.id);
		setFormValues({ title: "", groupId: values.groupId });
	}

	function handleAddGroup(values: NewSidebarGroupFormValues) {
		const trimmedLabel = values.label.trim();
		if (!trimmedLabel) {
			return;
		}

		const group = createMenuGroup(trimmedLabel);
		setMenuGroups((currentGroups) => [...currentGroups, group]);
		setFormValues((currentValues) => ({
			...currentValues,
			groupId: group.id,
		}));
		setGroupFormValues({ label: "" });
	}

	return (
		<SidebarProvider>
			<Sidebar collapsible="icon">
				<SidebarHeader>
					<div className="flex min-h-10 items-center gap-2 px-2">
						<div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Layers className="size-4" />
						</div>
						<div className="min-w-0 group-data-[collapsible=icon]:hidden">
							<p className="truncate text-sm font-semibold">
								Dynamic App
							</p>
							<p className="truncate text-xs text-sidebar-foreground/70">
								Sidebar Menu
							</p>
						</div>
					</div>
				</SidebarHeader>
				<SidebarSeparator />
				<SidebarContent>
					{ungroupedMenuItems.length > 0 && (
						<SidebarGroup>
							<SidebarGroupContent>
								<SidebarMenu>
									{ungroupedMenuItems.map((item) => (
										<SidebarMenuEntry
											key={item.id}
											item={item}
											isActive={activeItem.id === item.id}
											onSelect={() =>
												setActiveItemId(item.id)
											}
										/>
									))}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					)}
					{menuGroups.map((group) => (
						<CollapsibleSidebarGroup
							key={group.id}
							group={group}
							activeItemId={activeItem.id}
							onSelectItem={setActiveItemId}
						/>
					))}
				</SidebarContent>
				<SidebarRail />
			</Sidebar>

			<SidebarInset>
				<header className="flex h-14 shrink-0 items-center gap-3 border-b border-border px-4">
					<SidebarTrigger />
					<div className="min-w-0">
						<h1 className="truncate text-base font-semibold">
							{activeItem.title}
						</h1>
						<p className="truncate text-xs text-muted-foreground">
							{activeItem.description}
						</p>
					</div>
				</header>

				<main className="flex flex-1 flex-col gap-6 p-4 md:p-6">
					<section className="rounded-lg border border-border bg-card p-5 shadow-sm">
						<div className="flex flex-col gap-1">
							<h2 className="text-xl font-semibold">
								{activeItem.title}
							</h2>
							<p className="max-w-2xl text-sm text-muted-foreground">
								{activeItem.description}. Jeder Eintrag in der
								Sidebar kann ohne Gruppe oder innerhalb einer
								Gruppe erstellt werden.
							</p>
						</div>
					</section>

					<section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
						<div className="rounded-lg border border-border bg-card p-5 shadow-sm">
							<h3 className="text-sm font-semibold">
								Aktuelle Menu Items
							</h3>
							<div className="mt-4 grid gap-4">
								<div className="grid gap-2">
									<p className="text-xs font-medium text-muted-foreground">
										Ohne Gruppe
									</p>
									{ungroupedMenuItems.map((item) => (
										<button
											key={item.id}
											type="button"
											onClick={() =>
												setActiveItemId(item.id)
											}
											className="flex min-h-11 w-full items-center gap-3 rounded-md border border-border bg-background px-3 text-left text-sm transition-colors hover:bg-muted"
										>
											<item.icon className="size-4 shrink-0 text-primary" />
											<span className="min-w-0 flex-1">
												<span className="block truncate font-medium">
													{item.title}
												</span>
												<span className="block truncate text-xs text-muted-foreground">
													{item.description}
												</span>
											</span>
										</button>
									))}
									{ungroupedMenuItems.length === 0 && (
										<p className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
											Keine Eintraege ohne Gruppe.
										</p>
									)}
								</div>

								{menuGroups.map((group) => (
									<div key={group.id} className="grid gap-2">
										<p className="text-xs font-medium text-muted-foreground">
											{group.label}
										</p>
										{group.items.map((item) => (
											<button
												key={item.id}
												type="button"
												onClick={() =>
													setActiveItemId(item.id)
												}
												className="flex min-h-11 w-full items-center gap-3 rounded-md border border-border bg-background px-3 text-left text-sm transition-colors hover:bg-muted"
											>
												<item.icon className="size-4 shrink-0 text-primary" />
												<span className="min-w-0 flex-1">
													<span className="block truncate font-medium">
														{item.title}
													</span>
													<span className="block truncate text-xs text-muted-foreground">
														{item.description}
													</span>
												</span>
											</button>
										))}
										{group.items.length === 0 && (
											<p className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
												Keine Eintraege in dieser Gruppe.
											</p>
										)}
									</div>
								))}
							</div>
						</div>

						<div className="rounded-lg border border-border bg-card p-5 shadow-sm">
							<h3 className="text-sm font-semibold">
								Neuen Sidebar Punkt erstellen
							</h3>
							<FormBuilder<NewSidebarItemFormValues>
								className="mt-4"
								fields={formFields}
								values={formValues}
								onChange={setFormValues}
								onSubmit={handleAddItem}
								submitLabel={
									<>
										<Plus data-icon="inline-start" />
										Hinzufuegen
									</>
								}
							/>

							<div className="my-5 h-px bg-border" />

							<h3 className="text-sm font-semibold">
								Neue Gruppe erstellen
							</h3>
							<FormBuilder<NewSidebarGroupFormValues>
								className="mt-4"
								fields={groupFormFields}
								values={groupFormValues}
								onChange={setGroupFormValues}
								onSubmit={handleAddGroup}
								submitLabel={
									<>
										<Plus data-icon="inline-start" />
										Gruppe erstellen
									</>
								}
							/>
						</div>
					</section>
				</main>
			</SidebarInset>
		</SidebarProvider>
	);
}

export default App;
