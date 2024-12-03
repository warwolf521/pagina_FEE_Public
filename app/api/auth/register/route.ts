import { tursoClient } from "../../../db/turso";

export const fetchCache = 'force-no-store';

export async function POST(request: Request) {
    try {
        const { name, email, password, confpassword } = await request.json();
        console.log(email);

        //see if email is in use
        const resEmail = await tursoClient.execute({
            sql: 'select * from Usuario where Correo = ?;',
            args: [email]
        });
        if (resEmail.rows.length > 0) {
            return new Response('Email already in use', { status: 400 });
        }

        let tipo = "NoUdeC";
        if (password !== confpassword) {
            return new Response('Password and confirm password are not the same', { status: 400 });
        }

        //check if email ends with @udec.cl
        if (email.endsWith('@udec.cl')) {
            tipo = "UdeC";
        }

        const res = await tursoClient.execute({
            sql: 'insert into Usuario (Nombre, Correo, Tipo, Rol, Fono, Contraseña, Estado) values (?, ?, ?, ?, ?, ?, ?);',
            args: [name, email, tipo, "Comprador", "", password, "Activo"]
        });

        return new Response('Registered successfully', { status: 200 });
        
    } catch (error) {
        console.log('Error registering user:', error);
        return new Response('Error processing request', { status: 500 });
    }
}