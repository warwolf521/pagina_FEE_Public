// /app/api/save-image/route.ts

import { tursoClient } from '../../db/turso';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { ID_publicacion, imageUrl } = await req.json();

    // Validación de parámetros requeridos
    if (!ID_publicacion || !imageUrl) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
    }

    // Guardar la URL de la imagen en la base de datos
    await tursoClient.execute({
      sql: `
        INSERT INTO Fotos (Tipo, Tamaño, Estado, ID_publicacion, URL) 
        VALUES (?, ?, 'Activo', ?, ?)
      `,
      args: [
        'jpg',                // Tipo (puedes ajustar según el tipo de archivo que sea)
        1024,                 // Tamaño (esto se podría extraer de `result` si lo necesitas)
        ID_publicacion,       // ID de la publicación asociada
        imageUrl              // URL de la imagen
      ],
    });

    return NextResponse.json({ message: 'Imagen guardada correctamente' });
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return NextResponse.json({ error: 'Error al guardar la imagen' }, { status: 500 });
  }
}
