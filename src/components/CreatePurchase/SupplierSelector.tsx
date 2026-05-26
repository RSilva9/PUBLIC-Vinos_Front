import type { Supplier } from "../../utils/interfaces";
import { Autocomplete, TextField } from "@mui/material";

type SupplierSelectorProps = {
    suppliers: Supplier[];
    selectedSupplier: Supplier | null;
    onSupplierChange: (supplier: Supplier) => void;
};

export default function SupplierSelector({suppliers, selectedSupplier, onSupplierChange}: SupplierSelectorProps){
    return(
        <div>
            <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">
                Proveedor
            </label>
            <Autocomplete
                disablePortal
                options={suppliers}
                getOptionLabel={(option) => option.name}
                value={suppliers.find((s) => s.id === selectedSupplier?.id) ?? null}
                onChange={(_, newValue) => { if (newValue) onSupplierChange(newValue); }}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Seleccionar proveedor"
                    size="small"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 dark:hover:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    sx={{
                    "& fieldset": { 
                        border: "solid oklch(87.2% 0.01 258.338) 1px", 
                        borderRadius: "calc(infinity * 1px)" 
                    },
                    ".dark & fieldset": { 
                        border: "solid oklch(37.3% 0.034 259.733) 1px", 
                        borderRadius: "calc(infinity * 1px)" 
                    },
                    "& .MuiInputBase-input": {
                        color: "black",
                        "&.Mui-disabled": { WebkitTextFillColor: "rgba(0,0,0,0.38)" },
                    },
                    ".dark & .MuiInputBase-input": {
                        color: "white",
                        "&.Mui-disabled": { WebkitTextFillColor: "rgba(255,255,255,0.5)" },
                    },
                    "& .MuiInputLabel-root": {
                        color: "black",
                        display: "none"
                    },
                    ".dark & .MuiInputLabel-root": {
                        color: "white",
                    },
                    "svg": {
                        display: "none",
                    },
                    "legend": {
                        maxWidth: "0"
                    }
                    }}
                />
                )}
                slotProps={{
                paper: {
                    className: "rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 shadow-lg",
                },
                popper: {
                    className: "z-50",
                },
                listbox: {
                    className: "text-sm dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 [&>li.MuiAutocomplete-option]:px-4 [&>li.MuiAutocomplete-option]:py-2 [&>li.MuiAutocomplete-option]:hover:bg-indigo-50 dark:[&>li.MuiAutocomplete-option]:hover:bg-indigo-900/40",
                },
                }}
            />
        </div>
    )
}