import { useEffect, useRef, useState, useCallback } from "react";
import clsx from "clsx";
import { ChevronDown, Check } from "lucide-react";
import { Checkbox } from "./Checkbox";
import { Chip } from "./Chip";
import { CommandMenuItem } from "./command-menu/CommandMenuItem";
import { Input } from "./Input";
import { Popover } from "./Popover";

export interface SelectOption<T> {
	value: T;
	label: string;
}

export interface SelectProps<T> {
	options: SelectOption<T>[];
	value?: T | T[];
	onChange: (value: T | T[]) => void;
	multiple?: boolean;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	withSearch?: boolean;
}

export function Select<T>({
	options = [],
	value,
	onChange,
	multiple = false,
	placeholder = "Select...",
	className,
	disabled = false,
	withSearch = false,
}: SelectProps<T>) {
	const [isOpen, setIsOpen] = useState(false);
	const [activeIndex, setActiveIndex] = useState(0);
	const listRef = useRef<Array<HTMLLIElement | null>>([]);
	const [searchTerm, setSearchTerm] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const handleSelect = useCallback((optionValue: T) => {
		if (multiple && Array.isArray(value)) {
			const newValue = value.includes(optionValue)
				? value.filter((v) => v !== optionValue)
				: [...value, optionValue];
			onChange(newValue);
		} else {
			onChange(optionValue);
			setIsOpen(false);
		}
	}, [multiple, value, onChange, setIsOpen]);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		if (isOpen) {
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "ArrowDown") {
					e.preventDefault();
					setActiveIndex((prev) => (prev + 1) % filteredOptions.length);
				} else if (e.key === "ArrowUp") {
					e.preventDefault();
					setActiveIndex((prev) => (prev - 1 + filteredOptions.length) % filteredOptions.length);
				} else if (e.key === "Enter") {
					e.preventDefault();
					if (filteredOptions[activeIndex]) {
						handleSelect(filteredOptions[activeIndex].value);
					}
				} else if (e.key === "Escape") {
					setIsOpen(false);
				}
			};

			document.addEventListener("keydown", handleKeyDown);
			return () => {
				document.removeEventListener("keydown", handleKeyDown);
			};
		}
	}, [isOpen, filteredOptions, activeIndex, handleSelect]);

	useEffect(() => {
		if (isOpen && listRef.current[activeIndex]) {
			listRef.current[activeIndex]?.scrollIntoView({ block: "nearest" });
		}
	}, [isOpen, activeIndex]);

	useEffect(() => {
		if (isOpen) {
			const selectedIndex = options.findIndex(option => !multiple && option.value === value);
			setActiveIndex(selectedIndex !== -1 ? selectedIndex : 0);
			setSearchTerm("");
			if (withSearch) {
				setTimeout(() => searchInputRef.current?.focus(), 0);
			}
		}
	}, [isOpen, withSearch, options, value, multiple]);



	const getLabel = (val: T) => options.find((o) => o.value === val)?.label || String(val);

	const renderValue = () => {
		if (multiple && Array.isArray(value) && value.length > 0) {
			return (
				<div className="h-fit flex flex-wrap gap-1">
					{value && value.map((v) => (
						<Chip variant="input" key={String(v)} onDelete={(e) => {
							e.preventDefault();
							e.stopPropagation();
							handleSelect(v);
						}} label={getLabel(v)} />
					))}
				</div>
			);
		}
		if (!multiple && value !== undefined && !Array.isArray(value)) {
			return getLabel(value as T);
		}
		return <span className="text-on-surface-variant">{placeholder}</span>;
	};

	const popoverContent = (
		<div className="flex flex-col">
			{withSearch && (
				<Input
					ref={searchInputRef}
					placeholder="Search..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			)}
			<ul className="py-1 max-h-60 overflow-auto">
				{filteredOptions && filteredOptions.map((option, index) => (
					<CommandMenuItem
						key={String(option.value)}
						ref={(el) => { listRef.current[index] = el; }}
						isActive={activeIndex === index}
						onSelect={() => handleSelect(option.value)}
					>
						{multiple && Array.isArray(value) ? (
							<Checkbox
								checked={value.includes(option.value)}
								onChange={() => handleSelect(option.value)}
								label={option.label}
							/>
						) : (
							<div className="flex items-center justify-between w-full">
								<span>{option.label}</span>
								{value === option.value && <Check className="h-4 w-4" />}
							</div>
						)}
					</CommandMenuItem>
				))}
			</ul>
		</div>
	);

	return (
		<Popover
			fullWidth
			open={isOpen}
			onOpenChange={setIsOpen}
			className={clsx("w-full", className)}
			placement="bottom-start"
			trigger={
				<div
					className={clsx(
						"flex items-center justify-between w-full rounded-lg transition duration-150 border border-outline-variant outline-none focus-visible:ring-primary/50 focus-visible:ring-[3px] px-1 py-1 min-h-10",
						disabled ? "opacity-50 pointer-events-none" : "cursor-pointer",
					)}
				>
					<div className="grow w-full">{renderValue()}</div>
					<ChevronDown
						className={clsx(
							"w-5 h-5 text-on-surface-variant transition-transform duration-200",
							isOpen && "rotate-180"
						)}
					/>
				</div>
			}
			content={popoverContent}
		/>
	);
}