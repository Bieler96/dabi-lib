import { Link, Outlet } from "@tanstack/react-router";
import { BarChart3, Layers, Settings } from "lucide-react";

const navItems = [
	{ to: "/", label: "Dashboard", icon: BarChart3 },
	{ to: "/settings", label: "Settings", icon: Settings },
] as const;

function App() {
	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="grid min-h-screen md:grid-cols-[16rem_minmax(0,1fr)]">
				<aside className="border-b border-border bg-sidebar text-sidebar-foreground md:border-r md:border-b-0">
					<div className="flex h-14 items-center gap-2 px-4">
						<div className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
							<Layers className="size-4" />
						</div>
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold">
								Dabi App
							</p>
							<p className="truncate text-xs text-sidebar-foreground/70">
								TanStack Router
							</p>
						</div>
					</div>

					<nav className="grid gap-1 p-2">
						{navItems.map((item) => {
							const Icon = item.icon;

							return (
								<Link
									key={item.to}
									to={item.to}
									className="flex min-h-10 items-center gap-2 rounded-md px-3 text-sm font-medium outline-none transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 focus-visible:ring-sidebar-ring [&.active]:bg-sidebar-primary [&.active]:text-sidebar-primary-foreground"
									activeOptions={{ exact: item.to === "/" }}
								>
									<Icon className="size-4" />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>
				</aside>

				<main className="min-w-0">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

export default App;
