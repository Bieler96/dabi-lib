import { useMemo, useState, type ReactNode } from "react";
import { LayoutGrid, BarChart3, Sparkles, Users, FolderKanban, ShieldCheck } from "lucide-react";
import { Button } from "../components/Button";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInset,
	SidebarMenuCollapsible,
	SidebarMenuCollapsibleContent,
	SidebarMenuCollapsibleTrigger,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarTrigger,
} from "../components/Sidebar";
import { Card } from "../components/Card";
import { Separator } from "../components/Separator";
import { useNavigation } from "../core/Router";

type DemoSection = {
	id: string;
	title: string;
	description: string;
	icon: ReactNode;
	badge?: string;
	parent?: string;
};

const sections: DemoSection[] = [
	{
		id: "overview",
		title: "Overview",
		description: "A compact summary of what is happening right now.",
		icon: <LayoutGrid className="h-4 w-4" />,
		badge: "12",
	},
	{
		id: "analytics",
		title: "Analytics",
		description: "Usage, trends, and the kind of data people actually ask about.",
		icon: <BarChart3 className="h-4 w-4" />,
	},
	{
		id: "projects",
		title: "Projects",
		description: "Boards, tasks, and shared workspaces.",
		icon: <FolderKanban className="h-4 w-4" />,
		badge: "4",
	},
	{
		id: "projects-active",
		parent: "projects",
		title: "Active projects",
		description: "The projects that are moving right now.",
		icon: <FolderKanban className="h-4 w-4" />,
	},
	{
		id: "projects-archive",
		parent: "projects",
		title: "Archived projects",
		description: "Completed work you can still browse.",
		icon: <FolderKanban className="h-4 w-4" />,
	},
	{
		id: "projects-roadmap",
		parent: "projects",
		title: "Roadmap",
		description: "Planned work and future ideas.",
		icon: <FolderKanban className="h-4 w-4" />,
	},
	{
		id: "members",
		title: "Members",
		description: "The people who can see and change things.",
		icon: <Users className="h-4 w-4" />,
	},
	{
		id: "security",
		title: "Security",
		description: "Access, roles, and guard rails.",
		icon: <ShieldCheck className="h-4 w-4" />,
	},
	{
		id: "security-roles",
		parent: "security",
		title: "Roles",
		description: "Who gets access to what.",
		icon: <ShieldCheck className="h-4 w-4" />,
	},
	{
		id: "security-audit",
		parent: "security",
		title: "Audit log",
		description: "A trace of important changes.",
		icon: <ShieldCheck className="h-4 w-4" />,
	},
];

export const SidebarDemo = () => {
	const nav = useNavigation();
	const [activeSection, setActiveSection] = useState("overview");
	const [sidebarOpen, setSidebarOpen] = useState(true);

	const active = useMemo(
		() => sections.find((section) => section.id === activeSection) ?? sections[0],
		[activeSection]
	);

	const projectLeafItems = sections.filter((section) => section.parent === "projects");
	const securityLeafItems = sections.filter((section) => section.parent === "security");

	return (
		<SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen} side="left">
			<div className="min-h-screen bg-gradient-to-br from-surface via-surface to-primary/5 text-on-surface">
				<Sidebar>
					<SidebarHeader className="gap-3">
						<div className="flex size-10 items-center justify-center rounded-[var(--radius-component)] bg-primary text-on-primary shadow-sm">
							<Sparkles className="h-5 w-5" />
						</div>
						<div className="min-w-0 flex-1">
							<p className="truncate text-sm font-semibold">Dabi Studio</p>
							<p className="truncate text-xs text-on-surface-variant">Navigation shell demo</p>
						</div>
						<SidebarTrigger className="md:hidden" />
					</SidebarHeader>

					<SidebarContent>
						<SidebarGroup>
							<SidebarGroupLabel>Workspace</SidebarGroupLabel>
							<SidebarMenu>
								{sections.slice(0, 3).map((section) => (
									<SidebarMenuItem key={section.id}>
										{section.id === "projects" ? (
											<SidebarMenuCollapsible defaultOpen>
												<SidebarMenuCollapsibleTrigger
													leading={section.icon}
													badge={section.badge}
												>
													{section.title}
												</SidebarMenuCollapsibleTrigger>
												<SidebarMenuCollapsibleContent>
													<SidebarMenuSub>
														{projectLeafItems.map((item) => (
															<SidebarMenuSubItem key={item.id}>
																<SidebarMenuSubButton
																	active={activeSection === item.id}
																	onClick={() => setActiveSection(item.id)}
																>
																	{item.title}
																</SidebarMenuSubButton>
															</SidebarMenuSubItem>
														))}
													</SidebarMenuSub>
												</SidebarMenuCollapsibleContent>
											</SidebarMenuCollapsible>
										) : (
											<SidebarMenuButton
												active={activeSection === section.id}
												leading={section.icon}
												badge={section.badge}
												onClick={() => setActiveSection(section.id)}
											>
												{section.title}
											</SidebarMenuButton>
										)}
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroup>

						<Separator className="my-[var(--space-4)]" />

						<SidebarGroup>
							<SidebarGroupLabel>Administration</SidebarGroupLabel>
							<SidebarMenu>
								<SidebarMenuItem>
									<SidebarMenuButton
										active={activeSection === "members"}
										leading={<Users className="h-4 w-4" />}
										onClick={() => setActiveSection("members")}
									>
										Members
									</SidebarMenuButton>
								</SidebarMenuItem>

							<SidebarMenuItem>
								<SidebarMenuCollapsible defaultOpen={false}>
									<SidebarMenuCollapsibleTrigger leading={<ShieldCheck className="h-4 w-4" />}>
										Security
										</SidebarMenuCollapsibleTrigger>
										<SidebarMenuCollapsibleContent>
											<SidebarMenuSub>
												{securityLeafItems.map((item) => (
													<SidebarMenuSubItem key={item.id}>
														<SidebarMenuSubButton
															active={activeSection === item.id}
															onClick={() => setActiveSection(item.id)}
														>
															{item.title}
														</SidebarMenuSubButton>
													</SidebarMenuSubItem>
												))}
											</SidebarMenuSub>
										</SidebarMenuCollapsibleContent>
									</SidebarMenuCollapsible>
								</SidebarMenuItem>
								</SidebarMenu>
							</SidebarGroup>

							<Card variant="filled" className="mt-2 space-y-4 rounded-[var(--radius-component)] p-4">
								<div className="flex items-start justify-between gap-3">
									<div>
										<p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">
											Now viewing
										</p>
										<p className="mt-1 text-base font-semibold text-on-surface">{active.title}</p>
									</div>
									<div className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-medium text-primary">
										Live
									</div>
								</div>
								<p className="text-sm leading-6 text-on-surface-variant">
									{active.description}
								</p>
								<div className="flex flex-wrap gap-2">
									<span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-on-surface-variant">
										Desktop collapse
									</span>
									<span className="rounded-full bg-surface px-2.5 py-1 text-[11px] font-medium text-on-surface-variant">
										Mobile overlay
									</span>
								</div>
							</Card>
						</SidebarContent>

						<SidebarFooter>
							<div className="flex items-center justify-between gap-3">
								<div className="min-w-0">
									<p className="text-sm font-medium text-on-surface">Dabi Studio</p>
									<p className="truncate text-xs text-on-surface-variant">
										Use the rail to collapse, the menu to navigate.
									</p>
								</div>
								<Button variant="ghost" size="sm" onClick={() => nav.popBackStack()}>
									Home
								</Button>
							</div>
						</SidebarFooter>
					<SidebarRail />
				</Sidebar>

				<SidebarInset
					className={sidebarOpen ? "md:ml-[17rem]" : "md:ml-[4.75rem] md:[transition-property:margin-left] md:duration-300"}
				>
					<header className="sticky top-0 z-20 border-b border-outline-variant bg-surface/85 backdrop-blur-md">
						<div className="flex items-center justify-between gap-4 px-4 py-4 md:px-8">
							<div className="flex items-center gap-3">
								<SidebarTrigger className="md:hidden" />
								<div>
									<h1 className="text-2xl font-semibold">{active.title}</h1>
									<p className="text-sm text-on-surface-variant">
										A small page to show how the sidebar feels in the app.
									</p>
								</div>
							</div>
							<Button variant="ghost" onClick={() => nav.popBackStack()}>
								Back
							</Button>
						</div>
					</header>

					<div className="p-4 md:p-8">
						<div className="grid gap-4 lg:grid-cols-[1.5fr_1fr]">
							<Card variant="outlined" className="space-y-4 p-6">
								<div className="flex items-start justify-between gap-4">
									<div>
										<p className="text-sm uppercase tracking-[0.12em] text-on-surface-variant">
											Interactive Demo
										</p>
										<h2 className="mt-1 text-xl font-semibold">
											Tap a menu item and watch the content update.
										</h2>
									</div>
									<div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
										Live
									</div>
								</div>

								<div className="rounded-[var(--radius-component)] border border-outline-variant bg-surface-variant/60 p-4">
									<p className="text-sm text-on-surface-variant">
										Current section
									</p>
									<p className="mt-2 text-3xl font-semibold">{active.title}</p>
									<p className="mt-2 max-w-2xl text-sm text-on-surface-variant">
										{active.description}
									</p>
								</div>

								<div className="grid gap-3 sm:grid-cols-3">
									<div className="rounded-[var(--radius-component)] bg-surface-variant p-4">
										<p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">
											Layout
										</p>
										<p className="mt-2 text-lg font-semibold">Desktop + Mobile</p>
									</div>
									<div className="rounded-[var(--radius-component)] bg-surface-variant p-4">
										<p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">
											Mode
										</p>
										<p className="mt-2 text-lg font-semibold">Collapsed rail</p>
									</div>
									<div className="rounded-[var(--radius-component)] bg-surface-variant p-4">
										<p className="text-xs uppercase tracking-[0.12em] text-on-surface-variant">
											Pattern
										</p>
										<p className="mt-2 text-lg font-semibold">App shell</p>
									</div>
								</div>
							</Card>

							<Card variant="filled" className="space-y-4 p-6">
								<div>
									<p className="text-sm uppercase tracking-[0.12em] text-on-surface-variant">
										Notes
									</p>
									<h3 className="mt-1 text-lg font-semibold">
										Why this demo exists
									</h3>
								</div>
								<ul className="space-y-3 text-sm text-on-surface-variant">
									<li>- The sidebar opens as a clean app shell, not a generic drawer.</li>
									<li>- On mobile it overlays the page and closes on backdrop tap.</li>
									<li>- On desktop it can collapse into a compact rail.</li>
									<li>- Collapse it fully to see the icon-only mode with hidden labels.</li>
									<li>- It uses the same surface, outline, and primary tokens as the rest of the library.</li>
								</ul>
							</Card>
						</div>
					</div>
				</SidebarInset>
			</div>
		</SidebarProvider>
	);
};
