// /app/upload/page.ts

"use client"; // Necesario para usar componentes del cliente en Next.js 13+

import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useState } from 'react';
import Image from 'next/image';

export default function UploadPage() {
    // Estado para almacenar la URL de la imagen subida
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

    // Manejar la respuesta de la carga
    const handleSuccess = async (result: CloudinaryUploadWidgetResults) => {
        if (result.event === 'success' && result.info && typeof result.info !== 'string') {
            const secureUrl = result.info.secure_url;
            if (secureUrl) {
                setUploadedImageUrl(secureUrl);

                // Guardar la URL en la base de datos usando un endpoint API de Next.js
                try {
                    const response = await fetch('/api/save-image', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            ID_publicacion: 19, // Aquí deberías reemplazar con el ID adecuado de la publicación
                            imageUrl: secureUrl,
                        }),
                    });

                    if (!response.ok) {
                        throw new Error('Error al guardar la URL de la imagen en la base de datos');
                    }

                    console.log('URL guardada en la base de datos con éxito');
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        }
    };

    return (
        <div>
            <h1>Subir Imagen</h1>
            <CldUploadButton
                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string}
                onSuccess={handleSuccess}
                className="my-upload-button"
            >
                Subir Imagen
            </CldUploadButton>

            {uploadedImageUrl && (
                <div>
                    <h2>Imagen subida correctamente:</h2>
                    <Image
                        src={uploadedImageUrl}
                        alt="Imagen subida"
                        width={800}
                        height={600}
                        style={{ maxWidth: '100%' }}
                    />
                </div>
            )}
        </div>
    );
}
