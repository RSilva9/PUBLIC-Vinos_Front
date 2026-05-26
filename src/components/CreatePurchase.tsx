import { useEffect, useState } from "react";
import type { Deposit, ProductWithStock, PurchaseProduct, Supplier } from "../utils/interfaces";
import wretch from "wretch";
import { apiUrl } from "../config/config";
import { Oval } from "react-loader-spinner";
import SupplierSelector from "./CreatePurchase/SupplierSelector";
import PurchaseProductSelector from "./CreatePurchase/PurchaseProductSelector";
import PurchaseProductTable from "./CreatePurchase/PurchaseProductTable";
import Swal from "sweetalert2";

interface CreatePurchaseProps {
    closeModal: () => void;
}

export default function CreatePurchase({closeModal}: CreatePurchaseProps){
    const [products, setProducts] = useState<ProductWithStock[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [deposits, setDeposits] = useState<Deposit[]>([]);
    
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<PurchaseProduct[]>([]);
    const [delivered, setDelivered] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const totalPrice = selectedProducts.reduce((sum, product) => {
        const subtotal = product.quantity * product.cost;
        return sum + subtotal;
    }, 0);

    const fetchAllData = async()=>{
        const responseProducts = await wretch(`${apiUrl}/productos/productos-stock`)
            .options({ credentials: 'include' })
            .get()
            .json<ProductWithStock[]>();

        const uniqueProducts = responseProducts.filter(
            (product, index, self) =>
                index === self.findIndex((p) => p.id === product.id)
        );
        setProducts(uniqueProducts);

        const responseSuppliers = await wretch(`${apiUrl}/proveedores/lista-de-proveedores`)
            .options({ credentials: 'include' })
            .get()
            .json<Supplier[]>();
        setSuppliers(responseSuppliers);

        const responseDeposits = await wretch(`${apiUrl}/depositos/lista-de-depositos`)
            .options({ credentials: 'include' })
            .get()
            .json<Deposit[]>();
        setDeposits(responseDeposits);
    }

    const handleSubmit = async()=>{
        if (!selectedSupplier || selectedProducts.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un proveedor y al menos un producto'
            });
            return;
        }

        setIsLoading(true);

        const newPurchase = {
            "supplierId": selectedSupplier.id,
            "products": selectedProducts,
            "received": delivered,
            "totalPrice": totalPrice
        }

        await wretch(`${apiUrl}/compras/cargar-compra`)
            .options({ credentials: 'include' })
            .post(newPurchase)
            .res(()=>{
                setIsLoading(false);
                window.location.assign("/compras");
            });
    }

    useEffect(()=>{
        fetchAllData()
    }, []);

    return(
        <div className="relative w-full max-w-5xl h-[90vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <button onClick={()=>closeModal()} className="cursor-pointer absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Cerrar modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
            <div>
                <div className="flex">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Cargar compra</h2>
                    <div className="self-center ms-5">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="cursor-pointer appearance-none h-5 w-5 border border-gray-300 dark:border-gray-700 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                onChange={(e) => setDelivered(e.target.checked)}
                            />
                                <span className="text-sm dark:text-gray-100">Recibido</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <SupplierSelector 
                        suppliers={suppliers} 
                        selectedSupplier={selectedSupplier}
                        onSupplierChange={setSelectedSupplier}
                    />
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Productos</h3>
                <PurchaseProductSelector 
                    products={products}
                    deposits={deposits}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                />
                <PurchaseProductTable
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                />
                <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <span className="text-xl font-semibold text-gray-900 dark:text-gray-50">Total: ${totalPrice.toFixed(2)}</span>
                    <Oval
                        visible={isLoading}
                        height="30"
                        width="30"
                        color="#4fa94d"
                        ariaLabel="oval-loading"
                        wrapperStyle={{"margin": "0px 10px"}}
                        wrapperClass=""
                    />
                    
                    <button 
                        onClick={() => handleSubmit()} 
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                        </svg>
                        Crear compra
                    </button>
                </div>
            </div>
        </div>
    )
}