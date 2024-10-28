import React from "react";
import { Link } from "react-router-dom";

const Navbar: React.FC = () => (
    <nav className="flex justify-center gap-4 p-4 bg-gray-800 rounded-lg shadow-lg">
        <Link to="/dashboard">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Dashboard
            </button>
        </Link>
        <Link to="/products">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Products
            </button>
        </Link>
        <Link to="/suppliers">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Suppliers
            </button>
        </Link>
        <Link to="/categories">
            <button className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">
                Categories
            </button>
        </Link>
    </nav>
);

export default Navbar;
