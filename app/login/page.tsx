"use client";
import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { z } from 'zod';
import '../globals.css';
import { useRouter } from 'next/navigation'

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" })
});

const registerSchema = z.object({
    RegistroNombre: z.string().min(3, { message: "Name must be at least 3 characters long" }).max(25, { message: "Name must be at most 25 characters long" }),
    RegistroEmail: z.string().email({ message: "Invalid email address" }),
    RegistroPassword: z.string().min(6, { message: "Password must be at least 6 characters long" }),
    Registroconfpassword: z.string().min(6, { message: "Password must be at least 6 characters long" })
}).refine((data: { RegistroPassword: string; Registroconfpassword: string }) => data.RegistroPassword === data.Registroconfpassword, {
    message: "Passwords don't match",
    path: ["Registroconfpassword"]
});

function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const toggleToLogin = () => setIsLogin(true);
    const toggleToRegister = () => setIsLogin(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [RegistroNombre, setRegistroNombre] = useState('');
    const [RegistroEmail, setRegistroEmail] = useState('');
    const [RegistroPassword, setRegistroPassword] = useState('');
    const [Registroconfpassword, setRegistroConsPassword] = useState('');
    const [error, setError] = useState<string | number | null>(null);

    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }
        try {
            const response = await signIn('credentials', {
                email,
                password,
                redirect: false
            });
            console.log({response});
            if(!response || !response.ok){
                alert('Credenciales incorrectas o invalidas');
                return;
            }
            //alert('Logged in successfully');
            //redirect to home page
            router.push('/');
            router.refresh();
        } catch (error) {
            setError("Invalid credentials");
            console.log(error);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const result = registerSchema.safeParse({ RegistroNombre, RegistroEmail, RegistroPassword, Registroconfpassword });
        if (!result.success) {
            setError(result.error.errors[0].message);
            console.log(result);
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: RegistroNombre, email: RegistroEmail, password: RegistroPassword, confpassword: Registroconfpassword })
            });
            if (!response.ok) {
                throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
            }            
            setError('');
            alert('Registered successfully');
            //redirect to login page
            setRegistroNombre('');
            setRegistroEmail('');
            setRegistroPassword('');
            setRegistroConsPassword('');
            toggleToLogin();
            router.refresh();
        } catch (error) {
            setError("Registration failed");
            console.log(error);
        }
    };
    return(
        <div className='Login d-flex align-items-center justify-content-center'>
            <div className='Login_box'>
                <div className=' Ingreso_registro d-flex justify-content-between align-items-center mb-3'>
                    <div className='d-flex justify-content-center align-items-center col-6 flex-grow-1' onClick={toggleToLogin} style={{borderBottom: !isLogin ? '0px solid black':'1px solid #5F6C72', cursor: 'pointer'}}>
                        <p>Ingreso</p>
                    </div>
                    
                    <div className='d-flex align-items-center justify-content-center col-6 flex-grow-1' onClick={toggleToRegister} style={{borderBottom: isLogin ? '0px solid black':'1px solid #5F6C72', cursor: 'pointer'}}>
                        <p>Registro</p>
                    </div>
                </div>
                {isLogin ?(
                    <form onSubmit={handleLogin}>
                        <p>Correo Electronico</p>
                        <input className='form-control' type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
                        <p>Contrasena</p>
                        <input className='form-control' type="password" name="" id="" value={password} onChange={(e) => setPassword(e.target.value)}/>
                        <div className='button_login d-flex justify-content-center'>
                            <button className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '15%', marginRight: '50px' }}  type="submit" >Ingresar</button>
                        </div>
                        {error && <p>{error}</p>}
                    </form>
                ):(
                    <form onSubmit={handleRegister}>
                        <p>Nombre</p>
                        <input className='form-control' type="text" value={RegistroNombre} onChange={(e)=>setRegistroNombre(e.target.value)}/>
                        <p>Correo Electronico</p>
                        <input className='form-control' type="text" value={RegistroEmail} onChange={(e)=>setRegistroEmail(e.target.value)}/>
                        <p>Contrasena</p>
                        <input className='form-control' type="password" value={RegistroPassword} onChange={(e)=>setRegistroPassword(e.target.value)}/>
                        <p>Confirme la Contrasena</p>
                        <input className='form-control' type="password" value={Registroconfpassword} onChange={(e)=>setRegistroConsPassword(e.target.value)}/>
                        <div className='button_register d-flex justify-content-center'>
                            <button className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '20%', marginRight: '50px' }}  type="submit">Crear Cuenta</button>
                        </div>
                        {error && <p>{error}</p>}
                    </form>
                )}
                <hr></hr>
                <div>
                    <p>Si olvidaste tu contrasena...</p>
                </div>
            </div>
        </div>
    );
}
export default Login;