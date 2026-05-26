import { useState } from "react";

type Column<T> = {
    key: keyof T | string;
    label: string;
    center?: boolean;
    sortable?: boolean;
};

type SortableTableProps<T> = {
    data: T[];
    columns: Column<T>[];
    renderRow?: (row: T) => React.ReactNode;
    itemsPerPage: number;
    currentPage: number;
    onPageChange: (page: number) => void;
};

export function SortableTable<T extends Record<string, any>>({
    data,
    columns,
    renderRow,
    itemsPerPage,
    currentPage,
    onPageChange,
}: SortableTableProps<T>) {
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(
        null
    );

    const sortedData = [...data].sort((a, b) => {
        if (!sortConfig) return 0;
        const valueA = a[sortConfig.key];
        const valueB = b[sortConfig.key];

        const aValue = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
        const bValue = typeof valueB === "string" ? valueB.toLowerCase() : valueB;

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
    });

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSort = (key: keyof T) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig?.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    return (
        <div>
            <table className="w-full text-left text-sm">
                <thead className="sticky top-0 z-10 bg-gray-900 dark:bg-gray-800 text-white">
                    <tr>
                        {columns.map((col) => {
                            const isSortable = col.sortable !== false;
                            const isActive = sortConfig?.key === col.key;

                            return (
                                <th
                                    key={String(col.key)}
                                    onClick={isSortable ? () => handleSort(col.key as keyof T) : undefined}
                                    className={`px-4 py-3 font-semibold uppercase tracking-wider text-xs select-none ${
                                        col.center ? "text-center" : ""
                                    } ${isSortable ? "cursor-pointer" : ""}`}
                                >
                                    {col.label}
                                    {isSortable && isActive && (
                                        <span className="ml-1">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {paginatedData.map((row, i) => (
                        <tr
                            key={i}
                            className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800 hover:bg-gray-100/70 dark:hover:bg-gray-700/50 transition-colors"
                        >
                            {renderRow
                                ? renderRow(row)
                                : columns.map((col) => (
                                        <td
                                            key={String(col.key)}
                                            className={`px-4 py-3 ${col.center ? "text-center" : ""}`}
                                        >
                                            {row[col.key as keyof T]}
                                        </td>
                                    ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/60">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    Mostrando {paginatedData.length} de {data.length}
                </p>
                <div className="flex items-center gap-2">
                    <button
                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span className="text-xs">
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            </div>
        </div>
    );
}