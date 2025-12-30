import { createContext, useContext, useMemo, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card } from "../components/Card";
import { DataTable, type ColumnDef } from "../components/DataTable";
import { Sheet, type SheetSide } from "../components/Sheet";

type DestinationType = "screen" | "dialog" | "bottomSheet" | "sheet" | "list";

export interface RouteConfig {
	path: string;
	component?: React.ComponentType<any>;
	type: DestinationType;
	side?: SheetSide;
	title?: string;
	description?: string;
	listOptions?: {
		columns: ColumnDef<any>[];
		data: any[];
	};
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

	list<T>(path: string, options: { title: string; description?: string; columns: ColumnDef<T>[]; data: T[] }) {
		this.routes[path] = {
			path,
			type: 'list',
			title: options.title,
			description: options.description,
			listOptions: {
				columns: options.columns,
				data: options.data
			}
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

	const getPathFromUrl = (map: Record<string, RouteConfig>) => {
		const path = window.location.pathname.slice(1);
		if (map[path]) return path;
		return null;
	};

	const getParamsFromUrl = () => {
		const params = new URLSearchParams(window.location.search);
		const result: Record<string, any> = {};
		params.forEach((value, key) => {
			if (value && !isNaN(Number(value)) && !value.startsWith('0')) {
				result[key] = Number(value);
			} else if (value === 'true') {
				result[key] = true;
			} else if (value === 'false') {
				result[key] = false;
			} else {
				result[key] = value;
			}
		});
		return result;
	};

	const syncUrl = (path: string, params?: any) => {
		const url = new URL(window.location.href);
		url.pathname = `/${path}`;
		url.search = '';
		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.set(key, String(value));
				}
			});
		}
		if (window.location.pathname + window.location.search !== url.pathname + url.search) {
			window.history.pushState({ path, params }, '', url.toString());
		}
	};

	const [stack, setStack] = useState<NavEntry[]>(() => {
		const initialPath = getPathFromUrl(routeMap) || startDestination;
		const initialParams = getParamsFromUrl();
		return [
			{
				id: 'root',
				path: initialPath,
				params: initialParams,
				config: routeMap[initialPath]
			}
		];
	});

	useEffect(() => {
		const handlePopState = () => {
			const path = getPathFromUrl(routeMap) || startDestination;
			const params = getParamsFromUrl();

			setStack(prev => {
				const last = prev[prev.length - 1];
				if (last.path === path && JSON.stringify(last.params) === JSON.stringify(params)) {
					return prev;
				}

				// existingIndex calculation
				let existingIndex = -1;
				for (let i = prev.length - 1; i >= 0; i--) {
					if (prev[i].path === path && JSON.stringify(prev[i].params) === JSON.stringify(params)) {
						existingIndex = i;
						break;
					}
				}

				if (existingIndex !== -1) {
					if (existingIndex === prev.length - 2) {
						const entryToPop = prev[prev.length - 1];
						const newStack = [...prev];
						newStack[prev.length - 1] = { ...entryToPop, isExiting: true };

						setTimeout(() => {
							setStack(curr => curr.filter(e => e.id !== entryToPop.id));
						}, 350);

						return newStack;
					}
					return prev.slice(0, existingIndex + 1);
				}

				return [...prev, {
					id: Date.now().toString(),
					path,
					params,
					config: routeMap[path]
				}];
			});
		};

		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, [routeMap, startDestination]);

	const navigate = (path: string, params?: any) => {
		const config = routeMap[path];
		if (!config) {
			console.warn(`Route ${path} not found`);
			return;
		}


		if (config.type === 'screen' || config.type === 'list') {
			syncUrl(path, params);
		}
		setStack(prev => [...prev, { id: Date.now().toString(), path, params, config }]);
	};

	const popBackStack = () => {
		const entryToPop = stack[stack.length - 1];
		if (!entryToPop || entryToPop.isExiting || stack.length <= 1) return;

		if (entryToPop.config.type === 'screen' || entryToPop.config.type === 'list') {
			window.history.back();
		} else {
			// Local pop for dialogs/sheets
			setStack(prev => {
				const next = [...prev];
				const index = next.findIndex(e => e.id === entryToPop.id);
				if (index !== -1) {
					next[index] = { ...next[index], isExiting: true };
				}
				return next;
			});

			setTimeout(() => {
				setStack(prev => prev.filter(e => e.id !== entryToPop.id));
			}, 350);
		}
	};

	const visibleEntries = useMemo(() => {
		// Find the index of the primary active screen (topmost non-exiting screen)
		let primaryScreenIndex = 0;
		for (let i = stack.length - 1; i >= 0; i--) {
			if ((stack[i].config.type === 'screen' || stack[i].config.type === 'list') && !stack[i].isExiting) {
				primaryScreenIndex = i;
				break;
			}
		}

		// Find the secondary screen (immediately below primary) to keep visible for transition
		let secondaryScreenIndex = -1;
		for (let i = primaryScreenIndex - 1; i >= 0; i--) {
			if (stack[i].config.type === 'screen' || stack[i].config.type === 'list') {
				secondaryScreenIndex = i;
				break;
			}
		}

		const startIndex = secondaryScreenIndex !== -1 ? secondaryScreenIndex : primaryScreenIndex;
		return stack.slice(Math.max(0, startIndex));
	}, [stack]);

	const getPageAnimation = (entry: NavEntry) => {
		if (entry.isExiting) return "animate-page-out";
		// Don't animate the root screen on initial load
		if (entry.id === stack[0].id) return "";
		return "animate-page-in";
	};

	return (
		<NavigationContext.Provider value={{ navigate, popBackStack, currentRoute: stack[stack.length - 1].path }}>
			<div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'clip' }}>
				{visibleEntries.map((entry, index) => {
					const Component = entry.config.component;

					if (entry.config.type === 'list' && entry.config.listOptions) {
						return (
							<div
								key={entry.id}
								className={`screen-wrapper shadow-2xl ${getPageAnimation(entry)}`}
								style={{ position: 'absolute', inset: 0, background: 'var(--color-surface)', overflowY: 'auto' }}
							>
								<div className="p-8 max-w-7xl mx-auto space-y-6">
									<div>
										<h1 className="text-3xl font-bold text-on-surface">{entry.config.title}</h1>
										{entry.config.description && (
											<p className="mt-2 text-on-surface-variant">{entry.config.description}</p>
										)}
									</div>
									<DataTable
										columns={entry.config.listOptions.columns}
										data={entry.config.listOptions.data}
									/>
								</div>
							</div>
						);
					}

					if (!Component) return null;

					if (entry.config.type === 'screen') {
						return (
							<div
								key={entry.id}
								className={`screen-wrapper shadow-2xl ${getPageAnimation(entry)}`}
								style={{ position: 'absolute', inset: 0, background: 'var(--color-surface)', overflowY: 'auto' }}
							>
								<Component {...entry.params} />
							</div>
						);
					}

					if (entry.config.type === 'dialog') {
						return createPortal(
							<div
								key={entry.id}
								style={{
									position: 'fixed',
									inset: 0,
									display: 'flex',
									alignItems: 'center',
									justifyContent: 'center',
									zIndex: 100 + index,
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
							</div>,
							document.body
						);
					}

					if (entry.config.type === 'bottomSheet') {
						return createPortal(
							<div key={entry.id} style={{ position: 'fixed', inset: 0, zIndex: 100 + index }}>
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
										background: 'var(--color-surface)',
										padding: 20,
										borderTopLeftRadius: 16,
										borderTopRightRadius: 16,
										boxShadow: '0 -4px 16px rgba(0,0,0,0.1)'
									}}
									className={entry.isExiting ? "animate-dialog-out" : "animate-dialog-in"}
								>
									<Component {...entry.params} />
								</div>
							</div>,
							document.body
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
								className={index > 0 ? `z-[${index * 10 + 50}]` : undefined}
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