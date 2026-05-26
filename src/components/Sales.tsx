import { useEffect, useState } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import type { Sale, SaleProductWithStock } from "../utils/interfaces";
import MultiSelectDropDown from "./MultiSelectDropdown";
import CreateSale from "./CreateSale";
import CustomDateInput from "./CustomDateInput";
import { TextField, Autocomplete } from "@mui/material";
import { SortableTable } from "./SortableTable";
import FacturaListModal from "./FacturaListModal";

type SaleModalData = {
    clientId?: number;
    products?: SaleProductWithStock[];
    saleId?: number;
    isFacturar?: boolean;
    facturas?: Array<{ id: number; pdfUrl: string }>;
} | null;

export default function Sales(){
    const [sales, setSales] = useState<Sale[]>([]);
    const [filteredSales, setFilteredSales] = useState<Sale[]>([]);
    const [saleClients, setSaleClients] = useState<string[]>([]);
    const [saleProducts, setSaleProducts] = useState<string[]>([]);
    const [modalData, setModalData] = useState<SaleModalData>(null);
    const [facturaListId, setFacturaListId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        date: "",
        client: "",
        products: [] as string[],
        priceMin: null as number | null,
        priceMax: null as number | null,
        facturaState: null as boolean | null,
        deliveryState: null as boolean | null
    });

    const fetchSales = async()=>{
        const response = await wretch(`${apiUrl}/ventas/lista-de-ventas`)
            .options({ credentials: "include" })
            .get()
            .json<Sale[]>();

        setSales(response);
        setFilteredSales(response);

        const uniqueClients = [...new Set(response.map(c => c.clientName))];
        const uniqueProducts = [...new Set(response.flatMap(c => c.products.map(p => p.productName)))];

        setSaleClients(uniqueClients);
        setSaleProducts(uniqueProducts);
    }

    const handleFilters = (field: keyof typeof filters, value: any)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    const includesAll = (arr: string[], values: string[]) => 
        values.every(v => arr.includes(v));
    
    useEffect(() => {
        setFilteredSales(
            sales.filter(sale => (
                (filters.date ? sale.createdAt.includes(filters.date) : true) &&
                (filters.client ? sale.clientName.toLowerCase().includes(filters.client.toLowerCase()) : true) &&
                (filters.products.length > 0 ? includesAll(sale.products.map(p => p.productName), filters.products) : true) &&
                (filters.priceMin !== null ? sale.totalPrice >= filters.priceMin : true) &&
                (filters.priceMax !== null ? sale.totalPrice <= filters.priceMax : true) &&
                (filters.facturaState ? sale.facturado : true) &&
                (filters.deliveryState ? sale.delivered : true)
            ))
        );
    }, [filters, sales]);

    useEffect(()=>{
        fetchSales();
    }, [])

    const handleUpdateDeliveryState = async(saleId: number) =>{
        try {
            await wretch(`${apiUrl}/ventas/toggle-enviado`)
                .options({ credentials: 'include' })
                .put({ saleId })
                .res()

            setSales(prev => 
            prev.map(sale => 
                sale.id === saleId 
                    ? { ...sale, delivered: sale.delivered ? false : true }
                    : sale
            ));
        } catch (error) {
            alert("Error al actualizar el estado del envío");
        }
    }

    const openFacturarModal = (clientId: number, products: SaleProductWithStock[], saleId: number, facturas: Array<{ id: number; pdfUrl: string }>) => {
        setModalData({
            clientId,
            products,
            saleId,
            isFacturar: true,
            facturas
        });
    };

    const openNewSaleModal = ()=>{
        setModalData({});
    };

    const closeModal = ()=>{
        setModalData(null);
        fetchSales();
    };

    const closeFacturaListModal = ()=>{
        setFacturaListId(null);
    }

    return(
        <div>
            <div className="mx-auto max-w-7xl p-5 space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">🧾 Ventas</h1>
                    <div className="flex items-center gap-2">
                        <button
                        onClick={openNewSaleModal}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Cargar venta
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
                        options={saleClients}
                        value={filters.client}
                        onChange={(_, newValue) => handleFilters("client", newValue)}
                        renderInput={(params) => (
                            <TextField
                            {...params}
                            label="Seleccionar cliente"
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

                        <MultiSelectDropDown options={saleProducts} value={filters.products} onChange={(values)=>handleFilters("products", values)} customPlaceholder="Seleccionar productos"/>
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
                        <select
                        onChange={(e) => {
                            const val = e.target.value === "" ? null : (e.target.value === "true");
                            handleFilters("facturaState", val);
                        }}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                        value={filters.facturaState === null ? "" : String(filters.facturaState)}
                        >
                            <option value="">Estado de facturacion</option>
                            <option value="true">Facturado</option>
                            <option value="false">No facturado</option>
                        </select>
                        <select
                        onChange={(e) => {
                            const val = e.target.value === "" ? null : (e.target.value === "true");
                            handleFilters("deliveryState", val);
                        }}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                        value={filters.deliveryState === null ? "" : String(filters.deliveryState)}
                        >
                            <option value="">Estado de entrega</option>
                            <option value="true">Entregado</option>
                            <option value="false">No entregado</option>
                        </select>
                        <button id="btnLimpiarFiltros" className="cursor-pointer rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={()=>setFilters({
                            date: "",
                            client: "",
                            products: [] as string[],
                            priceMin: null,
                            priceMax: null,
                            facturaState: null,
                            deliveryState: null
                        })}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                        <SortableTable
                        data={filteredSales}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        columns={[
                            {key: "createdAt", label: "Fecha", center: true },
                            {key: "clientName", label: "Cliente", center: true },
                            {key: "seller", label: "Vendedor", center: true },
                            {key: "products", label: "Productos vendidos", center: true, sortable: false },
                            {key: "totalPrice", label: "Precio total", center: true },
                            {key: "factura", label: "Facturación", center: true, sortable: false },
                            {key: "deliveryState", label: "Estado de entrega", center: true, sortable: false }
                        ]}
                        renderRow={(sale) => (
                            <>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{sale.createdAt}</td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{sale.clientName}</td>
                                <td className="px-4 py-3 text-center text-gray-700 dark:text-gray-200">{sale.seller}</td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1 text-gray-800 dark:text-gray-100">
                                        {sale.products.map((saleProd)=>{return(
                                            <div key={saleProd.productId}>
                                                <div className="grid grid-cols-3 text-center">
                                                    <span>{saleProd.productName}</span>
                                                    <span>x{saleProd.quantity}</span>
                                                    <span>${saleProd.unitPrice}</span>
                                                </div>
                                                <hr className="opacity-20"></hr>
                                            </div>
                                            )})
                                        }
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-center font-semibold text-gray-900 dark:text-gray-50">${sale.totalPrice}</td>
                                <td className="px-4 py-3 text-center">
                                    <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                            onClick={()=>openFacturarModal(sale.clientId, sale.products, sale.id, sale.facturas)}
                                            >
                                            <i className="fa-solid fa-file-circle-plus"></i>
                                    </button>
                                    <button className={`${!sale.facturado ? "opacity-30 cursor-default" : "cursor-pointer"} rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                                            onClick={()=> setFacturaListId(sale.id)}
                                            disabled={!sale.facturado}
                                            >
                                            <i className="fa-solid fa-eye"></i>
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {
                                        sale.delivered
                                        ?
                                        <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-emerald-100 dark:bg-emerald-900/40 px-3 py-1.5 text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                                onClick={()=>handleUpdateDeliveryState(sale.id)}>
                                                Entregado
                                        </button>
                                        :
                                        <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-amber-100 dark:bg-amber-900/40 px-3 py-1.5 text-sm hover:bg-amber-200 dark:hover:bg-amber-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                                onClick={()=>handleUpdateDeliveryState(sale.id)}>
                                                No entregado
                                        </button>
                                    }
                                </td>
                            </>
                        )}
                        />
                    </div>
                </section>
                {
                    modalData && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-99999">
                            <CreateSale 
                            closeModal={closeModal}
                            defaultClient={modalData.clientId}
                            defaultProducts={modalData.products}
                            saleId={modalData.saleId}
                            isFacturar={modalData.isFacturar}
                            facturas={modalData.facturas}
                            />
                        </div>
                )}

                {
                    facturaListId && (
                        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-99999">
                            <FacturaListModal
                            saleId={facturaListId}
                            closeFacturaListModal={closeFacturaListModal}
                            />
                        </div>
                    )
                }
            </div>
        </div>
    )
}