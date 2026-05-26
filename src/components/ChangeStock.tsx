import wretch from 'wretch';
import { apiUrl } from '../config/config';
import Swal from 'sweetalert2';
import type { CreateProps, Deposit, Product } from '../utils/interfaces';
import { useEffect, useState } from 'react';
import { Autocomplete, TextField } from '@mui/material';

export default function ChangeStock({ closeModal }: CreateProps){
    const [products, setProducts] = useState<Product[]>([]);
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [selectedDeposit, setSelectedDeposit] = useState<Deposit | null>(null);
    const [newStock, setNewStock] = useState<number | null>(null);
    const [sum, setSum] = useState<boolean>(false);

    const fetchAll = async() =>{
        const responseProducts = await wretch(`${apiUrl}/productos/lista-de-productos`)
            .options({ credentials: 'include' })
            .get()
            .json<Product[]>();
        setProducts(responseProducts);
        
        const responseDeposits = await wretch(`${apiUrl}/depositos/lista-de-depositos`)
            .options({ credentials: 'include' })
            .get()
            .json<Deposit[]>();
        setDeposits(responseDeposits);
    }

    const handleChangeStock = async(e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (newStock === null) {
                Swal.fire({
                    icon: "error",
                    text: "Debe ingresar un valor de stock válido."
                });
                return;
            }
            await wretch(`${apiUrl}/productos/modificar-stock`)
                .options({ credentials: 'include' })
                .put({
                    productId: selectedProduct?.id,
                    depositId: selectedDeposit?.id,
                    newStockValue: sum ? newStock : -newStock
                })
                .res(()=> window.location.reload());
        } catch (err) {
            if (err instanceof Error) {
                const errorObject = JSON.parse(err.message);
                Swal.fire({
                    icon: "error",
                    text: errorObject.error || "Error desconocido"
                })
            }
        }
    }

    useEffect(()=>{
        fetchAll();
    }, [])

    return(
        <div className="relative w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Cargar stock</h3>
            <form className="flex flex-col gap-4" onSubmit={handleChangeStock}>
                <Autocomplete
                disablePortal
                fullWidth
                options={products}
                getOptionLabel={(option) => option.name}
                value={selectedProduct}
                onChange={(_, newValue) => setSelectedProduct(newValue)}
                renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Nombre de producto"
                        size="small"
                        required
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
                options={deposits}
                getOptionLabel={(option) => option.name}
                value={selectedDeposit}
                onChange={(_, newValue) => setSelectedDeposit(newValue)}
                renderInput={(params) => (
                        <TextField
                        {...params}
                        label="Depósito"
                        size="small"
                        required
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
                <div className='flex gap-1'>
                    <input type="number" name='newStockValue' placeholder="Stock" value={newStock?.toString()} 
                    onChange={(e) => {
                        let value = Number(e.target.value);
                        if (value < 0) value = 0;
                        e.target.value = value.toString();
                        setNewStock(Number(e.target.value))
                    }}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                    <div className={`cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 ${sum ? "bg-emerald-200 dark:bg-emerald-800" : " bg-emerald-100 dark:bg-emerald-900/40"} px-3 py-1.5 text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                    onClick={() => {
                        setSum(true)
                    }}
                    >
                        Sumar
                    </div>
                    <div className={`cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 ${!sum ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 dark:bg-orange-900/40"} px-3 py-1.5 text-sm hover:bg-orange-200 dark:hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                    onClick={() => {
                        setSum(false)
                    }}
                    >
                        Restar
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <button type="button" onClick={closeModal}
                            className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900">
                        Cancelar
                    </button>
                    <button type="submit"
                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                        </svg>
                        Guardar
                    </button>
                </div>
            </form>
            <button onClick={closeModal} className="cursor-pointer absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    )
}