"use client";

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useRouter } from 'next/navigation';

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedTerm = searchTerm.trim();

        if (trimmedTerm) {
            // Redirigir a la página de búsqueda con el término
            router.push(`/search?q=${encodeURIComponent(trimmedTerm)}`);
        }
    };

    return (
        <form className="input-group" onSubmit={handleSearch}>
            <input
                type="text"
                className="round_control form-control"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Buscar publicaciones"
            />
            <button
                className="rounded_button btn btn-light"
                type="submit"
            >
                <FontAwesomeIcon icon={faSearch} />
            </button>
        </form>
    );
}

export default SearchBar;
