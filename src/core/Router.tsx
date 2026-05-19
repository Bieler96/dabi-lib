/* eslint-disable react-refresh/only-export-components */
import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type FC,
	type ReactNode,
} from "react";
import { DataTable } from "../components/DataTable";
import { Dialog } from "../components/Dialog";
import { Sheet } from "../components/Sheet";
import {
	RouteBuilder,
	type RouteConfig,
	type ImperativeNavigate,
	type RouteParams,
} from "./RouteBuilder";

export type { Guard } from "./RouteBuilder";

interface NavEntry {
	id: string;
	path: string;
	params?: RouteParams;
	config: RouteConfig;
	isExiting?: boolean;
}

interface NavContextType {
	navigate: (path: string, params?: RouteParams) => void;
	popBackStack: () => void;
	currentRoute: string;
}

const NavigationContext = createContext<NavContextType | null>(null);

export const useNavigation = () => {
	const context = useContext(NavigationContext);
	if (!context)
		throw new Error("useNavigation must be used within a NavHost");
	return context;
};

interface NavHostProps {
	startDestination: string;
	builder: (builder: RouteBuilder) => void;
}

const readCurrentPath = (
	map: Record<string, RouteConfig>,
	startDestination: string,
) => {
	if (typeof window === "undefined") {
		return startDestination;
	}

	const path = window.location.pathname.slice(1);
	return map[path] ? path : startDestination;
};

const readCurrentParams = () => {
	if (typeof window === "undefined") {
		return {};
	}

	const params = new URLSearchParams(window.location.search);
	const result: Record<string, unknown> = {};

	params.forEach((value, key) => {
		if (value && !Number.isNaN(Number(value)) && !value.startsWith("0")) {
			result[key] = Number(value);
		} else if (value === "true") {
			result[key] = true;
		} else if (value === "false") {
			result[key] = false;
		} else {
			result[key] = value;
		}
	});

	return result;
};

const sameParams = (left?: RouteParams, right?: RouteParams) =>
	JSON.stringify(left ?? {}) === JSON.stringify(right ?? {});

export const NavHost: FC<NavHostProps> = ({ startDestination, builder }) => {
	const routeMap = useMemo(() => {
		const routeBuilder = new RouteBuilder();
		builder(routeBuilder);
		return routeBuilder.routes;
	}, [builder]);
	const [stack, setStack] = useState<NavEntry[]>([]);
	const canUseDom = typeof window !== "undefined";

	const syncUrl = useCallback((path: string, params?: RouteParams) => {
		if (typeof window === "undefined") {
			return;
		}

		const url = new URL(window.location.href);
		url.pathname = `/${path}`;
		url.search = "";

		if (params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.set(key, String(value));
				}
			});
		}

		if (
			window.location.pathname + window.location.search !==
			url.pathname + url.search
		) {
			window.history.pushState({ path, params }, "", url.toString());
		}
	}, []);

	const internalNavigate: ImperativeNavigate = useCallback(
		(targetPath, targetParams) => {
			const targetConfig = routeMap[targetPath];
			if (!targetConfig) {
				console.warn(
					`Internal navigate: Route ${targetPath} not found`,
				);
				return;
			}

			if (
				targetConfig.type === "screen" ||
				targetConfig.type === "list"
			) {
				syncUrl(targetPath, targetParams);
			}

			setStack((prev) => [
				...prev,
				{
					id: Date.now().toString(),
					path: targetPath,
					params: targetParams,
					config: targetConfig,
				},
			]);
		},
		[routeMap, syncUrl],
	);

	useEffect(() => {
		if (!canUseDom) {
			return;
		}

		const initialize = async () => {
			const initialPath = readCurrentPath(routeMap, startDestination);
			const initialParams = readCurrentParams();
			const config = routeMap[initialPath];

			if (!config) {
				console.error(
					`Route config for path "${initialPath}" not found. Check NavHost builder.`,
				);
				return;
			}

			if (config.canActivate) {
				for (const guard of config.canActivate) {
					const canActivate = await guard(
						initialParams,
						internalNavigate,
					);
					if (!canActivate) {
						return;
					}
				}
			}

			setStack([
				{
					id: "root",
					path: initialPath,
					params: initialParams,
					config,
				},
			]);

			const currentPath = window.location.pathname.slice(1);
			if (!routeMap[currentPath]) {
				syncUrl(initialPath, initialParams);
			}
		};

		if (stack.length === 0) {
			void initialize();
		}
	}, [
		canUseDom,
		routeMap,
		startDestination,
		stack.length,
		internalNavigate,
		syncUrl,
	]);

	useEffect(() => {
		if (!canUseDom) {
			return;
		}

		const handlePopState = async () => {
			const path = readCurrentPath(routeMap, startDestination);
			const params = readCurrentParams();
			const config = routeMap[path];

			if (!config) {
				console.error(
					`Route config for path "${path}" not found during popstate.`,
				);
				return;
			}

			const currentEntry = stack[stack.length - 1];
			if (
				currentEntry &&
				(currentEntry.path !== path ||
					!sameParams(currentEntry.params, params))
			) {
				if (currentEntry.config.canDeactivate) {
					for (const guard of currentEntry.config.canDeactivate) {
						const canDeactivate = await guard(
							currentEntry.params,
							internalNavigate,
						);
						if (!canDeactivate) {
							syncUrl(currentEntry.path, currentEntry.params);
							return;
						}
					}
				}
			}

			if (config.canActivate) {
				for (const guard of config.canActivate) {
					const canActivate = await guard(params, internalNavigate);
					if (!canActivate) {
						return;
					}
				}
			}

			setStack((prev) => {
				const last = prev[prev.length - 1];
				if (
					last &&
					last.path === path &&
					sameParams(last.params, params)
				) {
					return prev;
				}

				let existingIndex = -1;
				for (let i = prev.length - 1; i >= 0; i--) {
					if (
						prev[i].path === path &&
						sameParams(prev[i].params, params)
					) {
						existingIndex = i;
						break;
					}
				}

				if (existingIndex !== -1) {
					if (existingIndex === prev.length - 2) {
						const entryToPop = prev[prev.length - 1];
						const newStack = [...prev];
						newStack[prev.length - 1] = {
							...entryToPop,
							isExiting: true,
						};

						setTimeout(() => {
							setStack((curr) =>
								curr.filter(
									(entry) => entry.id !== entryToPop.id,
								),
							);
						}, 350);

						return newStack;
					}

					return prev.slice(0, existingIndex + 1);
				}

				return [
					...prev,
					{
						id: Date.now().toString(),
						path,
						params,
						config,
					},
				];
			});
		};

		window.addEventListener("popstate", handlePopState);
		return () => window.removeEventListener("popstate", handlePopState);
	}, [
		canUseDom,
		routeMap,
		startDestination,
		stack,
		internalNavigate,
		syncUrl,
	]);

	const navigate = async (path: string, params?: RouteParams) => {
		const config = routeMap[path];
		if (!config) {
			console.warn(`Route ${path} not found`);
			return;
		}

		if (config.canActivate) {
			for (const guard of config.canActivate) {
				const canActivate = await guard(params, internalNavigate);
				if (!canActivate) {
					return;
				}
			}
		}

		if (config.type === "screen" || config.type === "list") {
			syncUrl(path, params);
		}

		setStack((prev) => [
			...prev,
			{ id: Date.now().toString(), path, params, config },
		]);
	};

	const popBackStack = async () => {
		const entryToPop = stack[stack.length - 1];
		if (!entryToPop || entryToPop.isExiting || stack.length <= 1) {
			return;
		}

		if (entryToPop.config.canDeactivate) {
			for (const guard of entryToPop.config.canDeactivate) {
				const canDeactivate = await guard(
					entryToPop.params,
					internalNavigate,
				);
				if (!canDeactivate) {
					return;
				}
			}
		}

		if (
			entryToPop.config.type === "screen" ||
			entryToPop.config.type === "list"
		) {
			window.history.back();
			return;
		}

		setStack((prev) => {
			const next = [...prev];
			const index = next.findIndex((entry) => entry.id === entryToPop.id);
			if (index !== -1) {
				next[index] = { ...next[index], isExiting: true };
			}
			return next;
		});

		setTimeout(() => {
			setStack((prev) =>
				prev.filter((entry) => entry.id !== entryToPop.id),
			);
		}, 350);
	};

	const visibleEntries = useMemo(() => {
		if (stack.length === 0) {
			return [];
		}

		let primaryScreenIndex = 0;
		for (let i = stack.length - 1; i >= 0; i--) {
			if (
				(stack[i].config.type === "screen" ||
					stack[i].config.type === "list") &&
				!stack[i].isExiting
			) {
				primaryScreenIndex = i;
				break;
			}
		}

		let secondaryScreenIndex = -1;
		for (let i = primaryScreenIndex - 1; i >= 0; i--) {
			if (
				stack[i].config.type === "screen" ||
				stack[i].config.type === "list"
			) {
				secondaryScreenIndex = i;
				break;
			}
		}

		const startIndex =
			secondaryScreenIndex !== -1
				? secondaryScreenIndex
				: primaryScreenIndex;
		return stack.slice(Math.max(0, startIndex));
	}, [stack]);

	const getPageAnimation = (entry: NavEntry) => {
		if (entry.isExiting) return "animate-page-out";
		if (stack.length === 0 || entry.id === stack[0].id) return "";
		return "animate-page-in";
	};

	if (!canUseDom) {
		return null;
	}

	const renderEntry = (entry: NavEntry): ReactNode => {
		const Component = entry.config.component;
		if (!entry.config) {
			return null;
		}

		if (entry.config.type === "list" && entry.config.listOptions) {
			return (
				<div
					key={entry.id}
					className={`screen-wrapper shadow-2xl ${getPageAnimation(entry)} ${entry.config.className || ""}`}
					style={{
						position: "absolute",
						inset: 0,
						background: "var(--color-surface)",
						overflowY: "auto",
					}}
				>
					<div className="p-8 max-w-7xl mx-auto space-y-6">
						<div>
							<h1 className="text-3xl font-bold text-on-surface">
								{entry.config.title}
							</h1>
							{entry.config.description && (
								<p className="mt-2 text-on-surface-variant">
									{entry.config.description}
								</p>
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

		if (!Component) {
			return null;
		}

		if (entry.config.type === "screen") {
			return (
				<div
					key={entry.id}
					className={`screen-wrapper shadow-2xl ${getPageAnimation(entry)} ${entry.config.className || ""}`}
					style={{
						position: "absolute",
						inset: 0,
						background: "var(--color-surface)",
						overflowY: "auto",
					}}
				>
					<Component {...entry.params} />
				</div>
			);
		}

		if (entry.config.type === "dialog") {
			return (
				<Dialog
					key={entry.id}
					open={!entry.isExiting}
					onClose={popBackStack}
					title={entry.config.title}
					description={entry.config.description}
					ariaLabel={
						typeof entry.config.title === "string"
							? entry.config.title
							: undefined
					}
					paperClassName={`max-w-2xl ${entry.config.className || ""}`}
				>
					<Component {...entry.params} />
				</Dialog>
			);
		}

		if (entry.config.type === "bottomSheet") {
			return (
				<Sheet
					key={entry.id}
					isOpen={!entry.isExiting}
					onClose={popBackStack}
					side="bottom"
					title={entry.config.title}
					description={entry.config.description}
					ariaLabel={
						typeof entry.config.title === "string"
							? entry.config.title
							: undefined
					}
					panelClassName={entry.config.className}
				>
					<Component {...entry.params} />
				</Sheet>
			);
		}

		if (entry.config.type === "sheet") {
			const title =
				typeof entry.params?.title === "string"
					? entry.params.title
					: undefined;
			const description =
				typeof entry.params?.description === "string"
					? entry.params.description
					: undefined;

			return (
				<Sheet
					key={entry.id}
					isOpen={!entry.isExiting}
					onClose={popBackStack}
					side={entry.config.side}
					title={title || entry.config.title}
					description={description || entry.config.description}
					ariaLabel={
						typeof (title || entry.config.title) === "string"
							? ((title || entry.config.title) as string)
							: undefined
					}
					panelClassName={entry.config.className}
				>
					<Component {...entry.params} />
				</Sheet>
			);
		}

		return null;
	};

	return (
		<NavigationContext.Provider
			value={{
				navigate,
				popBackStack,
				currentRoute:
					stack.length > 0 ? stack[stack.length - 1].path : "",
			}}
		>
			<div
				style={{
					position: "relative",
					width: "100%",
					height: "100vh",
					overflow: "clip",
				}}
			>
				{visibleEntries.map((entry) => renderEntry(entry))}
			</div>
		</NavigationContext.Provider>
	);
};
