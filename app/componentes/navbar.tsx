"use client"; // This forces the component to run on the client side

import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaPinterest } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faUser, faCircleUser, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { useSession, signOut } from 'next-auth/react';
import '../globals.css';
import Link from 'next/link';
import SearchBar from './SearchBar';

function CustomNavbar() {
    const { data: session, status } = useSession();
    console.log(session);
    return (
        <Navbar bg="#124261" variant="dark" expand="lg" className="NavBar">
            <div className='w-100'>
                <div className="top_navbar d-flex align-items-center justify-content-between w-100 px-3">
                    <div>
                        <Navbar.Text className="navbar_text text-white">
                            Bienvenido a Feria Estudiantil UdeC.
                        </Navbar.Text>
                    </div>
                    <div>
                        <Nav className="d-flex align-items-center">
                            <Navbar.Text className="navbar_text text-white mr-2">Síguenos:</Navbar.Text>
                            <Nav.Link href="#facebook" className="text-white"><FaFacebook className='Icono' /></Nav.Link>
                            <Nav.Link href="#twitter" className="text-white"><FaTwitter className='Icono' /></Nav.Link>
                            <Nav.Link href="#instagram" className="text-white"><FaInstagram className='Icono' /></Nav.Link>
                            <Nav.Link href="#youtube" className="text-white"><FaYoutube className='Icono' /></Nav.Link>
                            <Nav.Link href="#pinterest" className="text-white"><FaPinterest className='Icono' /></Nav.Link>
                        </Nav>
                    </div>
                </div>
                <div className='bottom_navbar d-flex justify-content-between align-items-center'>
                    <div className="col-md-1 d-flex justify-content-center align-items-center px-4">
                        <Link href="/" passHref>
                            <img className="img-fluid" src="/logo_blanco.png" alt="logo" />
                        </Link>
                    </div>
                    <div className='col-md-4 d-flex align-items-center justify-content-center h-100 mt-3'>
                        <SearchBar />
                        {/*
                        <form className='input-group'>
                            <input type="text" className="round_control form-control" placeholder="Buscar..." />
                            <button className='rounded_button btn btn-light'>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </form>
                        */}
                    </div>
                    <div className='align-items-center col-md-2 d-flex justify-content-center h-100'>
                        <Link href="/chat" passHref>
                            <button className='btn'>
                                <FontAwesomeIcon icon={faComment} color="white"/>
                            </button>
                        </Link>
                        {session ? (
                            <>
                                <Link href="/perfil" passHref>
                                    <button className='btn'>
                                        <FontAwesomeIcon icon={faUser} color="white" />
                                    </button>
                                </Link>
                                <button className='btn' onClick={() => signOut()}>
                                    <FontAwesomeIcon icon={faRightToBracket} color="white" />
                                </button>
                            </>
                        ): (
                            <Link href="/login" passHref>
                                <button className='btn'>
                                    <FontAwesomeIcon icon={faCircleUser} color="white" />
                                </button>
                            </Link>
                        )}                        
                    </div>
                </div>
            </div>
        </Navbar>
    );
}

export default CustomNavbar;
