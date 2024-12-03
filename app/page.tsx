"use client";

import React, { useEffect, useState } from 'react';
import Card_product from './componentes/card_product';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBox, faTrophy, faCreditCard, faHeadphones } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

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
  imageUrls: string[];  // Nueva propiedad que contiene múltiples URLs de imágenes
}

export default function Home() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const { data: session, status } = useSession();

  const fetchPublications = () => {
    fetch(`/api/get_pub_main`)
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
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  return (
    <div className='cuerpo'>
      <div className='d-flex justify-content-center align-items-center'>
        <div className='politicas d-flex justify-content-center align-items-center'>
          <div className='pol d-flex justify-content-center align-items-center'>
            <FontAwesomeIcon className='Icon_policy' icon={faBox} size="3x" />
            <div>
              <h6>Emprendimientos</h6>
              <p>Promociona tus productos</p>
            </div>
          </div>
          <div className="col-auto d-flex align-items-center"><div className="vr"></div></div>
          <div className='pol d-flex justify-content-center align-items-center'>
            <FontAwesomeIcon className='Icon_policy' icon={faTrophy} size="3x" />
            <div>
              <h6>Políticas de garantía</h6>
              <p>Leer más</p>
            </div>
          </div>
          <div className="col-auto d-flex align-items-center"><div className="vr"></div></div>
          <div className='pol d-flex justify-content-center align-items-center'>
            <FontAwesomeIcon className='Icon_policy' icon={faCreditCard} size="3x" />
            <div>
              <h6>Pago seguro</h6>
              <p>Pago a través de MP</p>
            </div>
          </div>
          <div className="col-auto d-flex align-items-center"><div className="vr"></div></div>
          <div className='pol d-flex justify-content-center align-items-center'>
            <FontAwesomeIcon className='Icon_policy' icon={faHeadphones} size="3x" />
            <div>
              <h6>Soporte 24/7</h6>
              <p>Soporte constante</p>
            </div>
          </div>
        </div>
      </div>
      <h1>Bienvenido(a) {session?.user.nombre}</h1>
      <div className='container'>
        <div className='row'>
          {publications.map((product, productIndex) => (
            <div className='col-12 col-sm-6 col-md-3 mb-4' key={productIndex}>
              <Card_product
                hot={product.Hot}
                id={product.ID_publicacion.toString()}
                key={product.ID_publicacion}
                title={product.Titulo}
                text={product.Descripcion}
                price={product.Precio}
                amount={product.Cantidad_disponible}
                imgUrls={product.imageUrls.length > 0 ? product.imageUrls : ["/Logo.png"]}
                email={session?.user.correo || ""}
                id_usuario={product.ID_Usuario}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
