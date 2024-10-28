import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css"; // Import CSS

interface Product {
    id: number;
    name: string;
    stock_quantity: number;
    category__name: string;
    supplier__name: string;
}

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

const Dashboard: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [statistics, setStatistics] = useState({
        total_products: 0,
        avg_stock: 0,
    });

    const [filters, setFilters] = useState({
        category: "",
        supplier: "",
        min_stock: "",
        max_stock: "",
    });

    useEffect(() => {
        axios
            .get("http://localhost:8000/api/categories/")
            .then((res) => setCategories(res.data));
        axios
            .get("http://localhost:8000/api/suppliers/")
            .then((res) => setSuppliers(res.data));
    }, []);

    useEffect(() => {
        generateReport();
    }, [filters]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const generateReport = async () => {
        const { category, supplier, min_stock, max_stock } = filters;

        const minStockValue = min_stock === "" ? 0 : parseInt(min_stock, 10);
        const maxStockValue =
            max_stock === "" ? 999999 : parseInt(max_stock, 10);

        try {
            const response = await axios.get(
                "http://localhost:8000/api/reports/products/",
                {
                    params: {
                        category,
                        supplier,
                        min_stock: minStockValue,
                        max_stock: maxStockValue,
                    },
                }
            );

            setFilteredProducts(response.data.products);
            setStatistics(response.data.statistics);
        } catch (error) {
            console.error("Error fetching report:", error);
        }
    };

    return (
        <div className="container">
            <h1>Inventory Dashboard</h1>

            <div className="report-form">
                <h2>Product Report Filters</h2>

                <select
                    name="category"
                    onChange={handleInputChange}
                    value={filters.category}>
                    <option value="">All Categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <select
                    name="supplier"
                    onChange={handleInputChange}
                    value={filters.supplier}>
                    <option value="">All Suppliers</option>
                    {suppliers.map((supplier) => (
                        <option key={supplier.id} value={supplier.id}>
                            {supplier.name}
                        </option>
                    ))}
                </select>

                <input
                    type="number"
                    name="min_stock"
                    placeholder="Min Stock"
                    onChange={handleInputChange}
                    value={filters.min_stock}
                />
                <input
                    type="number"
                    name="max_stock"
                    placeholder="Max Stock"
                    onChange={handleInputChange}
                    value={filters.max_stock}
                />
            </div>

            <div className="report-results">
                <h2>Report Results</h2>
                <p>Total Products: {statistics.total_products}</p>
                <p>Average Stock: {statistics.avg_stock.toFixed(2)}</p>

                <ul>
                    {filteredProducts.map((product) => (
                        <li key={product.id} className="product-item">
                            <span className="product-name">{product.name}</span>
                            {/* Render category and supplier badges */}
                            <span className="badge category-badge">
                                {product.category__name || "No Category"}
                            </span>
                            <span className="badge supplier-badge">
                                {product.supplier__name || "No Supplier"}
                            </span>
                            <span className="stock-quantity">
                                {product.stock_quantity} in stock
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
