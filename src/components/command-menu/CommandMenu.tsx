import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import clsx from "clsx";
import { Search } from "lucide-react";
import { Input } from "../input/Input";
import { CommandMenuItem } from "./CommandMenuItem";

export interface CommandMenuItemType {
	id: string;
	title: string;
	description?: string;
	onSelect: () => void;
}

export interface CommandMenuGroupType {
	id: string;
	heading: string;
	items: CommandMenuItemType[];
}

export interface CommandMenuProps {
	groups?: CommandMenuGroupType[];
	items?: CommandMenuItemType[];
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function CommandMenu({
	groups,
	items,
	open,
	onOpenChange,
}: CommandMenuProps) {
	const [internalOpen, setInternalOpen] = useState(false);
	const isOpen = open !== undefined ? open : internalOpen;
	const setIsOpen = onOpenChange !== undefined ? onOpenChange : setInternalOpen;
	const [isMounted, setIsMounted] = useState(false);
	const [animateIn, setAnimateIn] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [activeIndex, setActiveIndex] = useState(0);
	const listRef = useRef<Array<HTMLLIElement | null>>([]);
	const inputRef = useRef<HTMLInputElement>(null);

	const normalizedGroups = useMemo(() => {
		if (groups) return groups;
		if (items) return [{ id: "default", heading: "", items }];
		return [];
	}, [groups, items]);

	const filteredItems = useMemo(() => {
		if (!searchQuery) return normalizedGroups;

		return normalizedGroups.map(group => ({
			...group,
			items: group.items.filter(item =>
				item.title.toLowerCase().includes(searchQuery.toLowerCase())
			)
		})).filter(group => group.items.length > 0);
	}, [searchQuery, normalizedGroups]);

	const flatFilteredItems = useMemo(() => filteredItems.flatMap(group => group.items), [filteredItems]);

	const handleClose = useCallback(() => {
		setAnimateIn(false);
		setTimeout(() => {
			setIsOpen(false);
			setIsMounted(false);
		}, 200);
	}, [setIsOpen]);

	const handleSelect = useCallback((item: CommandMenuItemType) => {
		item.onSelect();
		handleClose();
	}, [handleClose]);

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				if (!isOpen) setIsOpen(true); else handleClose();
			}
			if (isOpen) {
				if (e.key === "Escape") handleClose();
				else if (e.key === "ArrowDown") {
					e.preventDefault();
					setActiveIndex((prev) => (prev + 1) % flatFilteredItems.length);
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
					setActiveIndex((prev) => (prev - 1 + flatFilteredItems.length) % flatFilteredItems.length);
				} else if (e.key === "Enter") {
					e.preventDefault();
					const selectedItem = flatFilteredItems[activeIndex];
					if (selectedItem) {
						handleSelect(selectedItem);
					}
				}
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, [isOpen, activeIndex, flatFilteredItems, handleClose, handleSelect, setIsOpen]);

	useEffect(() => { if (isOpen) setIsMounted(true); }, [isOpen]);

	useEffect(() => {
		if (isMounted) {
			requestAnimationFrame(() => {
				setAnimateIn(true);
				inputRef.current?.focus();
			});
			setActiveIndex(0);
			setSearchQuery("");
		}
	}, [isMounted]);

	useEffect(() => { setActiveIndex(0); }, [searchQuery]);

	useEffect(() => {
		if (isMounted) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "";
		return () => { document.body.style.overflow = ""; };
	}, [isMounted]);

	useEffect(() => {
		if (isMounted && listRef.current[activeIndex]) {
			listRef.current[activeIndex]?.scrollIntoView({ block: "nearest" });
		}
	}, [isMounted, activeIndex]);

	if (!isMounted) return null;

	let itemIndex = -1;

	return (
		<>
			<div
				className={clsx("fixed inset-0 bg-black/50 bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-200", animateIn ? "opacity-100" : "opacity-0")}
				onClick={handleClose}
			/>
			<div
				className="fixed inset-0 flex items-start justify-center z-50 p-4 pt-24"
				onClick={handleClose}
			>
				<div
					className={clsx("bg-surface border border-outline rounded-lg shadow-lg max-w-lg w-full relative transition-all duration-200 ease-out", animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12")}
					onClick={(e) => e.stopPropagation()}
				>
					<div className="relative p-4">
						<Search className="absolute left-7 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface/50" />
						<Input
							ref={inputRef}
							placeholder="Search..."
							className="pl-9 w-full"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="p-4 pt-0 max-h-[400px] overflow-y-auto">
						{flatFilteredItems.length > 0 ? (
							<ul>
								{filteredItems.map(group => (
									<li key={group.id}>
										{group.heading && <p className="text-sm text-on-surface/75 px-2 pb-2 pt-4">{group.heading}</p>}
										<ul>
											{group.items.map(item => {
												itemIndex++;
												const currentIndex = itemIndex;
												return (
													<CommandMenuItem
														key={item.id}
														ref={(el) => { listRef.current[currentIndex] = el; }}
														isActive={activeIndex === currentIndex}
														onSelect={() => handleSelect(item)}
													>
														<div className="flex flex-col gap-1">
															<p>{item.title}</p>
															{item.description && <p className="text-xs opacity-75">{item.description}</p>}
														</div>
													</CommandMenuItem>
												)
											})}
										</ul>
									</li>
								))}
							</ul>
						) : (
							<p className="text-center text-sm text-on-surface/75 py-4">No results found.</p>
						)}
					</div>
				</div>
			</div>
		</>
	);
};