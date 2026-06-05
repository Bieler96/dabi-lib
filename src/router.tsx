import {
	createRootRoute,
	createRoute,
	createRouter,
} from "@tanstack/react-router";
import App from "./App";
import { Dashboard } from "./features/dashboard";
import { Settings } from "./features/settings";

const rootRoute = createRootRoute({
	component: App,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/",
	component: Dashboard,
});

const settingsRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: "/settings",
	component: Settings,
});

const routeTree = rootRoute.addChildren([indexRoute, settingsRoute]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
	interface Register {
		router: typeof router;
	}
}
