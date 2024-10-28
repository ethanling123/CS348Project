import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import ProductList from "./components/ProductList";
import CategoryList from "./components/CategoryList";
import SupplierList from "./components/SupplierList";
import Navbar from "./components/Navbar";

const App: React.FC = () => {
    return (
        <div>
            <Navbar /> {/* Navbar will always be visible */}
            <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/categories" element={<CategoryList />} />
                <Route path="/suppliers" element={<SupplierList />} />
            </Routes>
        </div>
    );
};

export default App;
