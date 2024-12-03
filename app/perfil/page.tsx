'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Card_product_edit from '../componentes/card_producto_edit';
import { z } from 'zod';
import { CldUploadButton, CloudinaryUploadWidgetResults } from 'next-cloudinary';
import { useRouter } from 'next/navigation';

interface Publication {
    ID_publicacion: number;
    Fecha: string;
    Titulo: string;
    Descripcion: string;
    Precio: number;
    Categoria: string;
    Calificacion: number;
    Hot: number;
    Estado: string;
    Cantidad_disponible: number;
    Visibilidad: string;
    ID_Usuario: number;
    imageUrls: string[];
    hot: number;
  }

  const publicacionSchema=  z.object({
    title: z.string().min(2,{message: "titulo invalido"}),
    descripcion: z.string().min(10,{message: "descripcion invalida"}).max(165,{message: "descripcion invalida"}),
    precio: z.number().nonnegative(),
    categoria: z.string(),
    cantidad: z.number().nonnegative()
  })

export default function Perfil(){
  const [Cuenta, setCuenta] = useState(true);
  const[crearPublicacion, setCrearPublicacion] = useState(false);
  const [publications, setPublications] = useState<Publication[]>([]);
  const[titulo, setTitulo] = useState('');
  const[descripcion, setDescripcion] = useState('');
  const[precio, setPrecio]= useState(0);
  const[categoria, setCategoria]= useState('');
  const[cantidad, setCantidad]= useState(0)
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | number | null>(null);
  const router = useRouter();


  const toggleToCuenta = () => setCuenta(true);
  const toggleToConf = () => setCuenta(false);
  const toggleCrear = () => setCrearPublicacion(true);
  const toggleView = () => setCrearPublicacion(false);

    const { data: session, status } = useSession();
    const ID_Usuario = session?.user.id;

    const getPublicaciones = () =>{
      fetch(`/api/get_pub_perfil?q=${ID_Usuario}`)
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          console.error('Error fetching publications:', data.error);
        } else {
          if (Array.isArray(data.data)) {
            setPublications(data.data);
          } else {
            console.error('Expected an array for items, received:', data);
            setPublications([]);
          }
        }
      })
      .catch(error => console.error('Error fetching items:', error));
    }
    useEffect(() => {
      if(session != null){
        getPublicaciones();
      }
    }, [session]);

    const handleCreatePublicacion = async (e: React.FormEvent) => {
      e.preventDefault();
      const result = publicacionSchema.safeParse({title: titulo, descripcion: descripcion, precio: precio, categoria: categoria, cantidad: cantidad});
      if (!result.success) {
          setError(result.error.errors[0].message);
          return;
      }
      if(ID_Usuario == null){
        setError("No se ha iniciado sesion");
        return;
      }
      if(uploadedImageUrl == null){
        setError("No se ha subido una imagen");
        return;
      }
      try{
        const response = await fetch(`/api/post_publication`,{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ID_Usuario: ID_Usuario,
            titulo: titulo,
            descripcion: descripcion,
            precio: precio,
            categoria: categoria,
            cantidad: cantidad,
            imageUrl: uploadedImageUrl
          })
        })
        if (!response.ok) {
          throw new Error(`Registration failed: ${response.status} ${response.statusText}`);
        }
        alert('Publicacion creada con exito');
      }catch(error){
        setError("Error al crear la publicacion");
        console.log(error);
      } 
    }

  const handleSuccessUpload = async (result: CloudinaryUploadWidgetResults) => {
    if (result.event === 'success' && result.info && typeof result.info !== 'string') {
      const secureUrl = result.info.secure_url;
        if (secureUrl) {
            setUploadedImageUrl(secureUrl);
        }
    }
  };


    return(
        <div className="text-center" style={{marginLeft: "10%", marginRight: "10%"}}>
            <div className="row justify-content-center">
                <div className="toggle_cuentacol-4">
                    <div className="row justify-content-center">
                        <div className='d-flex col-6 rounded-3' style={{ padding: 0, boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.5)"}}>
                            <button className={`btn btn-${Cuenta ? 'warning' : 'light'} rounded-bottom-0 rounded-top-3 w-100`} onClick={toggleToCuenta}>Cuenta</button>
                            <button className={`btn btn-${!Cuenta ? 'warning' : 'light'} rounded-bottom-0 rounded-top-3 w-100`}  onClick={toggleToConf}>Configuracion</button>
                        </div>
                    </div>
                </div>
                <div className="Principal_text_perfil col-12">
                  <h2 className='text-start'>Hola, {session?.user.nombre}</h2>
                  <h6 className='text-start'>Desde tu Dashboard puedes observar y editar los datos de tu cuenta</h6>
                  {Cuenta ? (
                    <>
                      <div className='row'>
                        <div className='col-6 rounded-1' style={{outline: "1px solid rgba(0, 0, 0, 0.3)", marginLeft: "12px", padding: 0}}>
                          <div style={{borderBottom: "1px solid rgba(0, 0, 0, 0.3)", padding: "0px"}}> 
                            <h5 className='text-start' style={{fontWeight: "bold", padding: "16px 0px 16px 24px", margin: 0}}>Informacion de la cuenta</h5>
                          </div>
                          <div style={{marginTop: '10px'}}>
                            <p className='text-start' style={{marginBottom: "6px", marginLeft: "24px"}}>Nombre: {session?.user.nombre}</p>
                            <p className='text-start' style={{marginBottom: "6px", marginLeft: "24px"}}>Correo: {session?.user.correo}</p>
                            <p className='text-start' style={{marginBottom: "6px", marginLeft: "24px"}}>Telefono: {session?.user.fono}</p>
                          </div>
                        </div>
                        <div className='col-5 rounded-1' style={{outline: "1px solid rgba(0, 0, 0, 0.3)", marginLeft: "12px", padding: 0, flexGrow: 1, marginRight: "12px"}}>
                          <div style={{borderBottom: "1px solid rgba(0, 0, 0, 0.3)"}}> 
                            <h5 className='text-start' style={{fontWeight: "bold", padding: "16px 0px 16px 24px", margin: 0}}>Direccion</h5>
                          </div>
                          <div style={{marginTop: '10px'}}>
                            <p className='text-start' style={{marginBottom: "6px", marginLeft: "24px"}}>Desconocida</p>
                          </div>
                        </div>
                      </div>
                      <div className='rounded-1' style={{outline: "1px solid rgba(0, 0, 0, 0.3)", padding: 0, marginTop: "12px"}}>
                        <div style={{borderBottom: "1px solid rgba(0, 0, 0, 0.3)", padding: "0px"}}> 
                          
                          {!crearPublicacion?(
                            <div>
                              <div className='container d-flex justify-content-between'>
                                <h5 className='text-start' style={{fontWeight: "bold", padding: "25px 0px 16px 24px", margin: 0}}>Publicaciones</h5>
                                <button className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '15%', marginTop: '10px' }} onClick={toggleCrear}>
                                  Crear Publicacion
                                </button>
                              </div>
                              <div className='Product_perfil_container container d-flex flex-wrap'>
                                {
                                  publications.map((publicacion,publicacionIndex)=>(
                                    <div className='col-12 col-sm-6 col-md-4 mb-4' key={publicacionIndex}>
                                        <Card_product_edit
                                          id={publicacion.ID_publicacion.toString()}
                                          title={publicacion.Titulo}
                                          text={publicacion.Descripcion}
                                          price={publicacion.Precio}
                                          imgUrls={publicacion.imageUrls.length > 0 ? publicacion.imageUrls : ["/Logo.png"]}
                                          hot={publicacion.Hot}
                                          amount={publicacion.Cantidad_disponible}
                                          forceUpdate={getPublicaciones}
                                          router={router}
                                        />
                                    </div>
                                  ))
                                }
                              </div>
                            </div>
                          ):(
                            <div>
                              <div className='text_crear_perfil container d-flex justify-content-between'>
                                <h5 className='text-start' style={{fontWeight: "bold", padding: "25px 0px 16px 24px", margin: 0}}>Crear Publicacion</h5>
                                <button className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '15%', marginTop: '10px'}} onClick={toggleView}>
                                  Ver publicaciones
                                </button>
                              </div>
                              <div className='Crear_publicacion_perfil'>
                                <form  onSubmit={handleCreatePublicacion}>
                                  <input className='form-control' type='text' value={titulo} onChange={(e)=>setTitulo(e.target.value)} placeholder='Titulo'/>
                                  <input className='form-control' type='text' value={descripcion} onChange={(e)=>setDescripcion(e.target.value)} placeholder='Descripcion'/>
                                  <input className='form-control' type="number" value={precio} onChange={(e)=>setPrecio(e.target.valueAsNumber)} placeholder='Precio'/>
                                  <input className='form-control' type='text' value={categoria} onChange={(e)=>setCategoria(e.target.value)} placeholder='Categoria'/>
                                  <input className='form-control' type='number' value={cantidad} onChange={(e)=>setCantidad(e.target.valueAsNumber)} placeholder='Cantidad'/>
                                  <CldUploadButton
                                      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string}
                                      onSuccess={handleSuccessUpload}
                                      className="button_subir_imagen_perfil btn my-upload-button"
                                  >
                                      Subir Imagen
                                  </CldUploadButton>
                                  <button className='button_crear_publicacion_perfil btn' type='submit'>Crear publicacion</button>
                                </form>
                                {error && <p>{error}</p>}
                              </div>

                          </div>
                          )}
                          
                        </div>
                      </div>
                    </>
                  ): (
                    <div>
                      <div style={{outline: "1px solid rgba(0, 0, 0, 0.3)", marginLeft: "12px", padding: 0}}>
                        <div style={{borderBottom: "1px solid rgba(0, 0, 0, 0.3)", padding: "0px"}}> 
                          <h5 className='text-start' style={{fontWeight: "bold", padding: "16px 0px 16px 24px", margin: 0}}>Configuracion de la cuenta</h5>
                        </div>
                        
                      </div>
                    </div>
                  )}
                </div>
            </div>
        </div>
    );
};