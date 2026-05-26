import { type DataFactura, tiposCbte, condicionesIvaB } from "../../utils/interfaces";

type FacturaSelectorProps = {
    dataFactura: DataFactura,
    setDataFactura: (factura: DataFactura) => void,
    hasFacturas?: boolean
};

export default function FacturaSelector({dataFactura, setDataFactura, hasFacturas}: FacturaSelectorProps){
    return(
        <>
            <div>
                <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">Tipo de comprobante</label>
                <select 
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                onChange={(e) => {
                    if (e.target.value) {
                        setDataFactura({
                            ...dataFactura,
                            tipoCbte: Number(e.target.value)
                        });
                    }
                }}
                >
                    <option value="">Seleccione un tipo de comprobante</option>
                    {
                        !hasFacturas &&
                        <option key={6} value={6}>
                            Factura B
                        </option>
                    }
                    {
                        hasFacturas &&
                        <option key={8} value={8}>
                            Nota de crédito B
                        </option>
                    }
                </select>
            </div>

            <div>
                <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">Condición frente al IVA</label>
                <select 
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                onChange={(e) => {
                    if (e.target.value) {
                        setDataFactura({
                            ...dataFactura,
                            cliente: {
                                ...dataFactura.cliente,
                                condIva: Number(e.target.value)
                            }
                        })
                    }
                }}
                >
                    <option value="">Seleccione una condicion frente al IVA</option>
                    {condicionesIvaB.map((cond) => (
                        <option key={cond.id} value={cond.id}>
                            {cond.desc}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-medium mb-1 block text-gray-800 dark:text-white">Punto de Venta</label>
                <input 
                type="number" 
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" 
                onChange={(e)=>{
                    setDataFactura({
                        ...dataFactura,
                        ptoVta: Number(e.target.value)
                    });
                }}
                />
            </div>
        </>
    )
}