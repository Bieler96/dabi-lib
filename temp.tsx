import React, { useState, useCallback } from "react";
import { Calendar, Type, Settings2, ListFilter, Info } from "lucide-react";
import { Filter, FilterField, FilterValue } from "./src/components/Filter";

const FIELDS: Record<string, FilterField> = {
	status: {
		label: "Status",
		type: "select",
		icon: <ListFilter size={14} />,
		options: [
			"Neu",
			"In Bearbeitung",
			"Erledigt",
			"Geschlossen",
			"Feedback",
		],
	},
	prioritaet: {
		label: "Priorität",
		type: "select",
		icon: <Settings2 size={14} />,
		options: ["Niedrig", "Normal", "Hoch", "Dringend", "Sofort"],
	},
	typ: {
		label: "Typ",
		type: "select",
		icon: <Info size={14} />,
		options: ["Fehler", "Feature", "Support"],
	},
	betreff: { label: "Betreff", type: "text", icon: <Type size={14} /> },
	autor: { label: "Autor", type: "text", icon: <Type size={14} /> },
	zugewiesen: {
		label: "Zugewiesen an",
		type: "text",
		icon: <Type size={14} />,
	},
	erstellt_am: {
		label: "Erstellt am",
		type: "date",
		icon: <Calendar size={14} />,
	},
	aktualisiert_am: {
		label: "Aktualisiert am",
		type: "date",
		icon: <Calendar size={14} />,
	},
};

const App = () => {
	const [query, setQuery] = useState<FilterValue[] | null>(null);

	const handleApply = useCallback((filters: FilterValue[]) => {
		setQuery(filters);
	}, []);

	return (
		<div className="min-h-screen bg-surface p-4 md:p-12 flex flex-col items-center text-on-surface">
			<div className="w-full max-w-4xl space-y-8">
				<div className="text-center md:text-left">
					<h1 className="text-3xl font-black tracking-tight">
						Data Explorer
					</h1>
					<p className="text-on-surface-variant mt-2">
						Nutzen Sie die neuen Filter-Komponenten, um Ihre Daten
						präzise zu segmentieren.
					</p>
				</div>

				<Filter
					fields={FIELDS}
					onApply={handleApply}
					initialFilters={[
						{
							id: "1",
							field: "status",
							operator: "=",
							value: "Neu",
						},
					]}
				/>

				{/* Output Visualization */}
				<div className="mt-12 bg-surface rounded-xl border border-outline-variant p-6 shadow-sm">
					<div className="flex items-center justify-between mb-4">
						<h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
							Query Preview
						</h4>
						<div className="h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]"></div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div className="space-y-2">
							<label className="text-[10px] font-bold text-on-surface-variant uppercase">
								Aktive Filter-Strings
							</label>
							<div className="flex flex-wrap gap-2">
								{query && query.length > 0 ? (
									query.map((f) => (
										<span
											key={f.id}
											className="inline-flex items-center gap-1.5 bg-surface-variant/20 text-on-surface px-2.5 py-1 rounded text-xs border border-outline-variant"
										>
											<span className="font-bold">
												{FIELDS[f.field]?.label ||
													f.field}
											</span>
											<span className="text-primary font-mono">
												{f.operator}
											</span>
											<span className="italic">
												"{f.value || "..."}"
											</span>
										</span>
									))
								) : (
									<span className="text-on-surface-variant text-xs italic text-center w-full py-4 border-2 border-dashed border-outline-variant rounded-lg">
										Keine Filter
									</span>
								)}
							</div>
						</div>

						<div className="bg-surface-variant/10 rounded-lg p-4 overflow-auto max-h-48">
							<pre className="text-primary text-[11px] font-mono leading-relaxed">
								{JSON.stringify(query, null, 2)}
							</pre>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
