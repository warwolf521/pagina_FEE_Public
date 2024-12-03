"use client";
import React, { useEffect, useState }  from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
import { Form } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { z } from 'zod';


type ModalProductoProps = {
    id_modal: string;
    id: string; // Identificador único para evitar conflictos de carrusel
    show: boolean;
    handleClose: () => void;
    title: string;
    text: string;
    price: number;
    imgUrls: string[];
    amount: number;
    forceUpdate: () => void;
    router: ReturnType<typeof useRouter>;
};

const publicacionSchema=  z.object({
    title: z.string().min(2,{message: "titulo invalido"}),
    descripcion: z.string().min(10,{message: "descripcion invalida"}).max(165,{message: "descripcion invalida"}),
    precio: z.number().nonnegative(),
    cantidad: z.number().nonnegative()
})

const Modal_producto_edit = ({ id_modal, id, show, handleClose, title, text, price, imgUrls, amount, forceUpdate, router }: ModalProductoProps) => {
    const[edit,setEdit] = useState(false);
    
    const toggleEdit = () => setEdit(true);
    const toggleView = () => setEdit(false);

    const[titulo,setTitulo] =useState(title);
    const[descripcion, setDescripcion] = useState(text);
    const[cantidad,setCantidad] = useState(amount);
    const[precio, setPrecio] = useState(price);
    const [error, setError] = useState<string | number | null>(null);


    const handleEditPublicacion = async (e: React.FormEvent)  =>{
        e.preventDefault();
        const result = publicacionSchema.safeParse({title: titulo, descripcion: descripcion, precio: precio, cantidad: cantidad});
        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }else{
            setError(null);
        }
        if(id == null){
            setError("No hay id");
            return;
        }
        try{
            const response = await fetch(`/api/edit_publicacion`,{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id: id,
                titulo: titulo,
                descripcion: descripcion,
                precio: precio,
                cantidad: cantidad
              })
            })
            if (!response.ok) {
              throw new Error(`Update failed: ${response.status} ${response.statusText}`);
            }
            alert('Publicacion actualizada con exito');
            forceUpdate();
            handleClose();  
          }catch(error){
            setError("Error al actualizar la publicacion");
            console.log(error);
          } 
    }
    const handdleDeletePublicacion = async () =>{
        try{
            const response = await fetch(`/api/delete_publicacion`,{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                    id: id,
                  })
            })
            if (!response.ok) {
                throw new Error(`Update failed: ${response.status} ${response.statusText}`);
            }
            forceUpdate();
            handleClose();
        }catch(error){
            setError("error al eliminar la publicacion")
            console.log(error);
        }

    }

    if (!show) return null;

    return (
        <div className="custom-modal modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }} role="dialog">
            <div className="modal-dialog modal-dialog-centered" role="document" style={{ maxWidth: '800px' }}>
                <div className="modal-content" style={{ width: '100%' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{title}</h5>
                        <button type="button" className="btn-close" onClick={handleClose}></button>
                    </div>
                    <div className="modal-body d-flex align-items-start">
                        {edit?(
                            <div className='w-100'>
                                <form  onSubmit={handleEditPublicacion}>
                                    <div className='form_edit_publicacion container d-flex justify-content-between align-items-center'>
                                        <h6>Nombre:</h6>
                                        <input type='text' className='form-control' value={titulo} onChange={(e)=>setTitulo(e.target.value)}/>
                                    </div>
                                    <div className='form_edit_publicacion container d-flex justify-content-between align-items-center'>
                                        <h6>Descripcion:</h6>
                                        <input type='text' className='form-control' value={descripcion} onChange={(e)=>setDescripcion(e.target.value)}/>
                                    </div>
                                    <div className='form_edit_publicacion container d-flex justify-content-between align-items-center'>
                                        <h6>Cantidad:</h6>
                                        <input type='number' className='form-control' value={cantidad} onChange={(e)=>setCantidad(e.target.valueAsNumber)}/>
                                    </div>
                                    <div className='form_edit_publicacion container d-flex justify-content-between align-items-center'>
                                        <h6>Precio</h6>
                                        <input type='number' className='form-control' value={precio} onChange={(e)=>setPrecio(e.target.valueAsNumber)}/>
                                    </div>
                                    <div className='mb-5 container d-flex justify-content-between'>
                                        <button className='form_edit_publicacion-button_confirm btn' type="submit">Confirmar</button>
                                        <button className='form_edit_publicacion-button_cancel btn' onClick={toggleView} type='submit'>Cancelar</button>
                                    </div>
                                </form>
                                {error && <p>{error}</p>}
                            </div>
                        ):(
                            <div className="modal-body d-flex align-items-start">
                                {/* Contenedor del Carrusel de Imágenes */}
                                {imgUrls.length > 0 ? (
                                    <div id={`carousel-${id_modal}`} className="carousel slide me-3" data-bs-ride="carousel" style={{ width: '50%' }}>
                                        <div className="carousel-inner">
                                            {imgUrls.map((url, index) => (
                                                <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={index}>
                                                    <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                                                        <Image
                                                            src={url}
                                                            alt={`${title} - Imagen ${index + 1}`}
                                                            className="d-block w-100"
                                                            width={800}
                                                            height={400}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                            }}
                                                            priority={index === 0}
                                                        />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel-${id_modal}`} data-bs-slide="prev">
                                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Anterior</span>
                                        </button>
                                        <button className="carousel-control-next" type="button" data-bs-target={`#carousel-${id_modal}`} data-bs-slide="next">
                                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span className="visually-hidden">Siguiente</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div style={{ width: '100%', height: '300px', overflow: 'hidden' }}>
                                        <Image
                                            src="/Logo.png"
                                            alt="Imagen no disponible"
                                            className="d-block w-100"
                                            width={400}
                                            height={300}
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                                objectPosition: 'center',
                                            }}
                                        />
                                    </div>
                                )}

                                {/* Información del Producto */}
                                <div className='Modal_Producto_texto d-flex flex-column justify-content-between' style={{ flex: 1, paddingLeft: '20px' }}>
                                    <div>
                                        <div className='modal_precio'>
                                            <p><strong>Precio:</strong> {price}$</p>
                                        </div>
                                        <div>
                                            <h6><strong>Cantidad disponible:</strong> {amount}</h6>
                                        </div>
                                        <hr style={{ border: '0.5px solid #e0e0e0', width: '100%' }} />
                                        <div className='modal_info'>
                                            <h5>Información del Producto</h5>
                                            <p>{text}</p>
                                        </div>
                                    </div>
                                    <div className="mt-3">
                                        <button type="button" className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '40%' }} onClick={toggleEdit}>
                                            <FontAwesomeIcon icon={faShoppingCart} /> Editar Producto
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="modal-footer">
                        <button type='button' className='btn btn-danger' onClick={handdleDeletePublicacion}>
                            Eliminar Publicacion
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal_producto_edit;
