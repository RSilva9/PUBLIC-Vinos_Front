import { useEffect, useState } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import { getTipoCbteDesc } from "../utils/helpers";
import { dateToFormat } from "../utils/formatters";

type Factura = {
    id: number;
    date: Date;
    saleId: number;
    pdfUrl: string | null;
    type: number;
    number: number;
    ptoVta: number;
}

type FacturaListModalProps = {
    saleId: number;
    closeFacturaListModal: () => void;
}

export default function FacturaListModal({saleId, closeFacturaListModal}: FacturaListModalProps){
    const [facturas, setFacturas] = useState<Factura[]>([])

    const fetchFacturas = async()=>{
        const requestedFacturas = await wretch(`${apiUrl}/afip/lista-de-facturas/${saleId}`)
            .options({credentials: 'include'})
            .get()
            .json<Factura[]>()
        setFacturas(requestedFacturas);
    }

    const getPdfUrl = async(facturaId: number)=>{
        const fetchedPdfUrl = await wretch(`${apiUrl}/afip/facturaPdfUrl/${facturaId}`)
            .options({credentials: 'include'})
            .get()
            .text();

        if (fetchedPdfUrl) {
            window.open(fetchedPdfUrl, "_blank");
        }
    }

    useEffect(()=>{
        fetchFacturas();
    }, [])

    return(
        <div className="relative p-10 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <button onClick={()=>closeFacturaListModal()} className="cursor-pointer absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Cerrar modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
            <div className="overflow-x-auto rounded-xl">
                <table className="text-sm rounded">
                    <thead className="bg-gray-900 dark:bg-gray-800 text-white">
                        <tr>
                            <th className="p-2 w-[200px] text-center">Fecha</th>
                            <th className="p-2 w-[200px] text-center">Tipo de comprobante</th>
                            <th className="p-2 w-[200px] text-center">Ver factura</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800 text-center">
                        {
                            facturas.map((factura: Factura, index: number)=> (
                                <tr className="odd:bg-white even:bg-gray-50 dark:odd:bg-gray-900 dark:even:bg-gray-800" key={index}>
                                    <td className="p-2 dark:text-white text-gray-800">{dateToFormat(factura.date)}</td>
                                    <td className="p-2 dark:text-white text-gray-800">{getTipoCbteDesc(factura.type)}</td>
                                    <td className="p-2 dark:text-white text-gray-800">
                                        <button className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                                onClick={()=>getPdfUrl(factura.id)}
                                                >
                                                <i className="fa-solid fa-eye"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}