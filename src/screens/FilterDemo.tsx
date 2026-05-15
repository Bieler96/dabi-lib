import { useState, useCallback } from 'react';
import {
    Calendar,
    Type,
    Settings2,
    ListFilter,
    Info,
} from 'lucide-react';
import { Filter, type FilterField, type FilterValue } from '../components/Filter';
import { useNavigation } from '../core/Router';
import { Button } from '../components/Button';

const FIELDS: Record<string, FilterField> = {
    status: {
        label: 'Status',
        type: 'select',
        icon: <ListFilter size={14} />,
        options: ['Neu', 'In Bearbeitung', 'Erledigt', 'Geschlossen', 'Feedback']
    },
    prioritaet: {
        label: 'Priorität',
        type: 'select',
        icon: <Settings2 size={14} />,
        options: ['Niedrig', 'Normal', 'Hoch', 'Dringend', 'Sofort']
    },
    typ: {
        label: 'Typ',
        type: 'select',
        icon: <Info size={14} />,
        options: ['Fehler', 'Feature', 'Support']
    },
    betreff: {
        label: 'Betreff',
        type: 'text',
        icon: <Type size={14} />
    },
    autor: {
        label: 'Autor',
        type: 'text',
        icon: <Type size={14} />
    },
    zugewiesen: {
        label: 'Zugewiesen an',
        type: 'text',
        icon: <Type size={14} />
    },
    erstellt_am: {
        label: 'Erstellt am',
        type: 'date',
        icon: <Calendar size={14} />
    },
    aktualisiert_am: {
        label: 'Aktualisiert am',
        type: 'date',
        icon: <Calendar size={14} />
    },
};

export const FilterDemo = () => {
    const nav = useNavigation();
    const [query, setQuery] = useState<FilterValue[] | null>(null);

    const handleApply = useCallback((filters: FilterValue[]) => {
        setQuery(filters);
    }, []);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-on-surface">Filter Demo</h1>
                    <p className="text-on-surface-variant mt-2">
                        Eine flexible Filter-Komponente für komplexe Datenstrukturen.
                    </p>
                </div>
                <Button variant="ghost" onClick={() => nav.popBackStack()}>
                    Zurück
                </Button>
            </div>

            <Filter
                fields={FIELDS}
                onApply={handleApply}
                initialFilters={[{ id: '1', field: 'status', operator: '=', value: 'Neu' }]}
            />

            {/* Output Visualization */}
            <div className="bg-surface border border-outline-variant rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">Query Result (Preview)</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant">Live Data</span>
                        <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Aktive Bedingungen</label>
                        <div className="flex flex-wrap gap-2 min-h-[40px]">
                            {query && query.length > 0 ? query.map(f => (
                                <div key={f.id} className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-xs border border-primary/20">
                                    <span className="font-semibold text-on-surface">{FIELDS[f.field]?.label || f.field}</span>
                                    <span className="opacity-70">{f.operator}</span>
                                    <span className="font-medium">"{f.value || '...'}"</span>
                                </div>
                            )) : (
                                <div className="w-full py-8 border-2 border-dashed border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant text-sm italic">
                                    Keine aktiven Filter
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Rohdaten (JSON)</label>
                        <div className="bg-surface-variant/30 rounded-xl p-4 overflow-auto max-h-64 border border-outline-variant">
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
