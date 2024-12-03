import { tursoClient } from "../../db/turso";

export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
    try {
        const { ID_Usuario, titulo, descripcion, precio, categoria, cantidad, imageUrl } = await request.json();

        if (!ID_Usuario || !imageUrl) {
            return Response.json({ error: 'Faltan parámetros requeridos.' }, { status: 400 });
        }

        const res = await tursoClient.execute({
            sql: 'INSERT INTO Publicacion (ID_usuario, Titulo, Descripcion, Calificacion, Estado, Precio, Categoria, Cantidad_disponible, Visibilidad) values (?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING *;',
            args: [ID_Usuario, titulo, descripcion, '1', 'Activo', precio, categoria, cantidad, 'Publico']
        });

        if(res.rows.length === 0) {
            return new Response('Error creating publication', { status: 400 });
        }

        const res_image = await tursoClient.execute({
            sql: `
              INSERT INTO Fotos (Tipo, Tamaño, Estado, ID_publicacion, URL) 
              VALUES (?, ?, 'Activo', ?, ?) RETURNING *;
            `,
            args: [
              'jpg',                // Tipo (puedes ajustar según el tipo de archivo que sea)
              1024,                 // Tamaño (esto se podría extraer de `result` si lo necesitas)
              res.rows[0].ID_publicacion,       // ID de la publicación asociada
              imageUrl              // URL de la imagen
            ],
        });
        
        if(res_image.rows.length === 0) {
            await tursoClient.execute({
                sql: 'DELETE FROM Publicacion WHERE ID_publicacion = (?);',
                args: [res.rows[0].ID_publicacion]
            });
            return new Response('Error uploading image', { status: 400 });
        }

        return new Response('Created successfully', { status: 200 });
        
    } catch (error) {
        console.log('Error Creating Publication:', error);
        return new Response('Error processing request', { status: 500 });
    }
}