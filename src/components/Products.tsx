import { useEffect, useState } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import Swal from "sweetalert2";
import { CloudinaryUpload } from "./ImageUploader";
import type { Product } from "../utils/interfaces";
import CreateProduct from "./CreateProduct";
import { SortableTable } from "./SortableTable";

type EditableProduct = {
    code: string;
    name: string;
    cepa: string;
    type: string;
    country: string;
    imageRef: string;
    cost: number;
    price: number;
};

export default function Products(){
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [modal, setModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editData, setEditData] = useState<EditableProduct>({
        code: "",
        name: "",
        cepa: "",
        type: "",
        country: "",
        imageRef: "",
        price: 0,
        cost: 0
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        code: "",
        name: "",
        cepa: "",
        type: "",
        country: "",
        priceMin: null as number | null,
        priceMax: null as number | null
    });
    const [viewImages, setViewImages] = useState<boolean>(false);

    const fetchProducts = async()=>{
        const response = await wretch(`${apiUrl}/productos/lista-de-productos`)
            .options({ credentials: 'include' })
            .get()
            .json<Product[]>();
        setProducts(response);
        setFilteredProducts(response);
    }

    const handleFilters = (field: keyof typeof filters, value: string)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    const handleDeleteProduct = async(productId: number)=>{
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Estás seguro de que querés eliminar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await wretch(`${apiUrl}/productos/eliminar-producto`)
                    .options({ credentials: 'include' })
                    .post({ productId });
                
                setProducts(prev => prev.filter(p => p.id !== productId));

                Swal.fire('Eliminado', 'El producto ha sido eliminado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo eliminar el producto', 'error');
            }
        }
    }

    const startEdit = (product: Product) => {
        setEditingId(product.id);
        setEditData({
            code: product.code,
            name: product.name,
            cepa: product.cepa,
            type: product.type,
            country: product.country,
            imageRef: product.imageRef,
            price: product.price,
            cost: product.cost
        });
    };

    const updateEditField = <K extends keyof EditableProduct>(field: K, value: EditableProduct[K]) => {
        setEditData(prev => ({ ...prev, [field]: value }));
    };

    const cancelEdit =  async()=>{
        setEditingId(null);
    }

    const confirmEdit = async(productId: number)=>{
        const result = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¿Estás seguro de que querés editar este producto?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar'
        });

        if (result.isConfirmed) {
            try {
                await wretch(`${apiUrl}/productos/editar-producto`)
                    .options({ credentials: 'include' })
                    .put({ 
                        data: editData,
                        productId 
                    })
                    .res();

                setProducts(prev => 
                    prev.map(p => p.id === productId ? { ...p, ...editData } : p)
                );

                setFilteredProducts(prev => 
                    prev.map(p => p.id === productId ? { ...p, ...editData } : p)
                );
                
                cancelEdit();
                Swal.fire('Editado', 'El producto ha sido actualizado.', 'success');
            } catch (error) {
                Swal.fire('Error', 'No se pudo editar el producto', 'error');
            }
        }
    }

    const clearFilters = () => {
        setFilters({
            code: "",
            name: "",
            cepa: "",
            type: "",
            country: "",
            priceMin: null,
            priceMax: null
        });
    };

    const isEditing = (productId: number) => editingId === productId;

    useEffect(()=>{
        fetchProducts();
    }, [])

    useEffect(()=>{
        setFilteredProducts(
            products.filter(product =>(
                (filters.code !== "" ? product.code.toString().toLowerCase().includes(filters.code.toLowerCase()) : true) &&
                (filters.name !== "" ? product.name.toString().toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                (filters.cepa !== "" ? product.cepa.toString().toLowerCase().includes(filters.cepa.toLowerCase()) : true) &&
                (filters.type !== "" ? product.type.toString().toLowerCase().includes(filters.type.toLowerCase()) : true) &&
                (filters.country !== "" ? product.country.toString().toLowerCase().includes(filters.country.toLowerCase()) : true) &&
                (filters.priceMin !== null ? product.price > filters.priceMin : true) &&
                (filters.priceMax !== null ? product.price < filters.priceMax : true)
            ))
        );
    }, [filters]);
    
    return(
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased min-h-screen">
            <div className="mx-auto max-w-7xl p-5 space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">📦 Productos</h1>
                    <div className="flex items-center gap-4">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="cursor-pointer appearance-none h-5 w-5 border border-gray-300 dark:border-gray-700 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                checked={viewImages}
                                onChange={(e) => setViewImages(e.target.checked)}
                            />
                                <span className="text-sm dark:text-gray-100">Ver imágenes</span>
                        </label>
                        <button
                        onClick={()=>setModal(true)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Agregar producto
                        </button>
                    </div>
                </header>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filtros de búsqueda</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                        <input type="text" placeholder="Código" onChange={(e)=>handleFilters('code', e.target.value)} value={filters.code}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="Nombre" onChange={(e)=>handleFilters('name', e.target.value)} value={filters.name}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="fullxt" placeholder="Cepa" onChange={(e)=>handleFilters('cepa', e.target.value)} value={filters.cepa}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="Tipo" onChange={(e)=>handleFilters('type', e.target.value)} value={filters.type}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="País" onChange={(e)=>handleFilters('country', e.target.value)} value={filters.country}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="number" min={0} placeholder="Precio desde" 
                        onChange={(e)=>{
                            handleFilters("priceMin", e.target.value)
                            setFilters(prev => ({
                                ...prev,
                                priceMin: e.target.value === "" ? null : Number(e.target.value)
                            }));
                        }} 
                        value={filters.priceMin!}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="number" min={0} placeholder="Precio hasta" 
                        onChange={(e)=>{
                            handleFilters("priceMax", e.target.value)
                            setFilters(prev => ({
                                ...prev,
                                priceMax: e.target.value === "" ? null : Number(e.target.value)
                            }));
                        }}  
                        value={filters.priceMax!}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <button id="btnLimpiarFiltros" className="cursor-pointer rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={clearFilters}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                        <SortableTable
                            data={filteredProducts}
                            itemsPerPage={itemsPerPage}
                            currentPage={currentPage}
                            onPageChange={setCurrentPage}
                            columns={[
                                ...(viewImages ? [{ key: "imageRef", label: "Imagen", center: true, sortable: false }] : []),
                                { key: "code", label: "Código", center: true },
                                { key: "name", label: "Nombre", center: true },
                                { key: "cepa", label: "Cepa", center: true },
                                { key: "type", label: "Tipo", center: true },
                                { key: "country", label: "País", center: true },
                                { key: "cost", label: "Precio costo", center: true },
                                { key: "price", label: "Precio de venta", center: true },
                                { key: "actions", label: "Opciones", center: true, sortable: false }
                            ]}
                            renderRow={(product) => (
                                <>
                                    {
                                        viewImages &&
                                        <td className="px-4 py-3 flex justify-center">
                                            {!isEditing(product.id) ? (
                                                <img src={product.imageRef} alt={product.name} className="w-25 place-self-center"/>
                                            ) : (
                                                <CloudinaryUpload onUpload={(url) => updateEditField('imageRef', url)} />
                                            )}
                                        </td>
                                    }

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            product.code
                                        ) : (
                                            <input
                                                type="text"
                                                value={editData.code}
                                                onChange={(e) => updateEditField('code', e.target.value)}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            product.name
                                        ) : (
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) => updateEditField('name', e.target.value)}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            product.cepa
                                        ) : (
                                            <input
                                                type="text"
                                                value={editData.cepa}
                                                onChange={(e) => updateEditField('cepa', e.target.value)}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            product.type
                                        ) : (
                                            <input
                                                type="text"
                                                value={editData.type}
                                                onChange={(e) => updateEditField('type', e.target.value)}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            product.country
                                        ) : (
                                            <input
                                                type="text"
                                                value={editData.country}
                                                onChange={(e) => updateEditField('country', e.target.value)}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            `$${product.cost}`
                                        ) : (
                                            <input
                                                type="number"
                                                value={editData.cost}
                                                onChange={(e) => updateEditField('cost', Number(e.target.value))}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3 text-center">
                                        {!isEditing(product.id) ? (
                                            `$${product.price}`
                                        ) : (
                                            <input
                                                type="number"
                                                value={editData.price}
                                                onChange={(e) => updateEditField('price', Number(e.target.value))}
                                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                            />
                                        )}
                                    </td>

                                    <td className="px-4 py-3">
                                        <div className="flex justify-center gap-2">
                                            {!isEditing(product.id) ? (
                                                <>
                                                    <button
                                                        onClick={() => handleDeleteProduct(product.id)}
                                                        className="cursor-pointer rounded-md border border-transparent bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                                    >
                                                        Eliminar
                                                    </button>
                                                    <button
                                                        onClick={() => startEdit(product)}
                                                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        Editar
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => confirmEdit(product.id)}
                                                        className="cursor-pointer rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/40"
                                                    >
                                                        Guardar
                                                    </button>
                                                    <button
                                                        onClick={cancelEdit}
                                                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </>
                            )}
                        />
                    </div>
                </section>

                {modal && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-99999">
                        <CreateProduct closeModal={() => setModal(false)} />
                    </div>
                )}
            </div>
        </div>
    )
}