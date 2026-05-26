import wretch from 'wretch';
import { apiUrl } from '../config/config';
import { useState, useEffect } from 'react';
import type { Deposit, ProductWithStock } from '../utils/interfaces';
import { SortableTable } from './SortableTable';
import ChangeStock from './ChangeStock';

export default function Stock(){
    const [products, setProducts] = useState<ProductWithStock[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<ProductWithStock[]>([]);
    const [modal, setModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        code: "",
        name: "",
        deposit: ""
    });
    const [viewImages, setViewImages] = useState<boolean>(false);

    const handleFilters = (field: keyof typeof filters, value: string)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    useEffect(()=>{
        setFilteredProducts(
            products.filter(product =>(
                (filters.code !== "" ? product.code.toString().toLowerCase().includes(filters.code.toLowerCase()) : true) &&
                (filters.name !== "" ? product.name.toString().toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                (filters.deposit !== "" ? product.depositName.toLowerCase().includes(filters.deposit.toLowerCase()) : true)
            ))
        );
    }, [filters, products]);


    const fetchAllData = async()=>{
        const responseProducts = await wretch(`${apiUrl}/productos/productos-stock`)
            .options({ credentials: 'include' })
            .get()
            .json<ProductWithStock[]>();
        setProducts(responseProducts);
        setFilteredProducts(responseProducts);

        const responseDeposits = await wretch(`${apiUrl}/depositos/lista-de-depositos`)
            .options({ credentials: 'include' })
            .get()
            .json<Deposit[]>();
        setDeposits(responseDeposits);

        handleFilters("deposit", responseDeposits[0].name);
    }

    useEffect(()=>{
        fetchAllData();
    }, []);

    return(
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased">
            <div className="max-w-6xl mx-auto p-5">
                <header className="mb-5 flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">
                    📦 Stock
                    </h1>

                    <div className="flex items-center gap-2">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="cursor-pointer appearance-none h-5 w-5 border border-gray-300 dark:border-gray-700 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                checked={viewImages}
                                onChange={(e) => setViewImages(e.target.checked)}
                            />
                                <span className="text-sm dark:text-gray-100">Ver imágenes</span>
                        </label>
                        <div className="hidden sm:flex items-center gap-2">
                            <select id="deposit" onChange={(e)=>handleFilters("deposit", e.target.value)} value={filters.deposit}
                            className={`w-full text-black dark:text-white rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40`}
                            >
                                {/* <option value="All">Todos</option> */}
                                {deposits.map(d => (
                                    <option value={d.name}>{d.name}</option>
                                ))}
                            </select>
                            <input
                                type="search"
                                placeholder="Buscar por código"
                                className="w-64 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                onChange={(e)=>handleFilters("code", e.target.value)}
                            />
                            <input
                                type="search"
                                placeholder="Buscar por nombre"
                                className="w-64 rounded-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                onChange={(e)=>handleFilters("name", e.target.value)}
                            />
                            <button
                                onClick={()=>setModal(true)}
                                className="cursor-pointer inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40"
                                title="Actualizar"
                            >
                                <i className="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                </header>
                <div className="sm:hidden mt-4 mb-5 flex items-center gap-2">
                    <input
                        type="search"
                        placeholder="Buscar por código"
                        className="flex-1 rounded-full w-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                        onChange={(e)=>handleFilters("code", e.target.value)}
                    />
                    <input
                        type="search"
                        placeholder="Buscar por nombre"
                        className="flex-1 rounded-full w-full border border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                        onChange={(e)=>handleFilters("name", e.target.value)}
                    />
                    <button
                        onClick={()=>setModal(true)}
                        className="cursor-pointer inline-flex items-center justify-center rounded-md border border-transparent bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40"
                        title="Actualizar"
                    >
                        <i className="fas fa-plus"></i>
                    </button>
                </div>
                <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                        <SortableTable
                        data={filteredProducts}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        columns={[
                            ...(viewImages ? [{ key: "imageRef", label: "Imagen", center: true, sortable: false }] : []),
                            {key: "code", label: "Código", center: true },
                            {key: "name", label: "Nombre", center: true },
                            {key: "stock", label: "Stock", center: true }
                        ]}
                        renderRow={(product)=> (
                            <>
                                {
                                    viewImages &&
                                    <td className="px-4 py-3 flex justify-center">
                                        <img className="h-20 w-20 object-cover rounded-md border border-gray-200 dark:border-gray-700 shadow-sm text-center" src={product.imageRef}/>
                                    </td>
                                }
                                <td className="px-4 py-3 font-mono text-gray-800 dark:text-gray-100 text-center">{product.code}</td>
                                <td className="px-4 py-3 text-gray-800 dark:text-gray-100 text-center">{product.name} </td>
                                <td className="px-4 py-3 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <p>{product.stock}</p>
                                    </div>
                                </td>
                            </>
                        )}/>
                    </div>
                </div>
            </div>
            <div className={`${modal ? "flex" : "hidden"} fixed inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center z-99999`}>
                <ChangeStock closeModal={()=>setModal(false)} />
            </div>
        </div>
    )
}