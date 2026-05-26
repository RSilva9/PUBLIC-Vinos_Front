import type { CreateProps } from "../utils/interfaces";
import { apiUrl } from "../config/config";
import wretch from 'wretch';
import Swal from "sweetalert2";
import { CloudinaryUpload } from "./ImageUploader";
import { useState } from "react";

export default function CreateProduct({ closeModal }: CreateProps){
    const [uploadProductImage, setUploadProductImage] = useState<string>("")
    const handleCreateProduct = async(e: React.FormEvent<HTMLFormElement>)=>{
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try{
            await wretch(`${apiUrl}/productos/crear-producto`)
                .options({ credentials: 'include' })
                .post(
                    {
                        "code": data.productCode,
                        "name": data.productName,
                        "cepa": data.productCepa,
                        "type": data.productType,
                        "country": data.productCountry,
                        "price": Number(data.productPrice),
                        "imageRef": uploadProductImage
                    }
                )
                .res(()=> window.location.reload())
        }catch (err){
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
        <div className="relative w-full max-w-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-6">Agregar producto nuevo</h3>
            <form className="flex flex-col gap-4" onSubmit={handleCreateProduct}>
                <input type="text" name="productCode" placeholder="Código"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <input type="text" name="productName" placeholder="Nombre"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <input type="text" name="productCepa" placeholder="Cepa"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <input type="text" name="productType" placeholder="Tipo"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <input type="text" name="productCountry" placeholder="País"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <input type="number" name="productPrice" placeholder="Precio de venta"
                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                <CloudinaryUpload onUpload={setUploadProductImage} />

                <div className="flex justify-end gap-3 pt-4">
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
            <button className="cursor-pointer absolute top-3 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" aria-label="Cerrar modal" onClick={closeModal}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>
    )
}