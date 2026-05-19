import React, { useState, useEffect } from "react";
import {
	Trash2,
	ChevronDown,
	ChevronUp,
	Search,
	Filter as FilterIcon,
	RefreshCcw,
} from "lucide-react";
import { Button } from "./Button";
import { Select, type SelectOption } from "./Select";
import { Input } from "./Input";
import { Checkbox } from "./Checkbox";
import clsx from "clsx";

export type FilterFieldType = "select" | "text" | "date";

export interface FilterField {
	label: string;
	type: FilterFieldType;
	icon?: React.ReactNode;
	options?: readonly string[];
}

export interface FilterValue {
	id: string;
	field: string;
	operator: string;
	value: string;
}

export interface Operator {
	value: string;
	label: string;
	noValue?: boolean;
}

const DEFAULT_OPERATORS: Record<FilterFieldType, Operator[]> = {
	select: [
		{ value: "=", label: "ist" },
		{ value: "!", label: "ist nicht" },
		{ value: "all", label: "alle", noValue: true },
		{ value: "none", label: "keine", noValue: true },
	],
	text: [
		{ value: "~", label: "enthält" },
		{ value: "!~", label: "enthält nicht" },
		{ value: "=", label: "ist exakt" },
		{ value: "^", label: "beginnt mit" },
		{ value: "$", label: "endet mit" },
	],
	date: [
		{ value: "=", label: "ist am" },
		{ value: ">", label: "nach dem" },
		{ value: "<", label: "vor dem" },
		{ value: "t-n", label: "letzte X Tage" },
		{ value: "t", label: "heute", noValue: true },
		{ value: "w", label: "diese Woche", noValue: true },
	],
};

export interface FilterProps {
	fields: Record<string, FilterField>;
	onApply: (filters: FilterValue[]) => void;
	initialFilters?: FilterValue[];
	title?: string;
	allowAutoUpdate?: boolean;
}

export const Filter = ({
	fields,
	onApply,
	initialFilters = [],
	title = "Filter-Konfiguration",
	allowAutoUpdate = true,
}: FilterProps) => {
	const [activeFilters, setActiveFilters] =
		useState<FilterValue[]>(initialFilters);
	const [isExpanded, setIsExpanded] = useState(true);
	const [autoApply, setAutoApply] = useState(allowAutoUpdate);

	// Debounced Apply
	useEffect(() => {
		if (autoApply) {
			const timer = setTimeout(() => onApply(activeFilters), 400);
			return () => clearTimeout(timer);
		}
	}, [activeFilters, autoApply, onApply]);

	const addFilter = (fieldKey: string) => {
		const field = fields[fieldKey];
		if (!field) return;

		const operators = DEFAULT_OPERATORS[field.type];
		const defaultOp = operators[0];
		const newFilter: FilterValue = {
			id: Math.random().toString(36).substring(2, 11),
			field: fieldKey,
			operator: defaultOp.value,
			value: field.options ? (field.options[0] as string) : "",
		};
		setActiveFilters([...activeFilters, newFilter]);
	};

	const removeFilter = (id: string) => {
		setActiveFilters(activeFilters.filter((f) => f.id !== id));
	};

	const updateFilter = (id: string, updates: Partial<FilterValue>) => {
		setActiveFilters((prev) =>
			prev.map((f) => {
				if (f.id !== id) return f;
				const updated = { ...f, ...updates };

				if (updates.field) {
					const newField = fields[updates.field];
					if (newField) {
						updated.operator =
							DEFAULT_OPERATORS[newField.type][0].value;
						updated.value = newField.options
							? (newField.options[0] as string)
							: "";
					}
				}
				return updated;
			}),
		);
	};

	const availableFieldKeys = Object.keys(fields).filter(
		(key) => !activeFilters.find((f) => f.field === key),
	);

	const fieldOptions: SelectOption<string>[] = Object.entries(fields).map(
		([key, cfg]) => ({
			value: key,
			label: cfg.label,
		}),
	);

	return (
		<div className="w-full bg-surface border border-outline-variant rounded-[var(--radius-surface)] shadow-lg overflow-hidden transition-all duration-300">
			{/* Header */}
			<div
				className={clsx(
					"flex items-center justify-between px-[var(--space-5)] py-[var(--space-4)] cursor-pointer select-none transition-colors",
					isExpanded
						? "bg-surface-variant/20 border-b border-outline-variant"
						: "hover:bg-surface-variant/10",
				)}
				onClick={() => setIsExpanded(!isExpanded)}
			>
				<div className="flex items-center gap-[var(--space-3)]">
					<div
						className={clsx(
							"p-[var(--space-2)] rounded-[var(--radius-control)] transition-colors",
							activeFilters.length > 0
								? "bg-primary text-on-primary"
								: "bg-surface-variant text-on-surface-variant",
						)}
					>
						<FilterIcon size={18} />
					</div>
					<div>
						<h3 className="font-bold text-on-surface text-sm leading-tight">
							{title}
						</h3>
						<p className="text-xs text-on-surface-variant mt-[0.125rem]">
							{activeFilters.length === 0
								? "Keine aktiven Filter - Zeige alle Einträge"
								: `${activeFilters.length} aktive Bedingung(en)`}
						</p>
					</div>
				</div>

				<div className="flex items-center gap-[var(--space-4)]">
					{allowAutoUpdate && (
						<div
							className="hidden md:block"
							onClick={(e) => e.stopPropagation()}
						>
							<Checkbox
								checked={autoApply}
								onChange={setAutoApply}
								label="Auto-Update"
								className="text-xs! text-on-surface-variant"
							/>
						</div>
					)}
					<div className="h-4 w-px bg-outline-variant hidden md:block"></div>
					{isExpanded ? (
						<ChevronUp
							size={20}
							className="text-on-surface-variant"
						/>
					) : (
						<ChevronDown
							size={20}
							className="text-on-surface-variant"
						/>
					)}
				</div>
			</div>

			{/* Body */}
			{isExpanded && (
				<div className="p-[var(--space-5)]">
					<div className="space-y-[var(--space-3)]">
						{activeFilters.map((filter) => {
							const fieldConfig = fields[filter.field];
							if (!fieldConfig) return null;

							const operators =
								DEFAULT_OPERATORS[fieldConfig.type];
							const currentOp = operators.find(
								(o) => o.value === filter.operator,
							);

							return (
								<div
									key={filter.id}
									className="flex flex-wrap md:flex-nowrap items-center gap-[var(--space-3)] p-[var(--space-3)] bg-surface border border-outline-variant rounded-[var(--radius-control)] hover:border-primary/30 transition-all animate-in fade-in slide-in-from-left-2 duration-200"
								>
									{/* Field Selector */}
									<div className="shrink-0 w-full md:w-48">
										<Select
											value={filter.field}
											onChange={(val) =>
												updateFilter(filter.id, {
													field: val as string,
												})
											}
											options={fieldOptions}
										/>
									</div>

									{/* Operator Selector */}
									<div className="shrink-0 w-full md:w-40">
										<Select
											value={filter.operator}
											onChange={(val) =>
												updateFilter(filter.id, {
													operator: val as string,
												})
											}
											options={operators.map((op) => ({
												value: op.value,
												label: op.label,
											}))}
										/>
									</div>

									{/* Value Input */}
									{!currentOp?.noValue && (
										<div className="grow min-w-[200px]">
											{fieldConfig.type === "select" &&
											fieldConfig.options ? (
												<Select
													value={filter.value}
													onChange={(val) =>
														updateFilter(
															filter.id,
															{
																value: val as string,
															},
														)
													}
													options={fieldConfig.options.map(
														(opt) => ({
															value: opt,
															label: opt,
														}),
													)}
												/>
											) : (
												<Input
													type={
														fieldConfig.type ===
														"date"
															? "date"
															: "text"
													}
													value={filter.value}
													onChange={(e) =>
														updateFilter(
															filter.id,
															{
																value: e.target
																	.value,
															},
														)
													}
													placeholder={
														fieldConfig.type ===
														"date"
															? ""
															: "Suchbegriff..."
													}
												/>
											)}
										</div>
									)}

									{/* Action Button */}
									<Button
										variant="ghost"
										size="icon"
										onClick={() => removeFilter(filter.id)}
										title="Bedingung entfernen"
										className="text-on-surface-variant hover:text-error hover:bg-error/10 ml-auto"
									>
										<Trash2 size={18} />
									</Button>
								</div>
							);
						})}
					</div>

					{/* Footer */}
					<div className="flex flex-col sm:flex-row items-center justify-between mt-[var(--space-6)] pt-[var(--space-5)] border-t border-outline-variant gap-[var(--space-4)]">
						<div className="flex items-center gap-[var(--space-3)] w-full sm:w-auto">
							<div className="w-full sm:w-[16rem]">
								<Select
									value=""
									onChange={(val) => {
										if (val) addFilter(val as string);
									}}
									options={[
										{
											value: "",
											label: "+ Filter hinzufügen...",
										},
										...availableFieldKeys.map((key) => ({
											value: key,
											label: fields[key].label,
										})),
									]}
									placeholder="+ Filter hinzufügen..."
								/>
							</div>

							{activeFilters.length > 0 && (
								<Button
									variant="link"
									onClick={() => setActiveFilters([])}
									className="text-on-surface-variant hover:text-error"
								>
									Alle leeren
								</Button>
							)}
						</div>

						<div className="flex items-center gap-[var(--space-2)] w-full sm:w-auto">
							{!autoApply && (
								<Button
									onClick={() => onApply(activeFilters)}
									className="w-full sm:w-auto gap-[var(--space-2)]"
								>
									<Search size={16} />
									Filter anwenden
								</Button>
							)}
							{autoApply && (
								<div className="flex items-center gap-[var(--space-2)] text-primary bg-primary/10 px-[var(--space-3)] py-[0.375rem] rounded-[var(--radius-control)] border border-primary/20 animate-pulse">
									<RefreshCcw
										size={14}
										className="animate-spin duration-3000"
									/>
									<span className="text-[10px] font-bold uppercase tracking-wider">
										Live Update
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};
