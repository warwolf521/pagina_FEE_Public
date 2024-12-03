import { tursoClient } from "../../db/turso";
import { NextResponse, NextRequest } from "next/server";

export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";

// Endpoint de búsqueda de publicaciones
export async function GET(request: NextRequest) {
  try {
    // Obtener el término de búsqueda desde la URL
    const url = new URL(request.nextUrl);
    const query = url.searchParams.get("q")?.trim() || "";

    const client = tursoClient;

    // Normalizar el término de búsqueda, en minusculas y sin tildes
    const normalizedQuery = query
      .normalize("NFD") 
      .replace(/[\u0300-\u036f]/g, "") 
      .toLowerCase(); 

    const sanitizedQuery = normalizedQuery.replace(/'/g, "''"); // un poco de seguridad xd en casos de sql injection

    // Dividir el término de búsqueda en palabras clave
    const keywords = sanitizedQuery.split(/\s+/); // Divide por espacios

    // Construir la cláusula WHERE dinámica
    const whereClauses = keywords.map(
      (keyword) => `
        lower(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Titulo, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) LIKE '%${keyword}%' 
        OR 
        lower(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(Categoria, 'á', 'a'), 'é', 'e'), 'í', 'i'), 'ó', 'o'), 'ú', 'u')) LIKE '%${keyword}%'
      `
    ).join(" AND ");

    // Consulta SQL dinámica con cláusulas WHERE para cada palabra clave
    const queryString = `
      SELECT p.*, GROUP_CONCAT(f.URL) AS imageUrls
      FROM Publicacion p
      LEFT JOIN Fotos f ON p.ID_publicacion = f.ID_publicacion
      WHERE ${whereClauses}
      GROUP BY p.ID_publicacion
    `;

    const res = await client.execute(queryString);

    // Si no se encuentran resultados
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "No se encontraron publicaciones para la búsqueda." }, { status: 404 });
    }

    // Transformar las URLs concatenadas en un array
    const publications = res.rows.map((row) => ({
      ...row,
      imageUrls: typeof row.imageUrls === 'string' ? row.imageUrls.split(',') : [],
    }));

    // Devolver las publicaciones encontradas con las URLs de las imágenes
    return NextResponse.json({ data: publications });
  } catch (error) {
    console.error("Error al obtener los datos:", error);
    return NextResponse.json({ error: "Error interno del servidor." }, { status: 500 });
  }
}
