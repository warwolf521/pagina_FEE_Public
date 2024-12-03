"use client"; // This forces the component to run on the client side

import React from 'react';
import '../globals.css';

function Footer() {
    return (
        <footer className="Footer py-2">
            <div className="footer_cont container">
                <div className=" principal_div_foter row justify-content-center align-items-center text-center">
                    {/* Logo a la izquierda y contenido alineado horizontalmente */}
                    <div className="footer_logo_component col-md-2 d-flex justify-content-center">
                        <img className="img-fluid" src="/logo_blanco.png" alt="logo" style={{ maxWidth: '150px' }} />
                    </div>
                    <div className="col-md-8 text-md-start mt-3 mt-md-0">
                        <p className="footer_text_gris mb-1">Servicio al cliente:</p>
                        <p className="footer_contact mb-1">(629) 555-0129</p>
                        <p className="footer_text_gris mb-1">Equipo FEE</p>
                        <p className="footer_text_gris mb-1">Universidad de Concepción</p>
                        <p className="footer_contact mb-1">team_fee@udec.cl</p>
                    </div>
                </div>
                <div className="text-center">
                    <p className="bottom_footer_text">FEE - eCommerce Template © 2024.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
