import type { User } from "../utils/interfaces";
import { useContext, useEffect, useState } from "react";
import wretch from "wretch";
import { apiUrl } from "../config/config";
import MultiSelectDropdown from "./MultiSelectDropdown";
import userContext from "./_siteContext";
import CustomDateInput from "./CustomDateInput";

type Task = {
    ownerId: number;
    task: {
        taskId: number;
        title: string;
        description: string;
        endDate: string;
        state: string;
    },
    users: number[];
};


const fmtDate = (d: Date) => {
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    
    return `${day}-${month}-${year}`;
};

const normalizeDate = (dateStr: string) => {
    if(dateStr.length > 10){
        const [datePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split("/");
        return `${day}-${month}-${year}`;
    }else{
        const [day, month, year] = dateStr.split("/");
        return `${day}-${month}-${year}`;
    }
};

const displayDate = (dateStr: string) => {
    if (!dateStr) return "";

    const sep = dateStr.includes("/") ? "/" : "-";

    if (dateStr.length > 10) {
        const [datePart] = dateStr.split(" ");
        const [day, month, year] = datePart.split(sep);
        return `${day}/${month}/${year}`;
    } else {
        const [day, month, year] = dateStr.split(sep);
        return `${day}/${month}/${year}`;
    }
};

function parseDate(str: string): Date {
    const [day, month, year] = str.split("/").map(Number);
    return new Date(year, month - 1, day);
}

const todayStr = fmtDate(new Date());
const esES = new Intl.DateTimeFormat("es-AR", { month: "long", year: "numeric" });

export default function StartMenu(){
    const { user } = useContext(userContext)
    const [users, setUsers] = useState<User[]>([])
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        endDate: "",
        assignedUsernames: [] as string[],
        state: "Pendiente"
    })
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
    const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
    const [completedFilteredTasks, setCompletedFilteredTasks] = useState<Task[]>([]);
    const [view, setView] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [editId, setEditId] = useState<number>(0);
    const [detailedTask, setDetailedTask] = useState({
        title: "",
        description: "",
        endDate: "",
        owner: "",
        assignedUsernames: [] as string[],
        state: "Pendiente"
    });
    const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

    useEffect(() => {
        fetchData()
    }, []);

    useEffect(()=>{
        setNewTask((prev) => ({
            ...prev,
            endDate: displayDate(selectedDate as string) as string,
        }))
    }, [selectedDate])

    const fetchData = async()=>{
        const usersResponse = await wretch(`${apiUrl}/usuarios/lista-de-usuarios`)
            .options({ credentials: 'include' })
            .get()
            .json<User[]>();
        setUsers(usersResponse);
        const tasksResponse = await wretch(`${apiUrl}/tareas/lista-de-tareas`)
            .options({ credentials: 'include' })
            .get()
            .json<Task[]>();
        setTasks(tasksResponse);
        setFilteredTasks(tasksResponse);
        setCompletedTasks(tasksResponse.filter(t=> t.task.state === "Terminado"))
        setCompletedFilteredTasks(tasksResponse.filter(t=> t.task.state === "Terminado"))
    }

    const isDone = (t: Task) =>{
        if(t.task && t.task.state === "Terminado"){
            return true 
        }
        else{
            return false
        } 
    }

    const addTask = async() => {
        await wretch(`${apiUrl}/tareas/crear-tarea`)
            .options({ credentials: 'include' })
            .post({
                title: newTask.title,
                description: newTask.description,
                endDate: newTask.endDate,
                ownerId: user.id,
                assigned: users
                .filter(u => newTask.assignedUsernames.includes(u.username))
                .map(u => u.id),
                state: newTask.state
            })

        await fetchData();
        window.location.reload();
    };

    const editTask = async(taskId: number) => {
        await wretch(`${apiUrl}/tareas/editar-tarea`)
            .options({ credentials: 'include' })
            .put({
                data:{
                    title: newTask.title,
                    description: newTask.description,
                    endDate: newTask.endDate,
                    ownerId: user.id,
                    assigned: users
                    .filter(u => newTask.assignedUsernames.includes(u.username))
                    .map(u => u.id),
                    state: newTask.state
                },
                taskId
            })
            
        await fetchData();
        window.location.reload();
    }

    const deleteTask = async(taskId: number) =>{
        await wretch(`${apiUrl}/tareas/eliminar-tarea`)
            .options({ credentials: 'include' })
            .post({ taskId })
        
        await fetchData();
    }

    const handleNewTaskChange = (field: keyof typeof newTask, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>)=>{
        setNewTask(prev => ({ ...prev, [field]: event.target.value }));
    }

    const handleFilterTasks = (value: any, state: string)=>{
        switch(value){
            case "Todas":
                state === "Pendiente" ? setFilteredTasks(tasks) : setCompletedFilteredTasks(completedTasks);
                break;
            case "Mis tareas":
                state === "Pendiente" ? setFilteredTasks(tasks.filter(t=> t.users.includes(user.id!))) : setCompletedFilteredTasks(completedTasks.filter(t=> t.users.includes(user.id!)))
                break;
            case "Asignadas por mi":
                state === "Pendiente" ? setFilteredTasks(tasks.filter(t => t.ownerId === user.id)) : setCompletedFilteredTasks(completedTasks.filter(t => t.ownerId === user.id))
                break;
        }
    }

    const stats = {
        pendientes: filteredTasks.filter((t) => !isDone(t)).length,
        hoy: filteredTasks.filter((t) => !isDone(t) && normalizeDate(t.task.endDate) === todayStr).length,
        atrasadas: filteredTasks.filter((t) => !isDone(t) && normalizeDate(t.task.endDate) < todayStr).length,
        done: completedFilteredTasks.length,
    };

    const renderCalendarCells = () => {
        const y = view.getFullYear();
        const m = view.getMonth();
        const first = new Date(y, m, 1);
        const startWeekday = (first.getDay() + 6) % 7;
        const daysInMonth = new Date(y, m + 1, 0).getDate();

        const prevDays = startWeekday;
        const totalCells = Math.ceil((prevDays + daysInMonth) / 7) * 7;

        const cells = [];
        for (let i = 0; i < totalCells; i++) {
            const dayNum = i - prevDays + 1;
            let dateStr = "";
            let disabled = false;

            if (i < prevDays) {
                disabled = true;
            } else if (dayNum > daysInMonth) {
                disabled = true;
            } else {
                const d = new Date(y, m, dayNum);
                dateStr = fmtDate(d);
            }

            const delDia = [
                ...filteredTasks.filter((t) => normalizeDate(t.task.endDate) === dateStr && t.task.state !== "Terminado"),
                ...completedFilteredTasks.filter((t) => normalizeDate(t.task.endDate) === dateStr)
            ];
            // const delDia = filteredTasks.filter((t) => normalizeDate(t.task.endDate) === dateStr);
            const incompletas = delDia.filter((t) => !isDone(t)).length;
            const isToday = dateStr === todayStr;

            cells.push(
                <button
                key={i}
                disabled={disabled}
                onClick={() => dateStr && setSelectedDate(dateStr)}
                className={`cursor-pointer relative rounded-xl p-3 text-left border border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                    disabled ? "opacity-50" : ""
                } ${isToday ? "ring-2 ring-indigo-300 dark:ring-indigo-700/50" : ""}`}
                >
                    <div className="flex items-center justify-between">
                        <span
                        className={`text-sm font-semibold ${
                            isToday ? "text-indigo-600 dark:text-indigo-300" : ""
                        }`}
                        >
                            {dayNum > 0 && dayNum <= daysInMonth ? dayNum : ""}
                        </span>
                        {incompletas > 0 && (
                        <span className="text-[10px] rounded-full px-2 py-0.5 bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-200">
                            {incompletas}
                        </span>
                        )}
                    </div>
                    {delDia.length > 0 && (
                        <div className="mt-2 flex flex-wrap gap-1">
                            {delDia.slice(0, 3).map((t) => (
                                <span
                                key={t.task.taskId}
                                className={`text-[10px] rounded-full px-2 py-0.5 ${
                                    isDone(t)
                                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-200"
                                    : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                                }`}
                                >
                                {t.task.title.slice(0, 12)}
                                </span>
                            ))}
                            {delDia.length > 3 && (
                                <span className="text-[10px] text-gray-400">+{delDia.length - 3}</span>
                            )}
                        </div>
                    )}
                </button>
            );
        }
        return cells;
    };

    return (
        <div className="mx-auto max-w-7xl p-5 space-y-6">
            <header className="flex items-center justify-between gap-3">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">🏠 Inicio</h1>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSelectedDate(todayStr)}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-indigo-700"
                    >
                        Nueva tarea
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Pendientes" value={stats.pendientes} />
                <StatCard title="Para hoy" value={stats.hoy} />
                <StatCard title="Atrasadas" value={stats.atrasadas} />
                <StatCard title="Completadas" value={stats.done} />
            </section>

            <section className="flex flex-col gap-5">
                <div className="lg:col-span-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2">
                            <button className="cursor-pointer" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))}>←</button>
                            <button className="cursor-pointer" onClick={() => setView(new Date())}>Hoy</button>
                            <button className="cursor-pointer" onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))}>→</button>
                        </div>
                        <h2>{esES.format(view)}</h2>
                    </div>
                    <div className="p-6">
                        <div className="grid grid-cols-7 text-xs font-semibold text-gray-500 mb-2">
                        {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map((d) => (
                            <div key={d} className="text-center">{d}</div>
                        ))}
                        </div>
                        <div className="grid grid-cols-7 gap-2">{renderCalendarCells()}</div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                        <div className="flex justify-between mb-5">
                            <h3 className="text-lg font-semibold mb-3">Tareas pendientes</h3>
                            <select
                            onChange={e => handleFilterTasks(e.target.value, "Pendiente")}
                            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                            >
                                <option value="Todas">Todas</option>
                                <option value="Mis tareas">Mis tareas</option>
                                <option value="Asignadas por mi">Asignadas por mi</option>
                            </select>
                        </div>
                        <ul className="space-y-2">
                            {filteredTasks.filter((t) => !isDone(t))
                            .sort((a, b) => parseDate(a.task.endDate).getTime() - parseDate(b.task.endDate).getTime())
                            .map((t) => (
                            <li key={t.task.taskId} className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded p-2">
                                <label className="flex items-center">
                                        <span className="ms-2">
                                            {t.task.endDate} - {t.task.title}
                                        </span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setDetailedTask({
                                                title: t.task.title,
                                                description: t.task.description,
                                                endDate: t.task.endDate.trim(),
                                                owner: users.find(u=> u.id === user.id)!.username,
                                                assignedUsernames: users
                                                .filter(u => t.users.includes(u.id))
                                                .map(u => u.username),
                                                state: t.task.state
                                            });
                                            setShowDetailModal(true);
                                        }}
                                        className="cursor-pointer rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>
                                    <button
                                        onClick={() => deleteTask(t.task.taskId)}
                                        className="cursor-pointer rounded-md border border-transparent bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                    >
                                        <i className="fa fa-trash"></i>
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDate(t.task.endDate.trim());
                                            setEditId(t.task.taskId);
                                            setNewTask({
                                                title: t.task.title,
                                                description: t.task.description,
                                                endDate: t.task.endDate.trim(),
                                                assignedUsernames: users
                                                .filter(u => t.users.includes(u.id))
                                                .map(u => u.username),
                                                state: "Pendiente"
                                            })
                                        }}
                                        className="cursor-pointer rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-1.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <i className="fa fa-pencil"></i>
                                    </button>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>

                    <div className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6">
                        <div className="flex justify-between mb-5">
                            <h3 className="text-lg font-semibold mb-3">Tareas completadas</h3>
                            <select
                            onChange={e => handleFilterTasks(e.target.value, "Terminado")}
                            className="rounded-full border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900/40 dark:text-gray-100"
                            >
                                <option value="Todas">Todas</option>
                                <option value="Mis tareas">Mis tareas</option>
                                <option value="Asignadas por mi">Asignadas por mi</option>
                            </select>
                        </div>
                        <ul className="space-y-2">
                            {completedFilteredTasks.filter((t) => isDone(t))
                            .sort((a, b) => parseDate(a.task.endDate).getTime() - parseDate(b.task.endDate).getTime())
                            .map((t) => (
                            <li key={t.task.taskId} className="flex justify-between items-center border border-gray-200 dark:border-gray-700 rounded p-2">
                                <label className="flex items-center">
                                        <span className="ms-2">
                                            {t.task.endDate} - {t.task.title}
                                        </span>
                                </label>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setDetailedTask({
                                                title: t.task.title,
                                                description: t.task.description,
                                                endDate: t.task.endDate.trim(),
                                                owner: users.find(u=> u.id === user.id)!.username,
                                                assignedUsernames: users
                                                .filter(u => t.users.includes(u.id))
                                                .map(u => u.username),
                                                state: t.task.state
                                            });
                                            setShowDetailModal(true);
                                        }}
                                        className="cursor-pointer rounded-md border border-transparent bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 dark:focus:ring-indigo-900/40"
                                    >
                                        <i className="fa fa-eye"></i>
                                    </button>
                                    <button
                                        onClick={() => deleteTask(t.task.taskId)}
                                        className="cursor-pointer rounded-md border border-transparent bg-rose-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-200 dark:focus:ring-rose-900/40"
                                    >
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                            </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {selectedDate && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-99999">
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg">
                        <h3 className="text-xl font-semibold mb-4">{editId === 0 ? "Crear nueva tarea" : "Editar tarea"}</h3>
                        <form
                        onSubmit={(e) => {
                            e.preventDefault();

                            if (
                                newTask.title.trim() === "" ||
                                newTask.description.trim() === "" ||
                                newTask.endDate === "" ||
                                newTask.state === "" ||
                                newTask.assignedUsernames.length === 0
                            ){
                                alert("Por favor completa todos los campos");
                                return;
                            }

                            if(editId === 0){
                                addTask()
                            }else{
                                editTask(editId)
                            }
                        }}
                        className="flex flex-col gap-2 mb-4"
                        >
                            <input name="title" value={newTask.title} className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-2" placeholder="Título..." 
                            onChange={(e)=>handleNewTaskChange("title",e)}
                            />
                            <textarea name="description" value={newTask.description} className="flex-1 border border-gray-300 dark:border-gray-700 rounded px-2 min-h-[150px]" placeholder="Descripción..." 
                            onChange={(e)=>handleNewTaskChange("description",e)}
                            />
                            <MultiSelectDropdown options={users.map(u => u.username)} value={newTask.assignedUsernames} 
                            onChange={(values)=>setNewTask((prev) => ({ ...prev, assignedUsernames: values }))} customPlaceholder="Seleccionar usuarios"/>
                            <CustomDateInput
                            value={newTask.endDate}
                            onChange={(val) =>
                                setNewTask((prev) => ({
                                ...prev,
                                endDate: val,
                                }))
                            }
                            />
                            <div className="flex w-full justify-between">
                                <div className={`cursor-pointer w-[49%] rounded-md border border-gray-200 dark:border-gray-700 ${newTask.state === "Pendiente" ? "bg-yellow-200 dark:bg-yellow-800" : " bg-yellow-100 dark:bg-yellow-900/40"} px-3 py-1.5 text-sm hover:bg-yellow-200 dark:hover:bg-yellow-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                                onClick={() =>
                                    setNewTask((prev) => ({
                                    ...prev,
                                    state: "Pendiente",
                                    }))
                                }
                                >
                                        Pendiente
                                </div>
                                <div className={`cursor-pointer w-[49%] rounded-md border border-gray-200 dark:border-gray-700 ${newTask.state === "En proceso" ? "bg-orange-200 dark:bg-orange-800" : "bg-orange-100 dark:bg-orange-900/40"} px-3 py-1.5 text-sm hover:bg-orange-200 dark:hover:bg-orange-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                                onClick={() =>
                                    setNewTask((prev) => ({
                                    ...prev,
                                    state: "En proceso",
                                    }))
                                }
                                >
                                        En proceso
                                </div>
                                {
                                    editId !== 0 &&
                                    <div className={`cursor-pointer w-[49%] rounded-md border border-gray-200 dark:border-gray-700 ${newTask.state === "Terminado" ? "bg-emerald-200 dark:bg-emerald-800" : "bg-emerald-100 dark:bg-emerald-900/40"} px-3 py-1.5 text-sm hover:bg-emerald-200 dark:hover:bg-emerald-800 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-900`}
                                    onClick={() =>
                                        setNewTask((prev) => ({
                                        ...prev,
                                        state: "Terminado",
                                        }))
                                    }
                                    >
                                        Terminado
                                    </div>
                                }
                            </div>
                            <button className="cursor-pointer bg-indigo-600 text-white px-3 py-1 rounded">Guardar</button>
                        </form>
                        <button onClick={() => {
                            setSelectedDate(null);
                            setNewTask({
                                title: "",
                                description: "",
                                endDate: "",
                                assignedUsernames: [] as string[],
                                state: "Pendiente"
                            });
                            setEditId(0);
                        }} className="cursor-pointer mt-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded">
                        Cerrar
                        </button>
                    </div>
                </div>
            )}

            {showDetailModal &&
            <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-xl w-full max-w-lg">
                    <h3 className="text-xl font-semibold mb-4">Detalle de tarea</h3>

                    <div className="flex flex-col gap-3 mb-4">
                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Título</h4>
                        <p className="text-gray-900 dark:text-gray-100">{detailedTask!.title}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Descripción</h4>
                        <p className="text-gray-900 dark:text-gray-100 whitespace-pre-line break-words">{detailedTask!.description}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Creador</h4>
                        <p className="text-gray-900 dark:text-gray-100">{detailedTask!.owner}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Asignados</h4>
                        <ul className="list-disc list-inside text-gray-900 dark:text-gray-100">
                        {detailedTask!.assignedUsernames.map(u => (
                            <li key={u}>{u}</li>
                        ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Fecha límite</h4>
                        <p className="text-gray-900 dark:text-gray-100">{detailedTask!.endDate}</p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300">Estado</h4>
                        <span
                        className={`px-3 py-1 rounded-md text-sm ${
                            detailedTask!.state === "Pendiente"
                            ? "bg-emerald-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100"
                            : detailedTask!.state === "En proceso"
                            ? "bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100"
                            : detailedTask!.state === "Terminado"
                            && "bg-gray-200 dark:bg-emerald-700 text-emerald-900 dark:text-emerald-100"
                        }`}
                        >
                        {detailedTask!.state}
                        </span>
                    </div>
                    </div>

                    <button
                    onClick={() => setShowDetailModal(false)}
                    className="cursor-pointer mt-4 px-4 py-2 border border-gray-300 dark:border-gray-700 rounded"
                    >
                    Cerrar
                    </button>
                </div>
            </div>}

        </div>
    );  
}

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-5">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="mt-1 text-3xl font-semibold">{value}</p>
        </div>
    );
}
