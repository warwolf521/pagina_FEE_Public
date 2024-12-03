"use client";
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';

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
    email: string;
    id_usuario: number;
};

const Modal_producto = ({ id_modal, id, show, handleClose, title, text, price, imgUrls, amount, email, id_usuario }: ModalProductoProps) => {
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
                                <Link href="/chat" passHref>
                                    <button type="button" className="Modal_producto_boton_carrito btn btn-primary" 
                                            style={{ width: '40%' }}
                                    >
                                        <FontAwesomeIcon icon={faShoppingCart} /> Contacta al vendedor
                                    </button>
                                </Link>
                                <Link href={{ pathname: "/pago-credito", query: {price, id, email} }} passHref>
                                    <button type="button" className="Modal_producto_boton_carrito btn btn-primary" style={{ width: '40%' }}>
                                        <FontAwesomeIcon icon={faShoppingCart} /> Comprar ahora
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={handleClose}>
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal_producto;
