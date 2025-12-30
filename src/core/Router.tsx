import { createContext, useContext, useMemo, useState } from "react";
import { Card } from "../components/Card";

type DestinationType = "screen" | "dialog" | "bottomSheet";

export interface RouteConfig {
	path: string;
	component: React.ComponentType<any>;
	type: DestinationType;
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
}

interface NavHostProps {
	startDestination: string;
	builder: (builder: RouteBuilder) => void;
}

export const NavHost: React.FC<NavHostProps> = ({ startDestination, builder }) => {
	// 1. Routen konfigurieren
	const routeMap = useMemo(() => {
		const b = new RouteBuilder();
		builder(b);
		return b.routes;
	}, [builder]);

	// 2. Der BackStack State
	const [stack, setStack] = useState<NavEntry[]>([
		{
			id: 'root',
			path: startDestination,
			config: routeMap[startDestination]
		}
	]);

	// 3. Navigation Actions
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

	// 4. Rendering Logic (Das Herzstück)
	// Wir müssen den "tiefsten" Screen finden, der sichtbar sein soll.
	// Alles danach (Dialoge/Sheets) wird darüber gerendert.

	const visibleEntries = useMemo(() => {
		// Finde den Index des letzten "Screen"-Typs
		let lastScreenIndex = 0;
		for (let i = stack.length - 1; i >= 0; i--) {
			if (stack[i].config.type === 'screen') {
				lastScreenIndex = i;
				break;
			}
		}
		// Rendere diesen Screen und alles was danach kommt (Dialoge/Sheets)
		return stack.slice(lastScreenIndex);
	}, [stack]);

	return (
		<NavigationContext.Provider value={{ navigate, popBackStack, currentRoute: stack[stack.length - 1].path }}>
			<div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
				{visibleEntries.map((entry, index) => {
					const Component = entry.config.component;
					const isTopParams = index === visibleEntries.length - 1;

					// Wrapper basierend auf Typ
					if (entry.config.type === 'screen') {
						return (
							<div key={entry.id} className="screen-wrapper" style={{ position: 'absolute', inset: 0, background: 'white' }}>
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
					return null;
				})}
			</div>
		</NavigationContext.Provider>
	);
};