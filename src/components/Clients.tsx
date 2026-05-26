import { useState, useEffect } from "react";
import { apiUrl } from "../config/config";
import wretch from "wretch"
import Swal from "sweetalert2";
import type { Client } from "../utils/interfaces";
import CreateClient from "./CreateClient";
import { SortableTable } from "./SortableTable";

export default function Clients(){
    const [clients, setClients] = useState<Client[]>([]);
    const [filteredClients, setFilteredClients] = useState<Client[]>([]);
    const [modal, setModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editClientName, setEditClientName] = useState("");
    const [editClientDocType, setEditDocType] = useState("");
    const [editClientDocument, setEditDocument] = useState("");
    const [editClientAddress, setEditAddress] = useState("");
    const [editClientEmail, setEditEmail] = useState("");
    const [editClientPhone, setEditPhone] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        id: "",
        name: "",
        docType: "",
        document: "",
        address: "",
        email: "",
        phone: ""
    });

    const fetchClients = async()=>{
        const response = await wretch(`${apiUrl}/clientes/lista-de-clientes`)
            .options({ credentials: "include" })
            .get()
            .json<any>();
        setClients(response);
        setFilteredClients(response);
    }

    const handleFilters = (field: keyof typeof filters, value: string)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    useEffect(()=>{
        setFilteredClients(
                clients.filter(client =>(
                    (filters.id !== "" ? client.id.toString().toLowerCase().includes(filters.id) : true) &&
                    (filters.name !== "" ? client.name.toLowerCase().includes(filters.name.toLowerCase()) : true) &&
                    (filters.docType !== "" ? client.docType.toLowerCase().includes(filters.docType.toLowerCase()) : true) &&
                    (filters.document !== "" ? client.document.toLowerCase().includes(filters.document.toLowerCase()) : true) &&
                    (filters.address !== "" ? client.address.toLowerCase().includes(filters.address.toLowerCase()) : true) &&
                    (filters.email !== "" ? client.email.toLowerCase().includes(filters.email.toLowerCase()) : true) &&
                    (filters.phone !== "" ? client.phone.toLowerCase().includes(filters.phone.toLowerCase()) : true)
                ))
            )
    }, [filters])

    const handleDeleteClient = async(clientId: number)=>{
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés eliminar este cliente?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await wretch(`${apiUrl}/clientes/eliminar-cliente`)
                    .options({ credentials: "include" })
                    .post({clientId})
                window.location.reload();
            }
        });
    }

    const startEdit = async(client: Client)=>{
        setEditingId(client.id);
        setEditClientName(client.name);
        setEditDocType(client.docType);
        setEditDocument(client.document);
        setEditAddress(client.address);
        setEditEmail(client.email);
        setEditPhone(client.phone);
    }

    const cancelEdit = () => {
        setEditingId(null);
    };

    const confirmEdit = async(clientId: number)=>{
        const updatedClient ={
            name: editClientName,
            docType: editClientDocType,
            document: editClientDocument,
            address: editClientAddress,
            email: editClientEmail,
            phone: editClientPhone
        };

        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés editar este cliente?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, editar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try{
                    await wretch(`${apiUrl}/clientes/editar-cliente`)
                        .options({ credentials: 'include' })
                        .put({ 
                            data: updatedClient,
                            clientId 
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
        fetchClients();
    }, [])

    return(
        <div className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased min-h-screen">
            <div className="mx-auto max-w-7xl p-5 space-y-6">
                <header className="flex items-center justify-between gap-3">
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">👥 Clientes</h1>
                    <div className="flex items-center gap-2">
                        <button
                        onClick={()=>setModal(true)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                        </svg>
                        Agregar cliente
                        </button>
                    </div>
                </header>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filtros de búsqueda</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                        <input type="text" placeholder="Nombre" onChange={(e)=>handleFilters('name', e.target.value)} value={filters.name}
                            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="Tipo de Documento" onChange={(e)=>handleFilters('docType', e.target.value)} value={filters.docType}
                            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="Documento" onChange={(e)=>handleFilters('document', e.target.value)} value={filters.document}
                            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="text" placeholder="Domicilio" onChange={(e)=>handleFilters('address', e.target.value)} value={filters.address}
                            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="email" placeholder="Email" onChange={(e)=>handleFilters('email', e.target.value)} value={filters.email}
                            className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <input type="tel" placeholder="Teléfono" onChange={(e)=>handleFilters('phone', e.target.value)} value={filters.phone}
                                className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" />
                        <button id="btnLimpiarFiltros" className="rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900 cursor-pointer"
                        onClick={()=>setFilters({id: "", name: "", docType: "", document: "", address: "", email: "", phone: ""})}
                        >
                            Limpiar filtros
                        </button>
                    </div>
                </section>
                <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="overflow-x-auto rounded-xl">
                        <SortableTable 
                        data={filteredClients} 
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
                            {key: "actions", label: "Opciones", center: true, sortable: false }
                        ]}
                        renderRow={client => (
                            <>
                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.name
                                    ) : (
                                    <input
                                        type="text"
                                        value={editClientName}
                                        onChange={(e) => setEditClientName(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.docType
                                    ) : (
                                    <input
                                        type="text"
                                        value={editClientDocType}
                                        onChange={(e) => setEditDocType(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.document
                                    ) : (
                                    <input
                                        type="text"
                                        value={editClientDocument}
                                        onChange={(e) => setEditDocument(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.address
                                    ) : (
                                    <input
                                        type="text"
                                        value={editClientAddress}
                                        onChange={(e) => setEditAddress(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.email
                                    ) : (
                                    <input
                                        type="email"
                                        value={editClientEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3 text-center">
                                    {!editingId || editingId !== client.id ? (
                                    client.phone
                                    ) : (
                                    <input
                                        type="tel"
                                        value={editClientPhone}
                                        onChange={(e) => setEditPhone(e.target.value)}
                                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-3 py-1.5 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                                    />
                                    )}
                                </td>

                                <td className="px-4 py-3">
                                    <div className="flex justify-center gap-2">
                                    {!editingId || editingId !== client.id ? (
                                        <>
                                        <button
                                            onClick={() => handleDeleteClient(client.id)}
                                            className="cursor-pointer rounded-md border border-transparent bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                            onClick={() => startEdit(client)}
                                            className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            Editar
                                        </button>
                                        </>
                                    ) : (
                                        <>
                                        <button
                                            onClick={() => confirmEdit(client.id)}
                                            className="cursor-pointer rounded-md border border-transparent bg-green-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/40"
                                        >
                                            Guardar
                                        </button>
                                        <button
                                            onClick={() => cancelEdit()}
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
            </div>
            <div className={`${modal ? "flex" : "hidden"} fixed inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center z-99999`}>
                <CreateClient closeModal={()=>setModal(false)} />
            </div>
        </div>
    )
}