import { NextResponse } from "next/server";
import { tursoClient } from "@/app/db/turso";

export const fetchCache = 'force-no-store';

export async function POST(req: Request) {
    try {
        const { ID_publicacion, email } = await req.json();

        const updateResult = await tursoClient.execute({
            sql: "UPDATE Publicacion SET Cantidad_disponible = Cantidad_disponible - 1 WHERE ID_publicacion = ? AND Cantidad_disponible > 0",
            args: [ID_publicacion]
        });
        if (updateResult.rowsAffected === 0) {
            return NextResponse.json({error: "Sin stock o ID_publicacion inválido."});
        }

        const insertResult = await tursoClient.execute({
            sql: "INSERT INTO Transaccion (CorreoComprador, ID_publicacion, Estado) VALUES (?, ?, ?)",
            args: [email, ID_publicacion, "Completado"]
        });

        if (insertResult.rowsAffected === 0) {
            return NextResponse.json({error: "Error al crear transacción."});
        }

        return NextResponse.json({success: true});
    } catch (error) {
        console.error("Error al actualizar cantidad: ", error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}