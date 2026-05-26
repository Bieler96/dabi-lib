"use client";

import * as React from "react";
import { cn } from "../utils/cn";
import { Button } from "./Button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./Dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./Drawer";
import { useIsMobile } from "../hooks/useMobile";

type DialogProps = React.ComponentProps<typeof Dialog>;
type DialogTriggerProps = React.ComponentProps<typeof DialogTrigger>;
type DialogCloseProps = React.ComponentProps<typeof DialogClose>;
type DialogContentProps = React.ComponentProps<typeof DialogContent>;
type DialogFooterProps = React.ComponentProps<typeof DialogFooter>;

type DrawerProps = React.ComponentProps<typeof Drawer>;
type DrawerTriggerProps = React.ComponentProps<typeof DrawerTrigger>;
type DrawerCloseProps = React.ComponentProps<typeof DrawerClose>;
type DrawerContentProps = React.ComponentProps<typeof DrawerContent>;

type DynamicDialogDrawerProps = DialogProps &
	Partial<DrawerProps> & {
		direction?: DrawerProps["direction"];
	};

type DynamicDialogDrawerTriggerProps = Omit<DialogTriggerProps, "render"> &
	Omit<DrawerTriggerProps, "asChild"> & {
		asChild?: DrawerTriggerProps["asChild"];
		render?: DialogTriggerProps["render"];
	};

type DynamicDialogDrawerCloseProps = Omit<DialogCloseProps, "render"> &
	Omit<DrawerCloseProps, "asChild"> & {
		asChild?: DrawerCloseProps["asChild"];
		render?: DialogCloseProps["render"];
	};

type DynamicDialogDrawerContentProps = DialogContentProps &
	DrawerContentProps & {
		dialogClassName?: string;
		drawerClassName?: string;
		scrollAreaClassName?: string;
	};

const DynamicDialogDrawerContext = React.createContext({
	isMobile: false,
	hasSnapPoints: false,
});

function useDynamicDialogDrawer() {
	return React.useContext(DynamicDialogDrawerContext);
}

function DynamicDialogDrawer({
	activeSnapPoint,
	autoFocus,
	closeThreshold,
	container,
	defaultOpen,
	dismissible,
	direction = "bottom",
	disablePreventScroll,
	fadeFromIndex,
	fixed,
	handleOnly,
	modal,
	nested,
	noBodyStyles,
	onAnimationEnd,
	onClose,
	onDrag,
	onOpenChange,
	onRelease,
	open,
	preventScrollRestoration,
	repositionInputs,
	scrollLockTimeout,
	setActiveSnapPoint,
	setBackgroundColorOnScale,
	shouldScaleBackground,
	snapPoints,
	snapToSequentialPoint,
	...dialogProps
}: DynamicDialogDrawerProps) {
	const isMobile = useIsMobile();
	const contextValue = React.useMemo(
		() => ({
			isMobile,
			hasSnapPoints: Boolean(snapPoints?.length),
		}),
		[isMobile, snapPoints],
	);

	if (isMobile) {
		const drawerProps = {
			activeSnapPoint,
			autoFocus,
			children: dialogProps.children,
			closeThreshold,
			container,
			defaultOpen,
			dismissible,
			direction,
			disablePreventScroll,
			fadeFromIndex,
			fixed,
			handleOnly,
			modal,
			nested,
			noBodyStyles,
			onAnimationEnd,
			onClose,
			onDrag,
			onOpenChange,
			onRelease,
			open,
			preventScrollRestoration,
			repositionInputs,
			scrollLockTimeout,
			setActiveSnapPoint,
			setBackgroundColorOnScale,
			shouldScaleBackground,
			snapPoints,
			snapToSequentialPoint,
		} as DrawerProps;

		return (
			<DynamicDialogDrawerContext.Provider value={contextValue}>
				<Drawer {...drawerProps} />
			</DynamicDialogDrawerContext.Provider>
		);
	}

	return (
		<DynamicDialogDrawerContext.Provider value={contextValue}>
			<Dialog
				{...dialogProps}
				defaultOpen={defaultOpen}
				disablePointerDismissal={
					dialogProps.disablePointerDismissal ?? dismissible === false
				}
				modal={modal as DialogProps["modal"]}
				onOpenChange={onOpenChange as DialogProps["onOpenChange"]}
				open={open}
			/>
		</DynamicDialogDrawerContext.Provider>
	);
}

function DynamicDialogDrawerTrigger({
	asChild,
	render,
	children,
	...props
}: DynamicDialogDrawerTriggerProps) {
	const { isMobile } = useDynamicDialogDrawer();

	if (isMobile) {
		if (React.isValidElement(render)) {
			return (
				<DrawerTrigger
					asChild
					{...(props as React.ComponentProps<typeof DrawerTrigger>)}
				>
					{render}
				</DrawerTrigger>
			);
		}

		return (
			<DrawerTrigger
				asChild={asChild}
				{...(props as React.ComponentProps<typeof DrawerTrigger>)}
			>
				{children}
			</DrawerTrigger>
		);
	}

	if (asChild && React.isValidElement(children)) {
		return (
			<DialogTrigger
				render={children}
				{...(props as React.ComponentProps<typeof DialogTrigger>)}
			/>
		);
	}

	return (
		<DialogTrigger
			render={render}
			{...(props as React.ComponentProps<typeof DialogTrigger>)}
		>
			{children}
		</DialogTrigger>
	);
}

function DynamicDialogDrawerClose({
	asChild,
	render,
	children,
	...props
}: DynamicDialogDrawerCloseProps) {
	const { isMobile } = useDynamicDialogDrawer();

	if (isMobile) {
		if (React.isValidElement(render)) {
			return (
				<DrawerClose
					asChild
					{...(props as React.ComponentProps<typeof DrawerClose>)}
				>
					{render}
				</DrawerClose>
			);
		}

		return (
			<DrawerClose
				asChild={asChild}
				{...(props as React.ComponentProps<typeof DrawerClose>)}
			>
				{children}
			</DrawerClose>
		);
	}

	if (asChild && React.isValidElement(children)) {
		return (
			<DialogClose
				render={children}
				{...(props as React.ComponentProps<typeof DialogClose>)}
			/>
		);
	}

	return (
		<DialogClose
			render={render}
			{...(props as React.ComponentProps<typeof DialogClose>)}
		>
			{children}
		</DialogClose>
	);
}

function DynamicDialogDrawerContent({
	className,
	dialogClassName,
	drawerClassName,
	scrollAreaClassName,
	showCloseButton = true,
	children,
	...props
}: DynamicDialogDrawerContentProps) {
	const { isMobile, hasSnapPoints } = useDynamicDialogDrawer();

	if (isMobile) {
		return (
			<DrawerContent
				className={cn(
					hasSnapPoints && "h-dvh max-h-dvh",
					className,
					drawerClassName,
				)}
				{...(props as React.ComponentProps<typeof DrawerContent>)}
			>
				<div
					className={cn(
						"min-h-0 overflow-y-auto overscroll-contain",
						hasSnapPoints && "flex-1",
						scrollAreaClassName,
					)}
				>
					{children}
				</div>
			</DrawerContent>
		);
	}

	return (
		<DialogContent
			className={cn(className, dialogClassName)}
			showCloseButton={showCloseButton}
			{...(props as React.ComponentProps<typeof DialogContent>)}
		>
			{children}
		</DialogContent>
	);
}

function DynamicDialogDrawerHeader(props: React.ComponentProps<"div">) {
	const { isMobile } = useDynamicDialogDrawer();
	return isMobile ? <DrawerHeader {...props} /> : <DialogHeader {...props} />;
}

function DynamicDialogDrawerFooter({
	showCloseButton = false,
	children,
	...props
}: React.ComponentProps<"div"> & Pick<DialogFooterProps, "showCloseButton">) {
	const { isMobile } = useDynamicDialogDrawer();

	if (isMobile) {
		return (
			<DrawerFooter {...props}>
				{children}
				{showCloseButton && (
					<DrawerClose asChild>
						<Button variant="outline">Close</Button>
					</DrawerClose>
				)}
			</DrawerFooter>
		);
	}

	return (
		<DialogFooter showCloseButton={showCloseButton} {...props}>
			{children}
		</DialogFooter>
	);
}

function DynamicDialogDrawerTitle(
	props: React.ComponentProps<typeof DialogTitle> &
		React.ComponentProps<typeof DrawerTitle>,
) {
	const { isMobile } = useDynamicDialogDrawer();
	return isMobile ? <DrawerTitle {...props} /> : <DialogTitle {...props} />;
}

function DynamicDialogDrawerDescription(
	props: React.ComponentProps<typeof DialogDescription> &
		React.ComponentProps<typeof DrawerDescription>,
) {
	const { isMobile } = useDynamicDialogDrawer();

	return isMobile ? (
		<DrawerDescription {...props} />
	) : (
		<DialogDescription {...props} />
	);
}

export {
	DynamicDialogDrawer,
	DynamicDialogDrawerClose,
	DynamicDialogDrawerContent,
	DynamicDialogDrawerDescription,
	DynamicDialogDrawerFooter,
	DynamicDialogDrawerHeader,
	DynamicDialogDrawerTitle,
	DynamicDialogDrawerTrigger,
};
