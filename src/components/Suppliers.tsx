import { useState, useEffect } from "react";
import { apiUrl } from "../config/config";
import wretch from "wretch"
import Swal from "sweetalert2";
import type { Supplier } from "../utils/interfaces";
import CreateSupplier from "./CreateSupplier";
import { SortableTable } from "./SortableTable";

export default function Suppliers(){
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
    const [modal, setModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editSupplierName, setEditSupplierName] = useState<string>("");
    const [editSupplierDocType, setEditDocType] = useState<string>("");
    const [editSupplierDocument, setEditDocument] = useState<string>("");
    const [editSupplierAddress, setEditAddress] = useState<string>("");
    const [editSupplierEmail, setEditEmail] = useState<string>("");
    const [editSupplierPhone, setEditPhone] = useState<string>("");
    const [editSupplierPayment, setEditPayment] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        id: "",
        name: "",
        docType: "",
        document: "",
        address: "",
        email: "",
        phone: "",
        payment: ""
    });

    const fetchSuppliers = async()=>{
        const response = await wretch(`${apiUrl}/proveedores/lista-de-proveedores`)
            .options({ credentials: "include" })
            .get()
            .json<any>();
        setSuppliers(response);
        setFilteredSuppliers(response);
    }

    const handleFilters = (field: keyof typeof filters, value: string)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    useEffect(()=>{
        setFilteredSuppliers(
                suppliers.filter(supplier =>(
                    (filters.id !== "" ? supplier.id.toString().toLowerCase().includes(filters.id) : true) &&
                    (filters.name !== "" ? supplier.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                    (filters.docType !== "" ? supplier.docType.toLowerCase().includes(filters.docType.toLowerCase()) : true) &&
                    (filters.document !== "" ? supplier.document.toLowerCase().includes(filters.document.toLowerCase()) : true) &&
                    (filters.address !== "" ? supplier.address.toLowerCase().includes(filters.address.toLowerCase()) : true) &&
                    (filters.email !== "" ? supplier.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
                    (filters.phone !== "" ? supplier.phone.toLowerCase().includes(filters.phone.toLowerCase()) : true) &&
                    (filters.payment !== "" ? supplier.paymentContact.toLowerCase().includes(filters.payment.toLowerCase()) : true)
                ))
            )
    }, [filters])

    const handleDeleteSupplier = async(supplierId: number)=>{
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés eliminar este proveedor?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await wretch(`${apiUrl}/proveedores/eliminar-proveedor`)
                    .options({ credentials: "include" })
                    .post({supplierId})
                window.location.reload();
            }
        });
    }

    const startEdit = async(supplier: Supplier)=>{
        setEditSupplierName(supplier.name);
        setEditDocType(supplier.docType);
        setEditDocument(supplier.document);
        setEditAddress(supplier.address);
        setEditEmail(supplier.email);
        setEditPhone(supplier.phone);
        setEditPayment(supplier.paymentContact);
        setEditingId(supplier.id);
    }

    const cancelEdit = () => {
        setEditingId(null);
    };

    const confirmEdit = async(supplierId: number)=>{
        const updatedSupplier ={
            name: editSupplierName,
            docType: editSupplierDocType,
            document: editSupplierDocument,
            address: editSupplierAddress,
            email: editSupplierEmail,
            phone: editSupplierPhone,
            paymentContact: editSupplierPayment
        };

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés editar este proveedor?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    await wretch(`${apiUrl}/proveedores/editar-proveedor`)
                        .options({ credentials: 'include' })
                        .put({ 
                            data: updatedSupplier,
                            supplierId 
                        })
                        .res()
                        .then(()=> window.location.reload())
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
        });
    }

    useEffect(()=>{
        fetchSuppliers();
    }, [])

    return(
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased min-h-screen">
            <div className="mx-auto max-w-7xl p-5 space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">🏭 Proveedores</h1>
                    <div className="flex items-center gap-2">
                        <button
                        onClick={()=>setModal(true)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                            </svg>
                            Agregar proveedor
                        </button>
                    </div>
                </header>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filtros de búsqueda</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <input id="fNombre" type="text" placeholder="Nombre" onChange={(e)=>handleFilters('name', e.target.value)} value={filters.name}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fTipoDoc" type="text" placeholder="Tipo de Documento" onChange={(e)=>handleFilters('docType', e.target.value)} value={filters.docType}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fDocumento" type="text" placeholder="Documento" onChange={(e)=>handleFilters('document', e.target.value)} value={filters.document}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fDomicilio" type="text" placeholder="Domicilio" onChange={(e)=>handleFilters('address', e.target.value)} value={filters.address}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fEmail" type="text" placeholder="Email" onChange={(e)=>handleFilters('email', e.target.value)} value={filters.email}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fTelefono" type="text" placeholder="Teléfono" onChange={(e)=>handleFilters('phone', e.target.value)} value={filters.phone}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <input id="fContactoPago" type="text" placeholder="Contacto de pago" onChange={(e)=>handleFilters('payment', e.target.value)} value={filters.payment}
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                        <div className="flex items-center gap-2">
                        <button id="btnLimpiarFiltros" className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 cursor-pointer"
                        onClick={()=>setFilters({id: "", name: "", docType: "", document: "", address: "", email: "", phone: "", payment: ""})}
                        >
                            Limpiar filtros
                        </button>
                        </div>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                    <SortableTable
                        data={filteredSuppliers}
                        itemsPerPage={itemsPerPage}
                        currentPage={currentPage}
                        onPageChange={setCurrentPage}
                        columns={[
                            {key: "name", label: "Nombre", center: true },
                            {key: "docType", label: "Tipo de Documento", center: true },
                            {key: "document", label: "Documento", center: true },
                            {key: "address", label: "Domicilio", center: true },
                            {key: "email", label: "Email", center: true },
                            {key: "phone", label: "Teléfono", center: true },
                            {key: "payment", label: "Contacto de pago", center: true },
                            {key: "actions", label: "Opciones", center: true, sortable: false }
                        ]}
                        renderRow={(supplier) => (
                            <>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.name
                                ) : (
                                    <input
                                    type="text"
                                    value={editSupplierName}
                                    onChange={(e) => setEditSupplierName(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.docType
                                ) : (
                                    <input
                                    type="text"
                                    value={editSupplierDocType}
                                    onChange={(e) => setEditDocType(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.document
                                ) : (
                                    <input
                                    type="text"
                                    value={editSupplierDocument}
                                    onChange={(e) => setEditDocument(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.address
                                ) : (
                                    <input
                                    type="text"
                                    value={editSupplierAddress}
                                    onChange={(e) => setEditAddress(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.email
                                ) : (
                                    <input
                                    type="email"
                                    value={editSupplierEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">
                                {!editingId || editingId !== supplier.id ? (
                                    supplier.phone
                                ) : (
                                    <input
                                    type="tel"
                                    value={editSupplierPhone}
                                    onChange={(e) => setEditPhone(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                {!editingId || editingId !== supplier.id ? (
                                    <span className="inline-flex items-center gap-1 rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 px-2.5 py-1 text-xs font-semibold">
                                    {supplier.paymentContact}
                                    </span>
                                ) : (
                                    <input
                                    type="text"
                                    value={editSupplierPayment}
                                    onChange={(e) => setEditPayment(e.target.value)}
                                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                                    />
                                )}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center justify-center gap-2">
                                        {!editingId || editingId !== supplier.id ? (
                                        <>
                                            <button
                                            onClick={() => startEdit(supplier)}
                                            className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
                                            >
                                            Editar
                                            </button>
                                            <button
                                            onClick={() => handleDeleteSupplier(supplier.id)}
                                            className="cursor-pointer rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                            >
                                            Eliminar
                                            </button>
                                        </>
                                        ) : (
                                        <>
                                            <button
                                            onClick={() => confirmEdit(supplier.id)}
                                            className="cursor-pointer rounded-md bg-green-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/40"
                                            >
                                            Guardar
                                            </button>
                                            <button
                                            onClick={() => cancelEdit()}
                                            className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700"
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
            </div>
            <div className={`${modal ? "flex" : "hidden"} fixed inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center z-50`}>
                <CreateSupplier closeModal={()=>setModal(false)} />
            </div>
        </div>
    )
}