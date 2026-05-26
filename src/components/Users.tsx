import { useEffect, useState, useContext } from 'react';
import wretch from 'wretch';
import userContext from './_siteContext';
import { apiUrl } from "../config/config";
import type { User } from '../utils/interfaces';
import CreateUser from './CreateUser';
import Swal from 'sweetalert2';
import { SortableTable } from './SortableTable';
import CustomDateInput from './CustomDateInput';

export default function Users(){
    const [users, setUsers] = useState<User[]>([]);
    const { user } = useContext(userContext);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [modal, setModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [filters, setFilters] = useState({
        id: "",
        username: "",
        role: "",
        createdAt: ""
    });

    const fetchUsers = async()=>{
        const response = await wretch(`${apiUrl}/usuarios/lista-de-usuarios`)
            .options({ credentials: 'include' })
            .get()
            .json<any>();
        setUsers(response);
        setFilteredUsers(response);
    }

    const handleDeleteUser = async(userId: number)=>{
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés eliminar este usuario?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then(async(result) => {
            if (result.isConfirmed) {
                await wretch(`${apiUrl}/usuarios/eliminar-usuario`)
                    .options({ credentials: 'include' })
                    .post({ userId })
                    .res(()=> window.location.reload());
            }
        });
    }
    
    const handleUserRoleUpdate = async(userId: number, newRole: string)=>{
        Swal.fire({
            title: '¿Estás seguro?',
            text: `Estas seguro de que querés actualizar este usuario a ${newRole}?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, actualizar',
            cancelButtonText: 'Cancelar'
        }).then(async (result) => {
            if (result.isConfirmed) {
                await wretch(`${apiUrl}/usuarios/cambiar-rol`)
                    .options({ credentials: 'include' })
                    .put({ userId, newRole })
                    .res(()=> window.location.reload())
            }
        });
    }

    const handleFilters = (field: keyof typeof filters, value: string)=>{
        setFilters(prev => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    }

    useEffect(()=>{
        setFilteredUsers(
                users.filter(user =>(
                    (filters.id !== "" ? user.id.toString().toLowerCase().includes(filters.id) : true) &&
                    (filters.username !== "" ? user.username.toLowerCase().includes(filters.username.toLowerCase()) : true) &&
                    (filters.role !== "" ? user.role.toLowerCase().includes(filters.role.toLowerCase()) : true) &&
                    (filters.createdAt !== "" ? user.createdAt.toLowerCase().includes(filters.createdAt.toLowerCase()) : true)
                ))
            )
    }, [filters])

    useEffect(()=>{
        fetchUsers();
    }, [])

    return(
        <div className="mx-auto max-w-7xl p-5 space-y-6">
            <header className="flex items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">👤 Usuarios</h1>
            {
                user.role === "superadmin" &&
                <div className="flex items-center gap-2">
                    <button
                    onClick={()=>setModal(true)}
                    className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                    >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
                    </svg>
                    Crear usuario
                    </button>
                </div>
            }
            </header>
            <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Filtros de búsqueda</h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                    <input id="fId" type="text" placeholder="ID" onChange={(e)=>handleFilters('id', e.target.value)} value={filters.id}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm text-black dark:text-white placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                    <input id="fUsuario" type="text" placeholder="Usuario" onChange={(e)=>handleFilters('username', e.target.value)} value={filters.username}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm text-black dark:text-white placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" />
                    <select id="fRol" onChange={(e)=>handleFilters('role', e.target.value)} value={filters.role}
                    className={`w-full text-black dark:text-white rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 pr-8 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40`}
                    >
                            <option value="">Rol</option>
                            <option value="admin">Administrador</option>
                            <option value="sales">Ventas</option>
                    </select>
                    <CustomDateInput
                    value={filters.createdAt}
                    onChange={(e)=>handleFilters("createdAt", e)}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 text-black dark:text-gray-100 placeholder:text-black dark:placeholder:text-gray-100" 
                    />
                    {/* <input id="fFecha" type="text" placeholder="Fecha (DD-MM-YYYY)" onChange={(e)=>handleFilters('createdAt', e.target.value)} value={filters.createdAt}
                    className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100" /> */}
                    <button id="btnLimpiarFiltros" className="cursor-pointer rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                        onClick={()=>setFilters({id: "", username: "", role: "", createdAt: ""})}
                        >
                            Limpiar filtros
                    </button>
                </div>
            </section>

            <section className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                <div className="overflow-x-auto rounded-xl">
                    <SortableTable
                    data={filteredUsers}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={setCurrentPage}
                    columns={[
                        {key: "username", label: "Nombre de usuario", center: true },
                        {key: "role", label: "Rol", center: true },
                        {key: "registerDate", label: "Fecha de registro", center: true, sortable: false },
                        {key: "changeRole", label: "Cambiar rol", center: true, sortable: false },
                        {key: "delete", label: "Eliminar", center: true, sortable: false },
                    ]}
                    renderRow={(user) => (
                        <>
                            <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{user.username}</td>
                            <td className="px-4 py-3 text-center">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold
                                    ${user.role === 'sales' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200'}
                                `}>
                                    {user.role === 'sales' ? 'Ventas' : user.role === 'admin' ? 'Admin' : 'SuperAdmin'}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-center text-gray-800 dark:text-gray-100">{user.createdAt}</td>
                            <td className="px-4 py-3">
                                <div className="flex items-center justify-center gap-2">
                                    <button 
                                        onClick={()=>handleUserRoleUpdate(user.id, 'sales')}
                                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                        disabled={user.role === "sales"}
                                    >
                                        Vendedor
                                    </button>
                                    <button 
                                        onClick={()=>handleUserRoleUpdate(user.id, 'admin')}
                                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900"
                                        disabled={user.role === "admin"}
                                    >
                                        Administrador
                                    </button>
                                </div>
                            </td>
                            <td className="px-4 py-3 text-center">
                                <button 
                                    className="cursor-pointer rounded-md bg-rose-600 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-200 dark:focus:ring-rose-900/40" 
                                    aria-label="Eliminar usuario"
                                    onClick={()=>handleDeleteUser(user.id)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-6 0V4h6v3"/>
                                    </svg>
                                </button>
                            </td>
                        </>
                    )}
                    />
                </div>
            </section>

            <div className={`${modal ? "flex" : "hidden"} fixed inset-0 bg-black/40 backdrop-blur-[2px] items-center justify-center z-99999`}>
                <CreateUser closeModal={()=> setModal(false)}/>
            </div>
        </div>
    )
}