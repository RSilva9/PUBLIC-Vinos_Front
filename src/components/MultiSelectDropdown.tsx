import { TriangleDownIcon } from "@primer/octicons-react";
import { useState } from "react";

type MultiSelectDropdownProps = {
    options: string[];
    value: string[];
    customPlaceholder: string;
    onChange: (selected: string[]) => void;
};

export default function MultiSelectDropdown({
    options,
    value,
    customPlaceholder,
    onChange,
}: MultiSelectDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");

    const toggleOption = (option: string) => {
        const newSelected = value.includes(option)
            ? value.filter(v => v !== option)
            : [...value, option];
        onChange(newSelected);
    };

    const filteredOptions = options.filter(opt =>
        opt.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="relative">
            <div
                className="w-full flex items-center rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus-within:ring-4 focus-within:ring-indigo-100 dark:focus-within:ring-indigo-900/40 dark:text-gray-100"
                onClick={() => setIsOpen(!isOpen)}
            >
                <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder={
                        value.length > 0
                            ? `${value.length} seleccionado(s)`
                            : customPlaceholder
                    }
                    className="flex-1 bg-transparent outline-none placeholder-black dark:placeholder-white"
                />
                {/* <TriangleDownIcon size={20} fill="oklch(55.1% 0.027 264.364)" className="ml-2 cursor-pointer" /> */}
            </div>

            {isOpen && (
                <div className="absolute mt-2 w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg z-99 max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(opt => (
                            <label
                                key={opt}
                                className="flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={value.includes(opt)}
                                    onChange={() => {
                                        toggleOption(opt);
                                        setSearch("");
                                    }}
                                    className="mr-2"
                                />
                                {opt}
                            </label>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                            No hay resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}