import wretch from 'wretch';
import { apiUrl } from '../config/config';
import Swal from 'sweetalert2';
import type { CreateProps } from '../utils/interfaces';

export default function CreateSupplier({ closeModal }: CreateProps){
    const handleCreateSupplier = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await wretch(`${apiUrl}/proveedores/crear-proveedor`)
                .options({ credentials: 'include' })
                .post(
                    {
                        "name": data.supplierName,
                        "docType": data.supplierDocType,
                        "document": data.supplierDocument,
                        "address": data.supplierAddress,
                        "email": data.supplierEmail,
                        "phone": data.supplierPhone,
                        "paymentContact": data.supplierPayment
                    }
                )
                .json<any>()
                .then(()=> window.location.reload())
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

    return(
        <div className="relative w-full max-w-3xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
            <button onClick={closeModal} className="cursor-pointer absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Cerrar modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Agregar proveedor</h3>

            <form id="formProveedor" className="grid grid-cols-1 sm:grid-cols-2 gap-4" onSubmit={handleCreateSupplier}>
                <input name="supplierName" type="text" placeholder="Nombre" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierDocType" type="text" placeholder="Tipo de Documento" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierDocument" type="text" placeholder="Documento" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierAddress" type="text" placeholder="Domicilio" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierEmail" type="email" placeholder="Email" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierPhone" type="tel" placeholder="Teléfono" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                <input name="supplierPayment" type="text" placeholder="Contacto de pago" required
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />

                <div className="sm:col-span-2 flex justify-end gap-3 pt-2">
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
        </div>
    )
}