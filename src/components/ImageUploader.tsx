import React, { useState } from 'react';
import wretch from 'wretch';

type Props = {
    onUpload: (url: string) => void;
};

export const CloudinaryUpload: React.FC<Props> = ({ onUpload }) => {
    const [loading, setLoading] = useState(false);

    const uploadImage = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'vinos_cloud');
        formData.append('cloud_name', 'dz1vszr7l');

        setLoading(true);
        const res = await wretch(`https://api.cloudinary.com/v1_1/dz1vszr7l/image/upload`)
            .post(formData)
            .json<any>()

        const data = await res;
        setLoading(false);

        if (data.secure_url) {
            onUpload(data.secure_url);
        }else{
            console.error('Cloudinary upload error', data);
        }
    };

    return (
        <div className="flex items-center space-y-4">
            <input
                type="file"
                accept="image/*"
                disabled={loading}
                className="cursor-pointer block w-full flex text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
                onChange={(e) => {
                    if (e.target.files?.[0]) uploadImage(e.target.files[0]);
                }}
            />
            {loading && <p className="text-blue-500 font-medium">Subiendo...</p>}
        </div>
    );
};
