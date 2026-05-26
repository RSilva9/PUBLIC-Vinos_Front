import EmailBuilder from "./EmailMaker";

export default function Mailing(){
    return(
        <div className="mx-auto max-w-7xl p-5 space-y-6 text-white">
            <header className="flex items-center justify-between gap-3">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-700 dark:text-white">📧 Mensajería</h1>
            </header>
            <div className="m-auto mt-5 mx-5 p-5 flex flex-col">
                <EmailBuilder />
            </div>
        </div>
    )
}