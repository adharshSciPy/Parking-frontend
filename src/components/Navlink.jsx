import React from 'react';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Navlink = ({ link }) => {
    const location = useLocation();

    return (
        <Link to={link.url} className={`rounded-full p-1 text-sm hover:text-opacity-50 ${location.pathname === link.url ? 'bg-blue-400 text-md px-3 text-white hover:text-opacity-80' : 'hover:text-gray-900'}`}>
            {link.title}
        </Link>
    );
};

export default Navlink;
