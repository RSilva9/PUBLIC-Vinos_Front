import type { Deposit, ProductWithStock, PurchaseProduct } from "../../utils/interfaces";
import { Autocomplete, TextField } from "@mui/material";
import { useState } from "react";

type ProductSelectorProps = {
    products: ProductWithStock[],
    deposits: Deposit[],
    selectedProducts: PurchaseProduct[],
    setSelectedProducts: (products: PurchaseProduct[]) => void
};

export default function PurchaseProductSelector({selectedProducts, setSelectedProducts, deposits, products}: ProductSelectorProps){
    const [selectedProduct, setSelectedProduct] = useState<ProductWithStock | null>(null);
    const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
        
    const handleProductChange = (product: ProductWithStock | null) => {
        setSelectedProduct(product);
    };

    const handleDepositChange = (deposit: Deposit | null) => {
        setSelectedDeposit(deposit);
    };

    const handleAddProduct = () => {
        if(!selectedProduct) return;

        const existingSelectedProduct = selectedProducts.find(
            p => p.productId === selectedProduct.id && p.depositId === selectedDeposit?.id 
        );

        if(existingSelectedProduct) return;

        const newProduct: PurchaseProduct = {
            productId: selectedProduct.id,
            code: selectedProduct.code,
            name: selectedProduct.name,
            cepa: selectedProduct.cepa,
            type: selectedProduct.type,
            country: selectedProduct.country,
            cost: selectedProduct.cost,
            quantity: 1,
            depositId: selectedDeposit!.id,
            depositName: selectedDeposit!.name
        };

        setSelectedProducts([...selectedProducts, newProduct]);
        setSelectedProduct(null);
        setSelectedDeposit(null);
    };
    
    return(
        <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-3">Productos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 sm:grid-cols-[1.2fr_1.2fr_1.2fr_0.1fr] gap-3 mb-4">

                <Autocomplete
                disablePortal
                fullWidth
                options={deposits}
                getOptionLabel={(option) => option.name}
                value={selectedDeposit}
                onChange={(_, newValue) => handleDepositChange(newValue)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Depósito"
                    size="small"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 dark:hover:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    sx={{
                        "& fieldset": { border: "solid oklch(87.2% 0.01 258.338) 1px", borderRadius: "calc(infinity * 1px)" },
                        ".dark & fieldset": { border: "solid oklch(37.3% 0.034 259.733) 1px", borderRadius: "calc(infinity * 1px)" },
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
                        fontSize: "15px"
                        },
                        ".dark & .MuiInputLabel-root": {
                        color: "white",
                        },
                        "svg": {
                            display: "none",
                        }
                    }}
                    />
                    )}
                slotProps={{
                    paper: {
                    className:
                        "rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 shadow-lg",
                    },
                    popper: {
                    className: "z-50",
                    },
                    listbox: {
                    className:
                        "text-sm dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 [&>li.MuiAutocomplete-option]:px-4 [&>li.MuiAutocomplete-option]:py-2 [&>li.MuiAutocomplete-option]:hover:bg-indigo-50 dark:[&>li.MuiAutocomplete-option]:hover:bg-indigo-900/40",
                    },
                }}
                />

                <Autocomplete
                disablePortal
                fullWidth
                options={products}
                getOptionLabel={(option) => option.code}
                value={selectedProduct}
                onChange={(_, newValue) => handleProductChange(newValue)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Codigo de producto"
                    size="small"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 dark:hover:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    sx={{
                        "& fieldset": { border: "solid oklch(87.2% 0.01 258.338) 1px", borderRadius: "calc(infinity * 1px)" },
                        ".dark & fieldset": { border: "solid oklch(37.3% 0.034 259.733) 1px", borderRadius: "calc(infinity * 1px)" },
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
                        fontSize: "15px"
                        },
                        ".dark & .MuiInputLabel-root": {
                        color: "white",
                        },
                        "svg": {
                            display: "none",
                        }
                    }}
                    />
                )}
                slotProps={{
                    paper: {
                    className:
                        "rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 shadow-lg",
                    },
                    popper: {
                    className: "z-50",
                    },
                    listbox: {
                    className:
                        "text-sm dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 [&>li.MuiAutocomplete-option]:px-4 [&>li.MuiAutocomplete-option]:py-2 [&>li.MuiAutocomplete-option]:hover:bg-indigo-50 dark:[&>li.MuiAutocomplete-option]:hover:bg-indigo-900/40",
                    },
                }}
                />
                
                <Autocomplete
                disablePortal
                fullWidth
                options={products}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={(_, newValue) => handleProductChange(newValue)}
                renderInput={(params) => (
                    <TextField
                    {...params}
                    label="Nombre de producto"
                    size="small"
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 dark:hover:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40"
                    sx={{
                        "& fieldset": { border: "solid oklch(87.2% 0.01 258.338) 1px", borderRadius: "calc(infinity * 1px)" },
                        ".dark & fieldset": { border: "solid oklch(37.3% 0.034 259.733) 1px", borderRadius: "calc(infinity * 1px)" },
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
                        fontSize: "15px"
                        },
                        ".dark & .MuiInputLabel-root": {
                        color: "white",
                        },
                        "svg": {
                            display: "none",
                        }
                    }}
                    />
                    )}
                slotProps={{
                    paper: {
                    className:
                        "rounded-xl border border-gray-300 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 shadow-lg",
                    },
                    popper: {
                    className: "z-50",
                    },
                    listbox: {
                    className:
                        "text-sm dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 [&>li.MuiAutocomplete-option]:px-4 [&>li.MuiAutocomplete-option]:py-2 [&>li.MuiAutocomplete-option]:hover:bg-indigo-50 dark:[&>li.MuiAutocomplete-option]:hover:bg-indigo-900/40",
                    },
                }}
                />


                <button 
                className="cursor-pointer rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
                onClick={handleAddProduct}
                >
                    <i className="fas fa-plus"></i>
                </button>
            </div>
        </div>
    )
}