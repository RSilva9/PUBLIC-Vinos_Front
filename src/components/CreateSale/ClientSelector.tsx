import type { Client } from "../../utils/interfaces";
import { Autocomplete, TextField } from "@mui/material";

type ClientSelectorProps = {
    clients: Client[];
    selectedClient: Client | null;
    onClientChange: (client: Client) => void;
    disabled: boolean;
    selectedSeller?: string | null;
    onSellerChange?: (seller: string) => void;
};

export default function ClientSelector({clients, selectedClient, onClientChange, disabled, selectedSeller, onSellerChange}: ClientSelectorProps){
    return(
        <div className="">
            <div>
            <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">
                Cliente
            </label>
            <Autocomplete
                disablePortal
                options={clients}
                getOptionLabel={(option) => option.name}
                value={clients.find((c) => c.id === selectedClient?.id) ?? null}
                onChange={(_, newValue) => { if (newValue) onClientChange(newValue); }}
                disabled={disabled}
                renderInput={(params) => (
                <TextField
                    {...params}
                    label="Seleccionar cliente"
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
            <div>
                <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">
                    Vendedor
                </label>
                <input 
                    type="text" 
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 dark:hover:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    value={selectedSeller ?? ""}
                    onChange={(e) => onSellerChange?.(e.target.value)}
                />
            </div>
        </div>
    )
}