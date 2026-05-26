import { useEffect, useState } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import type { Purchase } from "../utils/interfaces";
import MultiSelectDropdown from "./MultiSelectDropdown";
import CreatePurchase from "./CreatePurchase";
import CustomDateInput from "./CustomDateInput";
import { Autocomplete, TextField } from "@mui/material";
import { SortableTable } from "./SortableTable";

export default function Purchases(){
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [filteredPurchases, setFilteredPurchases] = useState<Purchase[]>([]);
    const [purchaseSuppliers, setPurchaseSuppliers] = useState<string[]>([]);
    const [purchaseProducts, setPurchaseProducts] = useState<string[]>([]);
    const [modal, setModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        date: "",
        supplier: "",
        products: [] as string[],
        priceMin: null as number | null,
        priceMax: null as number | null,
        received: null as boolean | null
    });

    const fetchPurchases = async()=>{
        const response = await wretch(`${apiUrl}/compras/lista-de-compras`)
            .options({ credentials: "include" })
            .get()
            .json<Purchase[]>();

        setPurchases(response);
        setFilteredPurchases(response);

        const uniqueSuppliers = [...new Set(response.map(c => c.supplierName))];
        const uniqueProducts = [...new Set(response.flatMap(c => c.products.map(p => p.productName)))];

        setPurchaseSuppliers(uniqueSuppliers);
        setPurchaseProducts(uniqueProducts);
    }

    useEffect(()=>{
        fetchPurchases();
    }, [])

    const handleFilters = (field: keyof typeof filters, value: any)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    const includesAll = (arr: string[], values: string[]) => values.every(v => arr.includes(v));

    useEffect(()=>{
        setFilteredPurchases(
            purchases.filter(purchase =>(
                (filters.date !== "" ? purchase.createdAt.includes(filters.date) : true) &&
                (filters.supplier !== null ? purchase.supplierName.toString().toLowerCase().includes(filters.supplier.toLowerCase()) : true) &&
                (filters.products.length > 0 ? includesAll(purchase.products.map(p=> p.productName), filters.products) : true) &&
                (filters.priceMin !== null ? purchase.totalPrice > filters.priceMin : true) &&
                (filters.priceMax !== null ? purchase.totalPrice < filters.priceMax : true) &&
                (filters.received ? purchase.received : true)
            ))
        );
    }, [filters, purchases]);

    const handleUpdateDeliveryState = async(purchaseId: number) =>{
        try {
            await wretch(`${apiUrl}/compras/toggle-recibido`)
                .options({ credentials: 'include' })
                .put({ purchaseId })
                .res()

            setPurchases(prev => 
            prev.map(purchase => 
                purchase.id === purchaseId 
                    ? { ...purchase, received: purchase.received ? false : true }
                    : purchase
            ));
        } catch (error) {
            alert("Error al actualizar el estado del envío");
        }
    }

    return(
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased min-h-screen">
            <div className="mx-auto max-w-7xl p-5 space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">🧾 Compras</h1>
                    <div className="flex items-center gap-2">
                        <button
                        onClick={()=>setModal(true)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" stroke-linejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Cargar compra
                        </button>
                    </div>
                </header>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filtros de búsqueda</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        <CustomDateInput
                        value={filters.date}
                        onChange={(e)=>handleFilters("date", e)}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-black dark:text-gray-100 placeholder:text-black dark:placeholder:text-gray-100" 
                        />

                        <Autocomplete
                        disablePortal
                        options={purchaseSuppliers}
                        value={filters.supplier}
                        onChange={(_, newValue) => handleFilters("supplier", newValue)}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Seleccionar proveedor"
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

                        <MultiSelectDropdown options={purchaseProducts} value={filters.products}  onChange={(values) => handleFilters("products", values)} customPlaceholder="Seleccionar productos"/>
                        <input 
                        type="number" 
                        placeholder="Precio desde" 
                        onChange={(e)=>{
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            handleFilters("priceMin", value);
                        }} 
                        value={filters.priceMin ?? ""}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        
                        <input 
                        type="number" 
                        placeholder="Precio hasta" 
                        onChange={(e)=>{
                            const value = e.target.value === "" ? null : Number(e.target.value);
                            handleFilters("priceMax", value);
                        }} 
                        value={filters.priceMax ?? ""}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        
                        <select onChange={(e)=>handleFilters("received", e.target.value)} 
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                        value={filters.received === null ? "" : String(filters.received)}
                        >
                            <option value="">Estado de entrega</option>
                            <option value="Recibido">Recibido</option>
                            <option value="No recibido">No recibido</option>
                        </select>
                        <button id="btnLimpiarFiltros" className="cursor-pointer rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={()=>setFilters({
                            date: "",
                            supplier: "",
                            products: [] as string[],
                            priceMin: null as number | null,
                            priceMax: null as number | null,
                            received: false
                        })}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                        <SortableTable
                        data={filteredPurchases}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        columns={[
                            {key: "createdAt", label: "Fecha", center: true },
                            {key: "supplierName", label: "Proveedor", center: true },
                            {key: "products", label: "Productos comprados", center: true, sortable: false },
                            {key: "totalPrice", label: "Costo total", center: true },
                            {key: "state", label: "Estado de entrega", center: true, sortable: false }
                        ]}
                        renderRow={(purchase) => (
                            <>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{purchase.createdAt}</td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{purchase.supplierName}</td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1 text-gray-800 dark:text-gray-100">
                                        {purchase.products.map(purchaseProd=>{return(
                                            <div>
                                                <div className="grid grid-cols-3 text-center">
                                                    <span>{purchaseProd.productName}</span>
                                                    <span>x{purchaseProd.quantity}</span>
                                                    <span>${purchaseProd.cost}</span>
                                                </div>
                                                <hr className="opacity-20"></hr>
                                            </div>
                                            )})
                                        }
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-50">${purchase.totalPrice}</td>
                                <td className="px-4 py-3 text-center">
                                    {
                                        purchase.received
                                        ?
                                        <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                                onClick={()=>handleUpdateDeliveryState(purchase.id)}>
                                                Recibido
                                        </button>
                                        :
                                        <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 text-sm hover:bg-amber-200 dark:hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                                onClick={()=>handleUpdateDeliveryState(purchase.id)}>
                                                No recibido
                                        </button>
                                    }
                                </td>
                            </>
                        )}/>
                    </div>
                </section>
                <div className={`${modal ? "flex" : "hidden"} fixed inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center z-99999`}>
                    <CreatePurchase closeModal={()=>setModal(false)}/>
                </div>
            </div>
        </div>
    )
}