import { createContext, useContext, useMemo, useState } from "react";
import { Card } from "../components/Card";
import { Sheet, type SheetSide } from "../components/Sheet";

type DestinationType = "screen" | "dialog" | "bottomSheet" | "sheet";

export interface RouteConfig {
	path: string;
	component: React.ComponentType<any>;
	type: DestinationType;
	side?: SheetSide;
	title?: string;
	description?: string;
}

interface NavEntry {
	id: string;
	path: string;
	params?: any;
	config: RouteConfig;
	isExiting?: boolean;
}

interface NavContextType {
	navigate: (path: string, params?: any) => void;
	popBackStack: () => void;
	currentRoute: string;
}

const NavigationContext = createContext<NavContextType | null>(null);

export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context) throw new Error("useNavigation must be used within a NavHost");
	return context;
};

export class RouteBuilder {
	routes: Record<string, RouteConfig> = {};

	screen(path: string, component: React.ComponentType<any>) {
		this.routes[path] = { path, component, type: 'screen' };
	}

	dialog(path: string, component: React.ComponentType<any>) {
		this.routes[path] = { path, component, type: 'dialog' };
	}

	bottomSheet(path: string, component: React.ComponentType<any>) {
		this.routes[path] = { path, component, type: 'bottomSheet' };
	}

	sheet(path: string, component: React.ComponentType<any>, options?: { side?: SheetSide; title?: string; description?: string }) {
		this.routes[path] = {
			path,
			component,
			type: 'sheet',
			side: options?.side || 'right',
			title: options?.title,
			description: options?.description
		};
	}
}

interface NavHostProps {
	startDestination: string;
	builder: (builder: RouteBuilder) => void;
}

export const NavHost: React.FC<NavHostProps> = ({ startDestination, builder }) => {
	const routeMap = useMemo(() => {
		const b = new RouteBuilder();
		builder(b);
		return b.routes;
	}, [builder]);

	const [stack, setStack] = useState<NavEntry[]>([
		{
			id: 'root',
			path: startDestination,
			config: routeMap[startDestination]
		}
	]);

	const navigate = (path: string, params?: any) => {
		const config = routeMap[path];
		if (!config) {
			console.warn(`Route ${path} not found`);
			return;
		}
		setStack(prev => [...prev, { id: Date.now().toString(), path, params, config }]);
	};

	const popBackStack = () => {
		const entryToPop = stack[stack.length - 1];
		if (!entryToPop || entryToPop.isExiting || stack.length <= 1) return;

		setStack(prev => {
			const next = [...prev];
			const index = next.findIndex(e => e.id === entryToPop.id);
			if (index !== -1) {
				next[index] = { ...next[index], isExiting: true };
			}
			return next;
		});

		setTimeout(() => {
			setStack(prev => {
				const index = prev.findIndex(e => e.id === entryToPop.id);
				if (index === -1) return prev;
				return prev.filter(e => e.id !== entryToPop.id);
			});
		}, 350);
	};

	const visibleEntries = useMemo(() => {
		let lastScreenIndex = 0;
		for (let i = stack.length - 1; i >= 0; i--) {
			if (stack[i].config.type === 'screen') {
				lastScreenIndex = i;
				break;
			}
		}
		return stack.slice(lastScreenIndex);
	}, [stack]);

	return (
		<NavigationContext.Provider value={{ navigate, popBackStack, currentRoute: stack[stack.length - 1].path }}>
			<div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'clip' }}>
				{visibleEntries.map((entry, index) => {
					const Component = entry.config.component;

					if (entry.config.type === 'screen') {
						return (
							<div key={entry.id} className="screen-wrapper" style={{ position: 'absolute', inset: 0, background: 'var(--color-surface)', overflowY: 'auto' }}>
								<Component {...entry.params} />
							</div>
						);
					}

					if (entry.config.type === 'dialog') {
						return (
							<div
								key={entry.id}
								style={{
									position: 'absolute',
									inset: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 10 + index,
								}}
							>
								<div
									className={entry.isExiting ? "animate-overlay-out" : "animate-overlay-in"}
									style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
									onClick={popBackStack}
								/>
								<Card
									className={`max-w-2xl w-full mx-4 shadow-2xl ${entry.isExiting ? "animate-dialog-out" : "animate-dialog-in"
										}`}
								>
									<Component {...entry.params} />
								</Card>
							</div>
						);
					}

					if (entry.config.type === 'bottomSheet') {
						return (
							<div key={entry.id} style={{ position: 'absolute', inset: 0, zIndex: 10 + index }}>
								<div
									className={entry.isExiting ? "animate-overlay-out" : "animate-overlay-in"}
									style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)' }}
									onClick={popBackStack}
								/>
								<div
									style={{
										position: 'absolute',
										bottom: 0,
										left: 0,
										right: 0,
										background: 'white',
										padding: 20,
										borderTopLeftRadius: 16,
										borderTopRightRadius: 16,
										boxShadow: '0 -4px 16px rgba(0,0,0,0.1)'
									}}
									className={entry.isExiting ? "animate-dialog-out" : "animate-dialog-in"}
								>
									<Component {...entry.params} />
								</div>
							</div>
						);
					}

					if (entry.config.type === 'sheet') {
						return (
							<Sheet
								key={entry.id}
								isOpen={!entry.isExiting}
								onClose={popBackStack}
								side={entry.config.side}
								title={entry.params?.title || entry.config.title}
								description={entry.params?.description || entry.config.description}
							>
								<Component {...entry.params} />
							</Sheet>
						);
					}
					return null;
				})}
			</div>
		</NavigationContext.Provider>
	);
};