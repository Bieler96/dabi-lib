import type { ComponentType } from "react";
import type { ColumnDef } from "../components/DataTable";
import type { SheetSide } from "../components/Sheet";

export type RouteParams = Record<string, unknown>;
export type ImperativeNavigate = (path: string, params?: RouteParams) => void;
export type Guard = (
	params?: RouteParams,
	navigate?: ImperativeNavigate
) => boolean | Promise<boolean>;

export type DestinationType = "screen" | "dialog" | "bottomSheet" | "sheet" | "list";

export interface RouteConfig {
	path: string;
	component?: ComponentType<object>;
	type: DestinationType;
	side?: SheetSide;
	title?: string;
	description?: string;
	className?: string;
	listOptions?: {
		columns: ColumnDef<object>[];
		data: object[];
	};
	canActivate?: Guard[];
	canDeactivate?: Guard[];
}

interface ScreenOptions {
	canActivate?: Guard[];
	canDeactivate?: Guard[];
	className?: string;
	title?: string;
	description?: string;
}

interface SheetOptions extends ScreenOptions {
	side?: SheetSide;
	title?: string;
	description?: string;
	className?: string;
}

interface ListOptions<T extends object> extends ScreenOptions {
	title: string;
	description?: string;
		columns: ColumnDef<T>[];
		data: T[];
}

export class RouteBuilder {
	routes: Record<string, RouteConfig> = {};

	screen<P extends object>(path: string, component: ComponentType<P>, options?: ScreenOptions) {
		this.routes[path] = { path, component: component as ComponentType<object>, type: "screen", ...options };
	}

	dialog<P extends object>(path: string, component: ComponentType<P>, options?: ScreenOptions) {
		this.routes[path] = { path, component: component as ComponentType<object>, type: "dialog", ...options };
	}

	bottomSheet<P extends object>(path: string, component: ComponentType<P>, options?: ScreenOptions) {
		this.routes[path] = { path, component: component as ComponentType<object>, type: "bottomSheet", ...options };
	}

	sheet<P extends object>(path: string, component: ComponentType<P>, options?: SheetOptions) {
		this.routes[path] = {
			path,
			component: component as ComponentType<object>,
			type: "sheet",
			side: options?.side || "right",
			title: options?.title,
			description: options?.description,
			className: options?.className,
			canActivate: options?.canActivate,
			canDeactivate: options?.canDeactivate,
		};
	}

	list<T extends object>(path: string, options: ListOptions<T>) {
		this.routes[path] = {
			path,
			type: "list",
			title: options.title,
			description: options.description,
			listOptions: {
				columns: options.columns as unknown as ColumnDef<object>[],
				data: options.data as object[],
			},
			canActivate: options.canActivate,
			canDeactivate: options.canDeactivate,
		} as RouteConfig;
	}
}
