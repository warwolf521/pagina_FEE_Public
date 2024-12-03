import { withAuth } from "next-auth/middleware"

export default withAuth(
    async function middleware(req) {
        //console.log(req.nextauth.token)
        /*const session = await getSession({ req })
        console.log(session)*/
    },{
        callbacks: {
            authorized: ({ req, token }) => {
                const protectedPaths = ['/perfil', '/chat', '/pago-credito']
                const isProtectedPath = protectedPaths.some(path => req.nextUrl.pathname.startsWith(path));

                if (!token && isProtectedPath) {
                    return false
                }
                if(token && token.user){
                    //console.log(token.user.nombre);
                }
                return true
            },
        },
    }
)

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
