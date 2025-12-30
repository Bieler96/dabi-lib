import React from "react";
import { Alignment, getHeaderGroups, type HeaderGroup } from "../utils/datatable";

export type ColumnDef<TData> = {
    accessorKey: keyof TData | string;
    header: React.ReactNode | (({ column }: { column: ColumnDef<TData> }) => React.ReactNode);
    cell?: ({ row }: { row: TData }) => React.ReactNode;
};

export type DataTableProps<TData> = {
    data: TData[];
    columns?: ColumnDef<TData>[];
    headerAlignment?: Alignment;
    cellAlignment?: Alignment;
};

function getHeaderGroupsFromColumns<T>(columns: ColumnDef<T>[]): HeaderGroup[] {
    const groups: Record<string, string[]> = {};

    for (const col of columns) {
        const path = col.accessorKey as string;
        const [parent, child] = path.split(".");
        if (child) {
            if (!groups[parent]) groups[parent] = [];
            groups[parent].push(child);
        } else {
            if (!groups[parent]) groups[parent] = [];
        }
    }

    return Object.entries(groups).map(([parent, children]) => ({
        parent,
        children,
    }));
}

function getValue(obj: Record<string, unknown>, path: string): unknown {
    return path.split(".").reduce((acc: Record<string, unknown> | undefined, key) => (acc ? acc[key] as Record<string, unknown> | undefined : undefined), obj);
}

export function DataTable<TData extends Record<string, unknown>>({
    data,
    columns,
    headerAlignment = Alignment.CENTER,
    cellAlignment = Alignment.LEFT,
}: DataTableProps<TData>) {
    const getAlignmentClass = (alignment: Alignment) => {
        switch (alignment) {
            case Alignment.LEFT: return "text-left";
            case Alignment.CENTER: return "text-center";
            case Alignment.RIGHT: return "text-right";
            default: return "text-left";
        }
    };

    if (!data || data.length === 0) {
        return (
            <div className="text-center py-8 text-on-surface-variant">
                Keine Daten vorhanden.
            </div>
        );
    }

    const renderLegacyTable = () => {
        const headerGroups = getHeaderGroups(data);
        const flatColumns = headerGroups.flatMap((group) =>
            group.children.length > 0
                ? group.children.map((child) => `${group.parent}.${child}`)
                : [group.parent]
        );
        const firstIdx = 0;
        const lastIdx = headerGroups.length - 1;

        return (
            <table className="min-w-full border-separate border-spacing-0 rounded-lg">
                <thead>
                    <tr>
                        {headerGroups.map((group, idx) => {
                            const roundedClass =
                                idx === firstIdx && idx === lastIdx
                                    ? "rounded-tl-lg rounded-tr-lg"
                                    : idx === firstIdx
                                        ? "rounded-tl-lg"
                                        : idx === lastIdx
                                            ? "rounded-tr-lg"
                                            : "";
                            const isLastGroup = idx === lastIdx;
                            const shouldHaveBorderR = !isLastGroup;
                            return group.children.length > 0 ? (
                                <th
                                    key={group.parent}
                                    colSpan={group.children.length}
                                    className={`font-medium px-4 py-3 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} bg-surface-variant text-on-surface border-outline ${roundedClass}`}
                                >
                                    {(() => {
                                        if (!columns) {
                                            return group.parent;
                                        }
                                        const column = columns.find(col =>
                                            col.accessorKey === group.parent ||
                                            col.accessorKey === `${group.parent}.${group.children[0]}`
                                        );
                                        if (!column) {
                                            return group.parent;
                                        }
                                        const header = column.header;
                                        return typeof header === "function" ? header({ column }) : header ?? group.parent;
                                    })()}
                                </th>
                            ) : (
                                <th
                                    key={group.parent}
                                    rowSpan={2}
                                    className={`font-medium px-4 py-3 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} align-middle bg-surface-variant text-on-surface border-outline ${roundedClass}`}
                                >
                                    {(() => {
                                        if (!columns) {
                                            return group.parent;
                                        }
                                        const columnDef = columns.find(col => col.accessorKey === group.parent);
                                        if (!columnDef) {
                                            return group.parent;
                                        }
                                        const header = columnDef.header;
                                        return typeof header === "function" ? header({ column: columnDef }) : header ?? group.parent;
                                    })()}
                                </th>
                            );
                        })}
                    </tr>
                    <tr>
                        {headerGroups.map((group) =>
                            group.children.length > 0
                                ? group.children.map((child, childIdx, childArray) => {
                                    const isLastChild = childIdx === childArray.length - 1;
                                    const isLastGroup = headerGroups.indexOf(group) === headerGroups.length - 1;
                                    const shouldHaveBorderR = !(isLastChild && isLastGroup);
                                    return (
                                        <th
                                            key={`${group.parent}.${child}`}
                                            className={`font-normal px-4 py-2 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} bg-surface text-on-surface border-outline-variant`}
                                        >
                                            {child}
                                        </th>
                                    );
                                }) : null
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, idx) => (
                        <tr key={idx} className="transition-colors hover:bg-hover">
                            {flatColumns.map((col, colIdx) => {
                                const value = getValue(row, col);
                                const isLastRow = idx === data.length - 1;
                                const isLastCol = colIdx === flatColumns.length - 1;
                                const shouldHaveBorderR = !isLastCol;
                                return (
                                    <td
                                        key={col}
                                        className={`px-4 py-3 ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(cellAlignment)} text-on-surface border-outline-variant ${isLastRow ? "" : "border-b"}`}
                                    >
                                        {value != null ? value.toString() : ""}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    const renderGroupedTable = () => {
        const headerGroups = getHeaderGroupsFromColumns(columns!);
        const flatColumns = headerGroups.flatMap(group =>
            group.children.length > 0
                ? group.children.map(child => `${group.parent}.${child}`)
                : [group.parent]
        );

        return (
            <table className="min-w-full border-separate border-spacing-0 rounded-lg">
                <thead>
                    <tr>
                        {headerGroups.map((group, idx) => {
                            const isLastGroup = idx === headerGroups.length - 1;
                            const shouldHaveBorderR = !isLastGroup;
                            const firstIdx = 0;
                            const lastIdx = headerGroups.length - 1;
                            const roundedClass =
                                idx === firstIdx && idx === lastIdx
                                    ? "rounded-tl-lg rounded-tr-lg"
                                    : idx === firstIdx
                                        ? "rounded-tl-lg"
                                        : idx === lastIdx
                                            ? "rounded-tr-lg"
                                            : "";

                            return group.children.length > 0 ? (
                                <th
                                    key={group.parent}
                                    colSpan={group.children.length}
                                    className={`font-medium px-4 py-3 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} bg-surface-variant text-on-surface border-outline ${roundedClass}`}
                                >
                                    {(() => {
                                        const header = columns!.find(col => col.accessorKey === group.parent)?.header;
                                        if (typeof header === "function") {
                                            return header({ column: columns!.find(col => col.accessorKey === group.parent)! });
                                        }
                                        return header ?? group.parent;
                                    })()}
                                </th>
                            ) : (
                                <th
                                    key={group.parent}
                                    rowSpan={2}
                                    className={`font-medium px-4 py-3 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} align-middle bg-surface-variant text-on-surface border-outline ${roundedClass}`}
                                >
                                    {(() => {
                                        const columnDef = columns!.find(col => col.accessorKey === group.parent);
                                        if (!columnDef) {
                                            return group.parent;
                                        }
                                        const header = columnDef.header;
                                        if (typeof header === "function") {
                                            return header({ column: columns!.find(col => col.accessorKey === group.parent)! });
                                        }
                                        return header ?? group.parent;
                                    })()}
                                </th>
                            );
                        })}
                    </tr>
                    <tr>
                        {headerGroups.map((group) =>
                            group.children.length > 0
                                ? group.children.map((child, idx, arr) => {
                                    const isLastCol = idx === arr.length - 1;
                                    const shouldHaveBorderR = !isLastCol;
                                    return (
                                        <th
                                            key={`${group.parent}.${child}`}
                                            className={`font-normal px-4 py-2 border-b ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(headerAlignment)} bg-surface text-on-surface border-outline-variant`}
                                        >
                                            {(() => {
                                                const header = columns!.find(col => col.accessorKey === `${group.parent}.${child}`)?.header;
                                                if (typeof header === "function") {
                                                    return header({ column: columns!.find(col => col.accessorKey === `${group.parent}.${child}`)! });
                                                }
                                                return header ?? child;
                                            })()}
                                        </th>
                                    );
                                }) : null
                        )}
                    </tr>
                </thead>
                <tbody>
                    {data.map((row, rowIdx) => (
                        <tr key={rowIdx} className="transition-colors hover:bg-hover">
                            {flatColumns.map((col, colIdx) => {
                                const column = columns!.find(c => c.accessorKey === col);
                                const isLastRow = rowIdx === data.length - 1;
                                const isLastCol = colIdx === flatColumns.length - 1;
                                const shouldHaveBorderR = !isLastCol;
                                let cellContent = column?.cell
                                    ? column.cell({ row })
                                    : getValue(row, col);

                                if (typeof cellContent === 'object' && cellContent !== null && !React.isValidElement(cellContent)) {
                                    cellContent = JSON.stringify(cellContent);
                                }

                                return (
                                    <td
                                        key={col}
                                        className={`px-4 py-3 ${shouldHaveBorderR ? 'border-r' : ''} ${getAlignmentClass(cellAlignment)} text-on-surface border-outline-variant ${isLastRow ? "" : "border-b"}`}
                                    >
                                        {cellContent as React.ReactNode}
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="overflow-x-auto rounded-lg shadow-sm bg-surface">
            {columns ? renderGroupedTable() : renderLegacyTable()}
        </div>
    );
}