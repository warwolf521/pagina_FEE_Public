"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Card_product from '../componentes/card_product';

// Normalizar el término de búsqueda para que no distinga entre tildes y mayúsculas
const normalizeText = (text: string) => {
  return text
    .normalize("NFD") 
    .replace(/[\u0300-\u036f]/g, "") 
    .toLowerCase(); 
};

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

function SearchPageContent() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const searchParams = useSearchParams();
  const query = searchParams.get('q'); // Obtener el término de búsqueda desde la URL

  const fetchSearchResults = (query: string | null) => {
    if (query) {
      const normalizedQuery = normalizeText(query); 

      fetch(`/api/search?q=${normalizedQuery}`)
        .then(response => response.json())
        .then(data => {
          if (data.error) {
            console.error('Error fetching search results:', data.error);
            setPublications([]); // Limpiar publicaciones en caso de error
          } else {
            setPublications(data.data || []); // Actualizar las publicaciones con los resultados de búsqueda
          }
        })
        .catch(error => {
          console.error('Error fetching search results:', error);
          setPublications([]); // Limpiar publicaciones en caso de error
        });
    } else {
      setPublications([]); // Limpiar publicaciones si no hay query
    }
  };

  useEffect(() => {
    fetchSearchResults(query); 
  }, [query]); 

  return (
    <div className="container mt-5">
      <h1>Resultados de la búsqueda</h1>
      <p>Mostrando resultados para: <strong>{query || 'N/A'}</strong></p>
      <div className="row">
        {publications.length > 0 ? (
          publications.map((product, index) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4" key={product.ID_publicacion}>
              <Card_product
                id={product.ID_publicacion.toString()}
                key={product.ID_publicacion}
                title={product.Titulo}
                text={product.Descripcion}
                price={product.Precio}
                email={product.ID_Usuario ? product.ID_Usuario.toString() : ''}
                imgUrls={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
                  ? product.imageUrls 
                  : ["/Logo.png"]}                
                hot={product.Hot}
                amount={product.Cantidad_disponible}
                id_usuario={product.ID_Usuario}//cambio 
              />
            </div>
          ))
        ) : (
          <p>No se encontraron resultados.</p>
        )}
      </div>
    </div>
  );
}
export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}
