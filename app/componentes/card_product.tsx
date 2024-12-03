"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import '../globals.css';
import Modal_producto from './modal_producto';

type CardProductProps = {
    id: string; // Identificador único para evitar conflictos de carrusel
    title: string;
    text: string;
    price: number;
    imgUrls: string[];
    hot: number; // Determina si la publicacion es un anuncio
    amount: number; // Cantidad de producto
    email: string; // Correo usuario
    id_usuario: number; // id usuario
};

function Card_product({ id, title, text, price, imgUrls, hot, amount, email, id_usuario }: CardProductProps) {
    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    return (
        <div>
            <div onClick={handleShowModal} className={`Card_producto card ${hot ? 'ad' : ''}`} style={{ width: '18rem', cursor: 'pointer' }}>
                <div style={{ position: 'relative' }}>
                    {hot ? <span className="badge badge-warning text-end" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 1, color: "red" }}>Ad</span> : null}
                    {imgUrls.length > 0 ? (
                        <Image
                            src={imgUrls[0]} // Mostrar solo la primera imagen
                            alt={`Imagen principal de ${title}`}
                            className="Card_image card-img-top d-block w-100"
                            width={288} // Ajuste del ancho de la imagen
                            height={200} // Ajuste de la altura de la imagen
                            style={{ objectFit: 'cover' }} // Cambiar a 'cover' para llenar el espacio
                            priority // Añadir priority a la primera imagen
                        />
                    ) : (
                        <Image
                            src="/Logo.png"
                            alt="Imagen no disponible"
                            className="Card_image card-img-top d-block w-100"
                            width={288}
                            height={200}
                            style={{ objectFit: 'cover' }}
                        />
                    )}
                </div>
                <div className="card-body">
                    <h4 className="card-title">{title}</h4>
                    <p className="Card_producto_texto card-text">{text}</p>
                    <p className="Card_producto_precio card-text">{price}$</p>
                </div>
            </div>
            <Modal_producto
                id_modal={`modal-${id}`} // Pasar un identificador único al modal
                id={id}
                show={showModal}
                handleClose={handleCloseModal}
                title={title}
                text={text}
                price={price}
                imgUrls={imgUrls} // Pasar el array de URLs al modal
                amount={amount}
                email={email}
                id_usuario={id_usuario}
            />
        </div>
    );
}

export default Card_product;
