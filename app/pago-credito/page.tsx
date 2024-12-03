"use client";

import React, {HTMLInputTypeAttribute, useState, Suspense, useEffect} from "react";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';

function Pago() {
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const searchParams = useSearchParams();
  const price = searchParams.get("price");

  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setFormData((prev) => ({ ...prev, [name]: value}));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const ID_publicacion = searchParams.get("id");
    const email = searchParams.get("email");

    try {
      const response = await fetch("/api/realizar-compra", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ID_publicacion, email})
      });

      if (response.ok) {
        setModalMessage("Compra exitosa")
        //alert("Compra exitosa y cantidad actualizada en inventario.");
      } else {
        const errorData = await response.json();
        //alert(`Error: ${errorData.error}`);
        setModalMessage(`Error: ${errorData.error}`)
      }
      setShowModal(true);
    } catch (error) {
      console.error("Error al procesar pago:", error);
      alert("Ocurrió un error durante el pago. Por favor, inténtelo nuevamente");
    }
  };

  const closeModal = () => setShowModal(false);

  return (
    <div style={{width: '100%', maxWidth: '500px', margin: '0 auto', padding: '20px'}}>
      <h1 style={{textAlign: 'center'}}>Pago</h1>
      <h4 style={{textAlign: 'center'}}>Precio: ${price}</h4>
      <form onSubmit={handleSubmit}>

        {/* Nombre */}
        <div style={{marginBottom: '15px'}}>
          <label htmlFor="cardName" style={{display: 'block', marginBottom: '5px'}}>
            Nombre
          </label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            placeholder="Ingrese nombre en tarjeta"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            autoComplete="off"
            required
            title="Por favor llenar campo"
          />
        </div>

        { /* Numero tarjeta */}
        <div style={{marginBottom: '15px'}}>
          <label htmlFor="cardNumber" style={{display: 'block', marginBottom: '5px'}}>
            Número tarjeta
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            onInvalid={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity(
                "Número inválido"
              );
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity("");
            }}
            placeholder="Ingrese número tarjeta"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ccc',
              borderRadius: '5px'
            }}
            autoComplete="off"
            required
            title="Por favor llenar campo"
            pattern="\d{16}|\d{4} \d{4} \d{4} \d{4}"
          />
        </div>

        {/* Fecha de caducidad */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="expiryDate" style={{ display: 'block', marginBottom: '5px' }}>
            Fecha de caducidad (MM/AA)
          </label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            onInvalid={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity(
                "Formato inválido"
              );
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity("");
            }}
            placeholder="MM/AA"
            style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '5px',
            }}
            autoComplete="off"
            required
            title="Por favor llenar campo"
            pattern="\d{2}/\d{2}"
          />
        </div>

        {/* CVV */}
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="cvv" style={{ display: 'block', marginBottom: '5px' }}>
            CVV
          </label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            onInvalid={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity(
                "Valor inválido"
              );
            }}
            onInput={(e) => {
              const input = e.target as HTMLInputElement;
              input.setCustomValidity("");
            }}
            placeholder="Ingrese CVV"
            style={{
                width: '100%',
                padding: '10px',
                fontSize: '14px',
                border: '1px solid #ccc',
                borderRadius: '5px',
            }}
            autoComplete="off"
            required
            title="Por favor llenar campo"
            pattern="\d{3}"
          />
        </div>

        {/* Boton pago */}
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#063a62',
            color: 'white',
            fontSize: '16px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Pagar
        </button>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>{modalMessage}</p>
            <Link href="/" passHref>
              <button style={{backgroundColor: '#063a62'}}>
                Finalizar
              </button>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 5px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
          max-width: 90%;
          width: 400px
        }
        .modal-content button {
          margin-top: 10px;
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }
        .modal-content button:hover {
          background: #0056b3;
        }
      `}</style>

    </div>
  );
}

export default function pagoCredito() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Pago />
    </Suspense>
  );
}
