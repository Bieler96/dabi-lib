import * as React from "react";
import clsx from "clsx";
import { ChevronRight, Menu } from "lucide-react";
import { Button } from "./Button";
import { Separator } from "./Separator";

type SidebarContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
	side: "left" | "right";
	isMobile: boolean;
	collapsed: boolean;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useSidebarContext() {
	const context = React.useContext(SidebarContext);

	if (!context) {
		throw new Error("Sidebar components must be used within a SidebarProvider");
	}

	return context;
}

function useMediaQuery(query: string) {
	const [matches, setMatches] = React.useState(false);

	React.useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const mediaQuery = window.matchMedia(query);
		const updateMatches = () => setMatches(mediaQuery.matches);

		updateMatches();
		mediaQuery.addEventListener("change", updateMatches);

		return () => mediaQuery.removeEventListener("change", updateMatches);
	}, [query]);

	return matches;
}

export interface SidebarProviderProps {
	children: React.ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	side?: "left" | "right";
}

export function SidebarProvider({
	children,
	defaultOpen = true,
	open: openProp,
	onOpenChange,
	side = "left",
}: SidebarProviderProps) {
	const isControlled = openProp !== undefined;
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const isMobile = useMediaQuery("(max-width: 767px)");

	const open = isControlled ? openProp : internalOpen;

	const setOpen = React.useCallback(
		(nextOpen: boolean) => {
			onOpenChange?.(nextOpen);

			if (!isControlled) {
				setInternalOpen(nextOpen);
			}
		},
		[isControlled, onOpenChange]
	);

	const toggle = React.useCallback(() => {
		setOpen(!open);
	}, [open, setOpen]);

	React.useEffect(() => {
		if (typeof document === "undefined" || !isMobile) {
			return;
		}

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = open ? "hidden" : previousOverflow;

		return () => {
			document.body.style.overflow = previousOverflow;
		};
	}, [open, isMobile]);

	const value = React.useMemo(
		() => ({ open, setOpen, toggle, side, isMobile, collapsed: !open && !isMobile }),
		[open, setOpen, toggle, side, isMobile]
	);

	return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode;
	className?: string;
	panelClassName?: string;
	overlayClassName?: string;
	widthClassName?: string;
	collapsedWidthClassName?: string;
}

export function Sidebar({
	children,
	className,
	panelClassName,
	overlayClassName,
	widthClassName,
	collapsedWidthClassName,
	...props
}: SidebarProps) {
	const { open, setOpen, side, isMobile } = useSidebarContext();

	const panelSideClasses = side === "left" ? "left-0 border-r" : "right-0 border-l";
	const closedTranslateClasses =
		side === "left" ? "-translate-x-full md:translate-x-0" : "translate-x-full md:translate-x-0";

	return (
		<div className={clsx("relative", className)} {...props}>
			<div
				className={clsx(
					"fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 md:hidden",
					open ? "opacity-100" : "pointer-events-none opacity-0",
					overlayClassName
				)}
				aria-hidden="true"
				onClick={() => {
					if (isMobile && open) {
						setOpen(false);
					}
				}}
			/>

			<aside
				className={clsx(
					"fixed inset-y-0 z-50 flex flex-col overflow-visible bg-surface/95 text-on-surface shadow-2xl backdrop-blur-md transition-all duration-300 ease-out outline-none",
					panelSideClasses,
					open
						? clsx("translate-x-0", widthClassName ?? "w-[18rem] md:w-[17rem]")
						: clsx(
							closedTranslateClasses,
							"md:w-[4.75rem]",
							collapsedWidthClassName ?? "w-[18rem]"
						),
					panelClassName
				)}
				data-state={open ? "open" : "closed"}
				aria-hidden={isMobile && !open}
			>
				{children}
			</aside>
		</div>
	);
}

export function SidebarTrigger({
	className,
	...props
}: Omit<React.ComponentProps<typeof Button>, "children">) {
	const { toggle } = useSidebarContext();

	return (
		<Button
			type="button"
			variant="ghost"
			size="icon"
			aria-label="Toggle sidebar"
			className={className}
			onClick={toggle}
			{...props}
		>
			<Menu className="h-5 w-5" />
		</Button>
	);
}

export function SidebarRail({
	className,
	...props
}: React.ComponentProps<"button">) {
	const { toggle, open, side } = useSidebarContext();

	return (
		<button
			type="button"
			aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
			onClick={toggle}
			className={clsx(
				"hidden md:flex absolute top-4 z-10 h-8 w-8 items-center justify-center rounded-full border border-primary/45 bg-surface text-primary shadow-md ring-2 ring-surface transition-all hover:border-primary hover:bg-primary-container hover:text-on-primary-container focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
				side === "left" ? "-right-4" : "-left-4 rotate-180",
				className
			)}
			{...props}
		>
			<ChevronRight className="h-4 w-4" />
		</button>
	);
}

export function SidebarHeader({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				"flex items-center gap-3 border-b border-outline-variant px-[var(--space-4)] py-[var(--space-4)]",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SidebarContent({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx("flex-1 overflow-y-auto px-[var(--space-3)] py-[var(--space-4)]", className)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SidebarFooter({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx(
				"border-t border-outline-variant px-[var(--space-4)] py-[var(--space-4)]",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SidebarDivider({
	className,
	...props
}: React.ComponentProps<typeof Separator>) {
	return <Separator className={clsx("my-[var(--space-3)]", className)} {...props} />;
}

export function SidebarGroup({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div className={clsx("mb-[var(--space-4)] last:mb-0", className)} {...props}>
			{children}
		</div>
	);
}

export function SidebarGroupLabel({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { collapsed } = useSidebarContext();

	return (
		<div
			className={clsx(
				"px-[var(--space-3)] pb-[var(--space-2)] text-xs font-semibold uppercase tracking-[0.14em] text-on-surface-variant",
				collapsed && "md:sr-only",
				className
			)}
			{...props}
		>
			{children}
		</div>
	);
}

export function SidebarGroupAction({
	children,
	className,
	...props
}: Omit<React.ComponentProps<typeof Button>, "children"> & { children: React.ReactNode }) {
	return (
		<Button
			variant="ghost"
			size="icon"
			className={clsx("h-8 w-8 text-on-surface-variant", className)}
			{...props}
		>
			{children}
		</Button>
	);
}

export function SidebarMenu({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul className={clsx("flex flex-col gap-0.5", className)} {...props}>
			{children}
		</ul>
	);
}

export function SidebarMenuItem({
	children,
	className,
	...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
	return (
		<li className={clsx("list-none", className)} {...props}>
			{children}
		</li>
	);
}

type SidebarMenuButtonBaseProps = {
	active?: boolean;
	leading?: React.ReactNode;
	trailing?: React.ReactNode;
	badge?: React.ReactNode;
	children: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
};

type SidebarMenuButtonAsButtonProps = SidebarMenuButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
		href?: undefined;
	};

type SidebarMenuButtonAsLinkProps = SidebarMenuButtonBaseProps &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "onClick"> & {
		href: string;
	};

type SidebarMenuButtonProps = SidebarMenuButtonAsButtonProps | SidebarMenuButtonAsLinkProps;

export const SidebarMenuButton = React.forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	SidebarMenuButtonProps
>(({ active, leading, trailing, badge, href, children, className, onClick, ...props }, ref) => {
	const { collapsed } = useSidebarContext();
	const baseClasses = clsx(
		"group flex w-full items-center rounded-[0.9rem] py-2 text-left text-sm font-medium transition-all duration-150",
		collapsed ? "justify-center px-2 md:gap-0" : "justify-start gap-2.5 px-3",
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
		active
			? "bg-primary/10 text-primary"
			: "text-on-surface-variant hover:bg-surface-variant/80 hover:text-on-surface"
	);

	const content = (
		<>
			{leading ? (
				<span className="flex size-7 shrink-0 items-center justify-center rounded-[0.7rem] bg-surface-variant/80 text-on-surface">
					{leading}
				</span>
			) : null}
			<span className={clsx("min-w-0 flex-1 truncate", collapsed && "md:sr-only")}>
				{children}
			</span>
			{badge ? <span className={clsx("text-[11px] text-on-surface-variant", collapsed && "md:sr-only")}>{badge}</span> : null}
			{trailing ? <span className={clsx("text-on-surface-variant/80", collapsed && "md:sr-only")}>{trailing}</span> : null}
		</>
	);

	if (href) {
		return (
			<a
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				title={typeof children === "string" ? children : props.title}
				className={clsx(baseClasses, className)}
				onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
				{...(props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "onClick">)}
			>
				{content}
			</a>
		);
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type="button"
			title={typeof children === "string" ? children : props.title}
			className={clsx(baseClasses, className)}
			onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
			{...(props as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">)}
		>
			{content}
		</button>
	);
});

SidebarMenuButton.displayName = "SidebarMenuButton";

export function SidebarMenuBadge({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLSpanElement>) {
	return (
		<span
			className={clsx(
				"rounded-full bg-surface-variant px-2 py-0.5 text-xs font-medium text-on-surface-variant",
				className
			)}
			{...props}
		>
			{children}
		</span>
	);
}

export function SidebarMenuSub({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLUListElement>) {
	return (
		<ul className={clsx("ml-2 mt-1 flex flex-col gap-0.5 border-l border-outline-variant/70 pl-2.5", className)} {...props}>
			{children}
		</ul>
	);
}

export function SidebarMenuSubItem({
	children,
	className,
	...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
	return (
		<li className={clsx("list-none", className)} {...props}>
			{children}
		</li>
	);
}

type SidebarMenuSubButtonBaseProps = {
	active?: boolean;
	children: React.ReactNode;
	className?: string;
	onClick?: React.MouseEventHandler<HTMLElement>;
};

type SidebarMenuSubButtonAsButtonProps = SidebarMenuSubButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick"> & {
		href?: undefined;
	};

type SidebarMenuSubButtonAsLinkProps = SidebarMenuSubButtonBaseProps &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "onClick"> & {
		href: string;
	};

type SidebarMenuSubButtonProps = SidebarMenuSubButtonAsButtonProps | SidebarMenuSubButtonAsLinkProps;

export const SidebarMenuSubButton = React.forwardRef<
	HTMLButtonElement | HTMLAnchorElement,
	SidebarMenuSubButtonProps
>(({ active, href, children, className, onClick, ...props }, ref) => {
	const baseClasses = clsx(
		"flex w-full items-center gap-2 rounded-[var(--radius-compact)] px-3 py-2 text-sm transition-colors",
		active
			? "bg-primary/10 text-primary"
			: "text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"
	);

	if (href) {
		return (
			<a
				ref={ref as React.Ref<HTMLAnchorElement>}
				href={href}
				title={typeof children === "string" ? children : props.title}
				className={clsx(baseClasses, className)}
				onClick={onClick as React.MouseEventHandler<HTMLAnchorElement>}
				{...(props as Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "onClick">)}
			>
				{children}
			</a>
		);
	}

	return (
		<button
			ref={ref as React.Ref<HTMLButtonElement>}
			type="button"
			title={typeof children === "string" ? children : props.title}
			className={clsx(baseClasses, className)}
			onClick={onClick as React.MouseEventHandler<HTMLButtonElement>}
			{...(props as Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children" | "onClick">)}
		>
			{children}
		</button>
	);
});

SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

type SidebarMenuCollapsibleContextValue = {
	open: boolean;
	setOpen: (open: boolean) => void;
	toggle: () => void;
};

const SidebarMenuCollapsibleContext = React.createContext<SidebarMenuCollapsibleContextValue | null>(null);

function useSidebarMenuCollapsibleContext() {
	const context = React.useContext(SidebarMenuCollapsibleContext);

	if (!context) {
		throw new Error("SidebarMenuCollapsible components must be used within SidebarMenuCollapsible");
	}

	return context;
}

type SidebarMenuCollapsibleProps = {
	children: React.ReactNode;
	defaultOpen?: boolean;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
};

export function SidebarMenuCollapsible({
	children,
	defaultOpen = false,
	open: openProp,
	onOpenChange,
	className,
}: SidebarMenuCollapsibleProps) {
	const isControlled = openProp !== undefined;
	const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
	const open = isControlled ? openProp : internalOpen;

	const setOpen = React.useCallback(
		(nextOpen: boolean) => {
			onOpenChange?.(nextOpen);

			if (!isControlled) {
				setInternalOpen(nextOpen);
			}
		},
		[isControlled, onOpenChange]
	);

	const toggle = React.useCallback(() => {
		setOpen(!open);
	}, [open, setOpen]);

	const value = React.useMemo(() => ({ open, setOpen, toggle }), [open, setOpen, toggle]);

	return (
		<SidebarMenuCollapsibleContext.Provider value={value}>
			<div className={clsx("group", className)} data-state={open ? "open" : "closed"}>
				{children}
			</div>
		</SidebarMenuCollapsibleContext.Provider>
	);
}

type SidebarMenuCollapsibleTriggerProps = Omit<SidebarMenuButtonProps, "href" | "active">;

export const SidebarMenuCollapsibleTrigger = React.forwardRef<
	HTMLButtonElement,
	SidebarMenuCollapsibleTriggerProps
>(({ children, leading, badge, className, ...props }, ref) => {
	const { open, toggle } = useSidebarMenuCollapsibleContext();
	const buttonProps = { ...props };
	delete buttonProps.trailing;

	return (
		<SidebarMenuButton
			ref={ref}
			active={open}
			leading={leading}
			badge={badge}
			trailing={
				<span className={clsx("transition-transform duration-150", open && "rotate-90")}>
					<ChevronRight className="h-4 w-4" />
				</span>
			}
			className={className}
			aria-expanded={open}
			onClick={toggle}
			{...(buttonProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
		>
			{children}
		</SidebarMenuButton>
	);
});

SidebarMenuCollapsibleTrigger.displayName = "SidebarMenuCollapsibleTrigger";

export function SidebarMenuCollapsibleContent({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>) {
	const { open } = useSidebarMenuCollapsibleContext();
	const { collapsed } = useSidebarContext();
	const [shouldRender, setShouldRender] = React.useState(open);
	const [isExpanded, setIsExpanded] = React.useState(open);

	React.useLayoutEffect(() => {
		if (open) {
			setShouldRender(true);
			setIsExpanded(false);

			const firstFrame = window.requestAnimationFrame(() => {
				window.requestAnimationFrame(() => {
					setIsExpanded(true);
				});
			});

			return () => window.cancelAnimationFrame(firstFrame);
		}

		setIsExpanded(false);

		const timer = window.setTimeout(() => {
			setShouldRender(false);
		}, 180);

		return () => window.clearTimeout(timer);
	}, [open]);

	if (!shouldRender || collapsed) {
		return null;
	}

	return (
		<div
			className={clsx(
				"overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-out will-change-[max-height,opacity,transform]",
				isExpanded ? "max-h-48 opacity-100 translate-y-0" : "max-h-0 opacity-0 -translate-y-1",
				className
			)}
			{...props}
		>
			<div className="pt-1">{children}</div>
		</div>
	);
}

export function SidebarInset({
	children,
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	return (
		<main className={clsx("min-w-0 flex-1", className)} {...props}>
			{children}
		</main>
	);
}

export const SideMenuProvider = SidebarProvider;
export const SideMenu = Sidebar;
export const SideMenuTrigger = SidebarTrigger;
export const SideMenuRail = SidebarRail;
export const SideMenuHeader = SidebarHeader;
export const SideMenuContent = SidebarContent;
export const SideMenuFooter = SidebarFooter;
export const SideMenuDivider = SidebarDivider;
export const SideMenuGroup = SidebarGroup;
export const SideMenuGroupLabel = SidebarGroupLabel;
export const SideMenuGroupAction = SidebarGroupAction;
export const SideMenuMenu = SidebarMenu;
export const SideMenuMenuItem = SidebarMenuItem;
export const SideMenuMenuButton = SidebarMenuButton;
export const SideMenuMenuBadge = SidebarMenuBadge;
export const SideMenuMenuSub = SidebarMenuSub;
export const SideMenuMenuSubItem = SidebarMenuSubItem;
export const SideMenuMenuSubButton = SidebarMenuSubButton;
export const SideMenuMenuCollapsible = SidebarMenuCollapsible;
export const SideMenuMenuCollapsibleTrigger = SidebarMenuCollapsibleTrigger;
export const SideMenuMenuCollapsibleContent = SidebarMenuCollapsibleContent;
export const SideMenuInset = SidebarInset;
