import { tursoClient } from '../../db/turso';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Obtener publicaciones junto con las imágenes asociadas
    const result = await tursoClient.execute({
      sql: `
        SELECT p.*, GROUP_CONCAT(f.URL) AS imageUrls
        FROM Publicacion p
        LEFT JOIN Fotos f ON p.ID_publicacion = f.ID_publicacion
        GROUP BY p.ID_publicacion LIMIT 16
      `,
      args: []
    });

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'No se encontraron publicaciones.' }, { status: 404 });
    }

    // Transformar las URLs concatenadas en un array
    const publications = result.rows.map((row) => ({
      ...row,
      imageUrls: typeof row.imageUrls === 'string' ? row.imageUrls.split(',') : [],
    }));

    return NextResponse.json({ data: publications });
  } catch (error) {
    console.error('Error al obtener publicaciones:', error);
    return NextResponse.json({ error: 'Error al obtener publicaciones.' }, { status: 500 });
  }
}



