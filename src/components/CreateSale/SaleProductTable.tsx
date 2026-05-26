import type { SaleProductWithStock } from "../../utils/interfaces";

type ProductTableProps = {
    selectedProducts: SaleProductWithStock[],
    setSelectedProducts: (products: SaleProductWithStock[]) => void,
    disabled: boolean
};

export default function SaleProductTable({selectedProducts, setSelectedProducts, disabled}: ProductTableProps){
    
    const removeProduct = (index: number) => {
        setSelectedProducts(selectedProducts.filter((_, i) => i !== index));
    };

    const updateProduct = (index: number, field: keyof SaleProductWithStock, value: number) => {
        setSelectedProducts(
            selectedProducts.map((product, i) => 
                i === index ? { ...product, [field]: value } : product
            )
        );
    };
    
    const calculateRowTotal = (product: SaleProductWithStock) => {
        const subtotal = product.quantity * product.unitPrice;
        const discount = subtotal * (product.discount / 100);
        const afterDiscount = subtotal - discount;
        const iva = afterDiscount * 0.21;
        return (afterDiscount + iva).toFixed(2);
    };

    return(
        <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-sm">
                <thead className="bg-gray-900 dark:bg-gray-800 text-white">
                    <tr>
                        <th className="p-2">Código</th>
                        <th className="p-2">Producto</th>
                        <th className="p-2">Depósito</th>
                        <th className="p-2 text-center">Cantidad</th>
                        <th className="p-2 text-center">Precio</th>
                        <th className="p-2 text-center">Descuento (%)</th>
                        <th className="p-2 text-center">IVA</th>
                        <th className="p-2 text-center">Total</th>
                        {!disabled && <th className="p-2 text-center">Borrar</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-center">
                    {
                        selectedProducts.map((product: SaleProductWithStock, index: number)=> (
                            <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800" key={index}>
                                <td className="p-2 dark:text-white text-gray-800">{product.productCode}</td>
                                <td className="p-2 dark:text-white text-gray-800">{product.productName}</td>
                                <td className="p-2 dark:text-white text-gray-800">{product.productDepositName}</td>
                                <td className="p-2 dark:text-white text-gray-800">
                                    <input
                                        type="number"
                                        disabled={disabled}
                                        value={product.quantity}
                                        min={1}
                                        max={product.productStock}
                                        onChange={(e) => {
                                            const value = Math.min(
                                                Math.max(0, Number(e.target.value)), 
                                                product.productStock
                                            );
                                            updateProduct(index, 'quantity', value);
                                        }}
                                        className="w-20 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                </td>
                                <td className="p-2 dark:text-white text-gray-800">
                                    <input 
                                    type="number" 
                                    disabled={disabled}
                                    defaultValue={product.unitPrice}
                                    min={0}
                                    onChange={(e) => updateProduct(index, 'unitPrice', Number(e.target.value))} 
                                    className="w-24 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                                </td>
                                <td className="p-2 dark:text-white text-gray-800">
                                    <input 
                                    type="number" 
                                    disabled={disabled}
                                    defaultValue={product.discount}
                                    min={0}
                                    max={100}
                                    onChange={(e) => updateProduct(index, 'discount', Number(e.target.value))} 
                                    className="w-24 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                                </td>
                                <td className="p-2 dark:text-white text-gray-800">
                                    <input 
                                    type="number" 
                                    disabled 
                                    value="21" 
                                    className="w-20 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm text-gray-600 dark:text-gray-300" /></td>
                                <td className="p-2 dark:text-white text-gray-800 font-semibold">${calculateRowTotal(product)}</td>
                                {
                                    !disabled && 
                                    <td className="p-2">
                                        <button 
                                        className="cursor-pointer rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                        onClick={() => removeProduct(index)}
                                        >
                                            Borrar
                                        </button>
                                    </td>
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
}