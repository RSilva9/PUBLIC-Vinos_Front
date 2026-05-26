import { useState } from "react";

interface CustomDateInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function CustomDateInput({
    value,
    onChange,
    placeholder = "dd/mm/yy hh:mm",
    className = "",
    }: CustomDateInputProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value.replace(/\D/g, "");

        if (raw.length > 12) raw = raw.slice(0, 12);

        let formatted = raw;
        if (raw.length > 2) formatted = raw.slice(0, 2) + "/" + raw.slice(2);
        if (raw.length > 4) formatted = formatted.slice(0, 5) + "/" + formatted.slice(5);
        if (raw.length > 8) formatted = formatted.slice(0, 10) + " " + formatted.slice(10);
        if (raw.length > 10) formatted = formatted.slice(0, 13) + ":" + formatted.slice(13);

        onChange(formatted);
    };

    return (
    <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`border border-gray-300 dark:border-gray-700 rounded px-2 ${className}`}
    />
    );
}