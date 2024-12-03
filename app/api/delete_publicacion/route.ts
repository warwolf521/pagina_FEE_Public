import { tursoClient } from "../../db/turso";

export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
    try {
        const { id} = await request.json();

        if (!id) {
            return Response.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
        }

        const res = await tursoClient.execute({
            sql: 'UPDATE Publicacion SET Estado = "Inactivo" WHERE ID_publicacion = ? RETURNING *;',
            args: [id]
        });

        if(res.rows.length === 0) {
            return new Response('Error deleting publication', { status: 400 });
        }

        return new Response('Delete successfully', { status: 200 });
        
    } catch (error) {
        console.log('Error Deleting Publication:', error);
        return new Response('Error processing request', { status: 500 });
    }
}