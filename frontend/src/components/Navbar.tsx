import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

const Navbar: React.FC = () => {
    return (
        <nav style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
            <Link to="/dashboard">
                <button>Home</button>
            </Link>
            <Link to="/products">
                <button>Products</button>
            </Link>
            <Link to="/suppliers">
                <button>Suppliers</button>
            </Link>
            <Link to="/categories">
                <button>Categories</button>
            </Link>
        </nav>
    );
};

export default Navbar;
