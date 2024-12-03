import { tursoClient } from "../../db/turso";

export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
    try {
        const { id, titulo, descripcion, precio, cantidad } = await request.json();

        if (!id || !titulo || !descripcion || !precio || !cantidad) {
            return Response.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
        }

        console.log(titulo, descripcion, precio, cantidad);

        const res = await tursoClient.execute({
            sql: 'UPDATE Publicacion SET Titulo = ?, Descripcion = ?, Precio = ?, Cantidad_disponible = ? WHERE ID_publicacion = ? RETURNING *;',
            args: [titulo, descripcion, precio, cantidad, id]
        });

        if(res.rows.length === 0) {
            return new Response('Error creating publication', { status: 400 });
        }

        return new Response('Update successfully', { status: 200 });
        
    } catch (error) {
        console.log('Error Creating Publication:', error);
        return new Response('Error processing request', { status: 500 });
    }
}