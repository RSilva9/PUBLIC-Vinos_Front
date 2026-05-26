import { useEffect, useState } from "react";
import wretch from "wretch";
import { apiUrl } from "../config/config";
import Swal from "sweetalert2";
import { Oval } from "react-loader-spinner";
import type { DataFactura, Deposit, ProductWithStock, SaleProductWithStock } from "../utils/interfaces";
import type { Client } from "../utils/interfaces";
import ClientSelector from "./CreateSale/ClientSelector";
import FacturaSelector from "./CreateSale/FacturaSelector";
import SaleProductSelector from "./CreateSale/SaleProductSelector";
import SaleProductTable from "./CreateSale/SaleProductTable";
import {getTipoDocumentoId } from "../utils/helpers";

type CreateSaleProps = {
    closeModal: () => void;
    defaultClient?: number;
    defaultProducts?: SaleProductWithStock[];
    saleId?: number;
    isFacturar?: boolean;
    facturas?: Array<{ id: number; pdfUrl: string }>;
};

export default function CreateSale({closeModal, defaultClient, defaultProducts, saleId, isFacturar, facturas}: CreateSaleProps){
    const [products, setProducts] = useState<ProductWithStock[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [deposits, setDeposits] = useState<Deposit[]>([]);

    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [selectedSeller, setSelectedSeller] = useState<string | null>(null);
    const [selectedProducts, setSelectedProducts] = useState<SaleProductWithStock[]>([]);

    const [dataFactura, setDataFactura] = useState<DataFactura | null>(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [crearYFacturar, setCrearYFacturar] = useState(isFacturar);

    const totalPrice = selectedProducts.reduce((sum, product) => {
        const subtotal = product.quantity * product.unitPrice;
        const discount = subtotal * (product.discount / 100);
        const afterDiscount = subtotal - discount;
        const iva = afterDiscount * 0.21;
        return sum + afterDiscount + iva;
    }, 0);

    const isFormValid = selectedClient !== null && selectedProducts.length > 0;
    const isFacturaFormValid = 
        dataFactura?.tipoCbte != null &&
        dataFactura?.cliente?.condIva != null &&
        dataFactura?.ptoVta != null &&
        isFormValid;

    const fetchAllData = async()=>{
        const responseProducts = await wretch(`${apiUrl}/productos/productos-stock`)
            .options({ credentials: 'include' })
            .get()
            .json<ProductWithStock[]>();
        setProducts(responseProducts);

        const responseClients = await wretch(`${apiUrl}/clientes/lista-de-clientes`)
            .options({ credentials: 'include' })
            .get()
            .json<Client[]>();
        setClients(responseClients);

        const responseDeposits = await wretch(`${apiUrl}/depositos/lista-de-depositos`)
            .options({ credentials: 'include' })
            .get()
            .json<Deposit[]>();
        setDeposits(responseDeposits);
    }

    const handleSubmit = async (shouldFacturar: boolean = false) => {
        if (!selectedClient || selectedProducts.length === 0) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Debes seleccionar un cliente y al menos un producto'
            });
            return;
        }

        if (shouldFacturar && !dataFactura) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Completa todos los datos de facturación'
            });
            return;
        }

        if (shouldFacturar) {
            const result = await Swal.fire({
                title: '¿Estás seguro?',
                text: saleId ? "¿Confirmar facturación?" : "¿Confirmar venta y facturación?",
                icon: 'warning',
                customClass: { container: "z-999999999" },
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Sí, confirmar',
                cancelButtonText: 'Cancelar'
            });

            if (!result.isConfirmed) return;
        }

        setIsLoading(true);
        try {
            let currentSaleId = saleId;

            if (!saleId) {
                const newSale = {
                    clientId: selectedClient.id,
                    products: selectedProducts.map(prod => ({
                        productId: prod.productId,
                        quantity: prod.quantity,
                        depositId: prod.productDepositId,
                        discount: prod.discount ?? 0,
                        unitPrice: prod.unitPrice
                    })),
                    facturado: shouldFacturar,
                    delivered: false,
                    facturaDate: "",
                    totalPrice,
                    seller: selectedSeller
                };

                const { sale } = await wretch(`${apiUrl}/ventas/cargar-venta`)
                    .options({ credentials: 'include' })
                    .post(newSale)
                    .json<{ sale: { id: number } }>();

                currentSaleId = sale.id;
            }

            if (shouldFacturar && dataFactura && currentSaleId) {
                const facturaProducts = selectedProducts.map(item => {
                    const impBonif = item.unitPrice * ((item.discount ?? 0) / 100);
                    const priceAfterDiscount = item.unitPrice - impBonif;
                    const subtotal = priceAfterDiscount * item.quantity;

                    return {
                        codigo: item.productCode,
                        descripcion: item.productName,
                        cantidad: item.quantity,
                        precioUnit: item.unitPrice,
                        bonif: item.discount ?? 0,
                        impBonif,
                        subtotal
                    };
                });

                const IVA_RATE = 0.21;
                const importeNetoGravado = parseFloat((totalPrice / (1 + IVA_RATE)).toFixed(2));
                const importeIVA = parseFloat((totalPrice - importeNetoGravado).toFixed(2));

                const facturaCompleta: DataFactura = {
                    ...dataFactura,
                    condVenta: "Contado",
                    vendedor: selectedSeller!,
                    importeExentoIVA: 0,
                    importeNetoGravado,
                    importeIVA,
                    importeTotal: totalPrice,
                    importeNetoNoGravado: 0,
                    importeTotalTributos: 0,
                    mediosDePago: ['Efectivo'],
                    Iva: [{
                        Id: 5,
                        BaseImp: importeNetoGravado,
                        Importe: importeIVA
                    }],
                    productosFactura: facturaProducts,
                    cliente: {
                        tipoDocumento: getTipoDocumentoId(selectedClient.docType),
                        documento: Number(selectedClient.document),
                        razonSocial: selectedClient.name,
                        email: selectedClient.email,
                        domicilio: selectedClient.address,
                        condIva: dataFactura.cliente.condIva,
                    }
                };

                await wretch(`${apiUrl}/afip/emitir-factura`)
                    .options({ credentials: 'include' })
                    .post({ factura: facturaCompleta, cliente: facturaCompleta.cliente, saleId: currentSaleId })
                    .res();
            }

            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: shouldFacturar ? 'Factura generada correctamente' : 'Venta creada correctamente'
            });
            
            closeModal();
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: shouldFacturar ? 'No se pudo generar la factura' : 'No se pudo crear la venta'
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (defaultClient && clients.length > 0) {
            const client = clients.find(c => c.id === defaultClient);
            setSelectedClient(client || null);
        }
    }, [defaultClient, clients]);

    useEffect(() => {
        if (defaultProducts && defaultProducts.length > 0) {
            const validProducts = defaultProducts.map(p => ({
                ...p,
                discount: p.discount ?? 0,
            }));
            setSelectedProducts(validProducts);
        }
    }, [defaultProducts]);

    useEffect(()=> {
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
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Cargar venta</h2>
                    <div className="self-center ms-5">
                        <label className="inline-flex items-center space-x-2">
                            <input
                                type="checkbox"
                                className="cursor-pointer appearance-none h-5 w-5 border border-gray-300 dark:border-gray-700 rounded bg-white/80 dark:bg-gray-800/80 shadow-sm checked:bg-indigo-500 checked:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                                checked={isFacturar}
                                disabled={!selectedClient || isFacturar}
                                onChange={(event) => setCrearYFacturar(event.target.checked)}
                            />
                                <span className="text-sm dark:text-gray-100">Facturar</span>
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <ClientSelector 
                        clients={clients} 
                        selectedClient={selectedClient} 
                        onClientChange={setSelectedClient}
                        selectedSeller={selectedSeller}
                        onSellerChange={setSelectedSeller}
                        disabled={isFacturar!}
                    />
                    {
                        crearYFacturar &&
                        <FacturaSelector 
                            dataFactura={dataFactura!} 
                            setDataFactura={setDataFactura}
                            hasFacturas={facturas && facturas.length > 0}
                        />
                    }
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Productos</h3>
                {
                    dataFactura?.tipoCbte === 8 ?
                    <>
                        <SaleProductSelector 
                            products={products} 
                            selectedProducts={selectedProducts} 
                            setSelectedProducts={setSelectedProducts} 
                            deposits={deposits} 
                            disabled={true}
                        />
                        <SaleProductTable 
                            selectedProducts={selectedProducts} 
                            setSelectedProducts={setSelectedProducts} 
                            disabled={false}
                        />
                    </>
                    :
                    <>
                        <SaleProductSelector 
                            products={products} 
                            selectedProducts={selectedProducts} 
                            setSelectedProducts={setSelectedProducts} 
                            deposits={deposits} 
                            disabled={isFacturar!}
                        />
                        <SaleProductTable 
                            selectedProducts={selectedProducts} 
                            setSelectedProducts={setSelectedProducts} 
                            disabled={isFacturar!}
                        />
                    </>
                }
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
                    
                    {!crearYFacturar && (
                        <button 
                            onClick={() => handleSubmit(false)} 
                            disabled={!isFormValid || isLoading}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                            </svg>
                            Crear pedido
                        </button>
                    )}

                    {crearYFacturar && !saleId && (
                        <button 
                            onClick={() => handleSubmit(true)} 
                            disabled={!isFormValid || isLoading}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                            </svg>
                            Crear pedido y facturar
                        </button>
                    )}

                    {/* Botón para facturar venta existente */}
                    {isFacturar && saleId && (
                        <button 
                            onClick={() => handleSubmit(true)} 
                            disabled={!isFacturaFormValid || isLoading}
                            className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-emerald-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m5 13 4 4L19 7"/>
                            </svg>
                            Facturar
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}