import * as React from "react";

export function List({ children }: React.PropsWithChildren) {
	return (
		<div className="w-full overflow-hidden rounded-2xl border bg-background">
			{children}
		</div>
	);
}

List.Section = function ListSection({ children }: React.PropsWithChildren) {
	return <div>{children}</div>;
};

List.Subheader = function ListSubheader({ children }: React.PropsWithChildren) {
	return (
		<div className="px-4 pb-2 pt-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
			{children}
		</div>
	);
};

List.Item = function ListItem({
	children,
	onClick,
}: React.PropsWithChildren<{ onClick?: () => void }>) {
	const Component = onClick ? "button" : "div";

	return (
		<Component
			onClick={onClick}
			className="flex min-h-14 w-full items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-muted/70"
		>
			{children}
		</Component>
	);
};

List.Leading = function ListLeading({ children }: React.PropsWithChildren) {
	return (
		<div className="flex size-10 shrink-0 items-center justify-center text-muted-foreground">
			{children}
		</div>
	);
};

List.Content = function ListContent({ children }: React.PropsWithChildren) {
	return <div className="min-w-0 flex-1">{children}</div>;
};

List.Title = function ListTitle({ children }: React.PropsWithChildren) {
	return (
		<div className="truncate text-sm font-medium text-foreground">
			{children}
		</div>
	);
};

List.Description = function ListDescription({
	children,
}: React.PropsWithChildren) {
	return (
		<div className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
			{children}
		</div>
	);
};

List.Meta = function ListMeta({ children }: React.PropsWithChildren) {
	return <div className="text-xs text-muted-foreground">{children}</div>;
};

List.Trailing = function ListTrailing({ children }: React.PropsWithChildren) {
	return <div className="shrink-0 text-muted-foreground">{children}</div>;
};

List.Divider = function ListDivider() {
	return <div className="ml-16 h-px bg-border" />;
};
