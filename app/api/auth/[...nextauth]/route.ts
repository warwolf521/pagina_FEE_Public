import NextAuth from "next-auth/next";
import { DefaultSession, DefaultUser } from "next-auth"
import { tursoClient } from "../../../db/turso";
import CredentialsProvider from "next-auth/providers/credentials";

declare module "next-auth" {
    interface Session extends DefaultSession {
        user: {
            id: string;
            nombre: string;
            correo: string;
            rol: string;
            tipo: string;
            fono: string;
        };
    }
    interface User extends DefaultUser {
        id: string;
        nombre: string;
        correo: string;
        rol: string;
        tipo: string;
        fono: string;
    }
}
declare module "next-auth/jwt" {
    interface JWT {
        user?: {
            id: string;
            nombre: string;
            correo: string;
            rol: string;
            tipo: string;
            fono: string;
        };
    }
}


const handler = NextAuth({
    session: {
        strategy: 'jwt',
    },
    providers: [
        CredentialsProvider({
            credentials: {
                email: {},
                password: {}
            },
            async authorize(credentials) {
                if (!credentials) {
                    throw new Error("No credentials provided");
                }
                const res = await tursoClient.execute({
                    sql: 'SELECT * FROM Usuario Where Correo =  (?);',
                    args: [credentials.email]
                });
                if(res.rows.length == 1 && res.rows[0].Correo == credentials.email && res.rows[0].Contraseña == credentials.password){
                    console.log("credentials correct");
                    const user = {
                        id: String(res.rows[0].ID_usuario),
                        nombre: String(res.rows[0].Nombre), // Ensure this is a string
                        correo: credentials.email,
                        rol: String(res.rows[0].Rol), // Ensure this is a string
                        tipo: String(res.rows[0].Tipo), // Ensure this is a string
                        fono: String(res.rows[0].Fono) // Ensure this is a string
                    };
                    console.log("User object:", user);
                    return user;
                }

                return null;
            }
        })
    ],callbacks: {
        async session({ session, token }) {
            if (token.user) {
                session.user = token.user;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.user = user;
            }
            return token;
        },
    },pages: {
        signIn: '/login',
    }
});

export {handler as GET, handler as POST};