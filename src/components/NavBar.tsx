import { useContext } from 'react';
import userContext from './_siteContext';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import { useTheme } from "./themeContext";
import logo from "../assets/bg.jpg"

export default function NavBar(){
    const { user } = useContext(userContext);
    const { theme, toggleTheme } = useTheme();

    const handleSignOut = () => {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Estas seguro de que querés cerrar sesión?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, cerrar sesión',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                signOut();
            }
        });
    };

    const signOut = async()=>{
        await wretch(`${apiUrl}/usuarios/cerrar-sesion`)
            .options({ credentials: 'include' })
            .get()
            .res()
            .then(()=>window.location.assign('/'))
    }

    function toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.toggle('-translate-x-full');
    }

    return(
        <div>
            <div id="sidebar" className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 dark:border-gray-900 shadow-2xl border-r transform -translate-x-full transition-transform duration-300 z-9999">
                <div className="flex flex-col items-center p-6 h-full">

                    <button onClick={()=>toggleSidebar()} className="self-end text-gray-500 hover:text-black transition mb-4 cursor-pointer">
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    <img src={logo} alt="Foto de perfil" className="rounded-full w-24 h-24 object-cover shadow-md mb-4 border-4 border-white"/>

                    <p className="text-xl dark:text-white font-semibold text-gray-800 mb-2">{user.username}</p>
                    <p className="text-sm dark:text-white text-gray-500 mb-6">{user.role}</p>

                    <hr className="w-full border-t border-gray-300 mb-4"></hr>

                    <nav className="w-full flex flex-col gap-2 text-left flex-grow">
                        <Link to={"/inicio"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-house"></i> Inicio
                        </Link>
                        <Link to={"/usuarios"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-user"></i> Usuarios
                        </Link>
                        <Link to={"/productos"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-box-open"></i> Productos
                        </Link>
                        <Link to={"/depositos"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-warehouse"></i> Depositos
                        </Link>
                        <Link to={"/stock"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-layer-group"></i> Stock
                        </Link>
                        <Link to={"/ventas"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-shopping-cart"></i> Ventas
                        </Link>
                        <Link to={"/compras"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-shopping-basket"></i> Compras
                        </Link>
                        <Link to={"/clientes"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-users"></i> Clientes
                        </Link>
                        <Link to={"/proveedores"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-truck"></i> Proveedores
                        </Link>
                        <Link to={"/mensajeria"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-envelope"></i> Mensajería
                        </Link>
                        <Link to={"/tablas"} className="flex items-center gap-3 py-2 px-4 dark:text-white rounded-lg hover:bg-gray-100 transition-all text-gray-700 hover:text-indigo-600"
                        onClick={()=>toggleSidebar()}
                        >
                            <i className="fas fa-table"></i> Tablas
                        </Link>
                    </nav>

                    <button onClick={handleSignOut} className="w-full mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all shadow-md cursor-pointer">
                        <i className="fas fa-sign-out-alt mr-2"></i> Cerrar sesión
                    </button>
                </div>
            </div>
            <div className="fixed z-999 bg-gray-800 text-white w-full">
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <button onClick={()=>toggleSidebar()} className="text-gray-300 hover:text-white focus:outline-none cursor-pointer mt-2">
                                <i className="fas fa-bars text-xl"></i>
                            </button>
                            <span className="text-xl font-bold">{user.username}</span>
                            <span className="text-xl font-bold">-</span>
                            <span className="text-xl font-bold">{user.role}</span>
                        </div>
                        <button
                        className="cursor-pointer inline-flex items-center justify-center rounded-md border border-gray-200 dark:border-gray-700 dark:bg-gray-800 px-3 py-2 shadow hover:bg-gray-100 dark:hover:bg-gray-700"
                        aria-label="Cambiar tema" title="Cambiar tema" onClick={toggleTheme}
                        >
                        {theme === "light" 
                        ? 
                        <svg id="icon-sun" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="4" strokeWidth="2"/>
                            <path strokeWidth="2" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/>
                        </svg>
                        : 
                        <svg id="icon-moon" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth="2" d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                        </svg>
                        }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}