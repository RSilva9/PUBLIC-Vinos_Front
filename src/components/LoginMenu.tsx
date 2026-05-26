import { useState } from "react";
import wretch from 'wretch';
import { apiUrl } from "../config/config";
import { useTheme } from "./themeContext";
import logo from "../assets/bg.jpg"

export default function LoginMenu(){
    const [incorrectUser, setIncorrectUser] = useState<boolean>(false);
    const [errorText, setErrorText] = useState<string>("");
    const { theme, toggleTheme } = useTheme();

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            await wretch(`${apiUrl}/usuarios/iniciar-sesion`)
                .options({ credentials: "include" })
                .post({
                    username: data.username,
                    password: data.password
                })
                .json<any>()
                .then(()=>window.location.assign("/inicio"));
        } catch (err) {
            if (err instanceof Error) {
                const errorObject = JSON.parse(err.message);
                setErrorText(errorObject.error || "Error desconocido");
            } else {
                setErrorText("Error inesperado");
            }
            setIncorrectUser(true);
        }
    };
    return (
        <div className="min-h-screen flex bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 text-gray-800 dark:text-gray-100 antialiased">
            <div className="hidden md:flex w-1/2 h-screen relative">
                <img src={logo} alt="Imagen"
                    className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/0 dark:bg-black/20"></div>
            </div>

            <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">

                <div className="w-full max-w-md flex justify-end mb-4">
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

                <div className="mb-6 text-center">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">LOGO</h1>
                <p className="mt-1 text-gray-600 dark:text-gray-300 text-sm">Bienvenido a MARCA</p>
                </div>

                <div className="w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-xl">
                <form onSubmit={login}>
                    <h3 className={`text-rose-500 mb-4 text-sm ${incorrectUser ? "" : "hidden"}`}>{errorText}</h3>

                    <div className="mb-5">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
                    <input
                        type="text" name="username" id="username" placeholder="Nombre de usuario"
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                    />
                    </div>

                    <div className="mb-3">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                    <input
                        type="password" name="password" id="password" placeholder="Contraseña"
                        className="w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100"
                    />
                    </div>

                    <div className="mb-6 text-right">
                    <button type="button"
                        className="cursor-pointer text-sm font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300">
                        Olvidé mi contraseña
                    </button>
                    </div>

                    <div className="text-center">
                    <button
                        type="submit"
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/50"
                    >
                        Iniciar sesión
                    </button>
                    </div>
                </form>
                </div>

                <p className="mt-12 text-gray-400 dark:text-gray-500 text-xs">2025© MARCA</p>
            </div>

            <div id="modalRecupero" className="fixed inset-0 bg-black/40 backdrop-blur-[2px] hidden items-center justify-center z-50">
                <div className="relative w-full max-w-md rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-6 shadow-2xl">
                <button aria-label="Cerrar">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"/>
                    </svg>
                </button>

                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">Recuperar contraseña</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                    Ingresá tu email o nombre de usuario y te enviaremos instrucciones para restablecerla.
                </p>

                <form onSubmit={(e)=>e.preventDefault()}>
                    <input type="text" placeholder="Email o usuario"
                    className="mb-4 w-full rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm placeholder:text-black dark:placeholder:text-white shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 focus:border-indigo-500 dark:text-gray-100" required />
                    <div className="flex justify-end gap-3">
                    <button type="button"
                        className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900">
                        Cancelar
                    </button>
                    <button type="submit"
                        className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-200 dark:focus:ring-emerald-900/40">
                        Enviar instrucciones
                    </button>
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}