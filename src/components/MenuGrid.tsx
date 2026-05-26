import { Link } from "react-router-dom";

export default function MenuGrid(){
    return(
        <div className="grid grid-cols-5 gap-4 p-5">
            <Link to="../usuarios" className="border bg-red-700 text-white p-10 rounded hover:bg-red-800 flex items-center justify-center text-xl cursor-pointer">
                Usuarios
            </Link>
            <Link to="../productos" className="border bg-blue-700 text-white p-10 rounded hover:bg-blue-800 flex items-center justify-center text-xl cursor-pointer">
                Productos
            </Link>
            <Link to="../stock"className="border bg-green-700 text-white p-10 rounded hover:bg-green-800 flex items-center justify-center text-xl cursor-pointer">
                Stock
            </Link>
            <Link to="../ventas" className="border bg-yellow-700 text-white p-10 rounded hover:bg-yellow-800 flex items-center justify-center text-xl cursor-pointer">
                Ventas
            </Link>
            <Link to="../compras" className="border bg-pink-700 text-white p-10 rounded hover:bg-pink-800 flex items-center justify-center text-xl cursor-pointer">
                Compras
            </Link>
            <Link to="../clientes" className="border bg-orange-700 text-white p-10 rounded hover:bg-orange-800 flex items-center justify-center text-xl cursor-pointer">
                Clientes
            </Link>
            <Link to="../proveedores" className="border bg-purple-700 text-white p-10 rounded hover:bg-purple-800 flex items-center justify-center text-xl cursor-pointer">
                Proveedores
            </Link>
            <Link to="../mensajeria" className="border bg-fuchsia-700 text-white p-10 rounded hover:bg-fuchsia-800 flex items-center justify-center text-xl cursor-pointer">
                Mensajería
            </Link>
            {/* <Link to="../proveedores" className="border bg-cyan-700 text-white p-10 rounded hover:bg-cyan-800 flex items-center justify-center text-xl cursor-pointer">
                Facturación
            </Link> */}
            <Link to="../graficos" className="border bg-lime-700 text-white p-10 rounded hover:bg-lime-800 flex items-center justify-center text-xl cursor-pointer">
                Tabla
            </Link>
        </div>
    )
}