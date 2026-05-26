import { DateTime } from "luxon";

export function formatDate(dateToFormat: string): string {
    const formattedDate = DateTime
        .fromFormat(dateToFormat, "dd/LL/yyyy HH:mm:ss", { zone: 'America/Argentina/Buenos_Aires' })
        .toFormat("yyyyLLdd-HHmmss");

    return formattedDate;
}

export function dateToFormat(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

export function formattedClientName(nameToFormat: string): string{
    const formattedClientName = nameToFormat
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase();

    return formattedClientName
};