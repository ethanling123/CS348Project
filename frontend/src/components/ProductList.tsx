import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/index.css";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock_quantity: number;
    category: number;
    supplier: number;
}

interface Category {
    id: number;
    name: string;
}

interface Supplier {
    id: number;
    name: string;
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
        name: "",
        description: "",
        price: 0,
        stock_quantity: 0,
        category: 0,
        supplier: 0,
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchSuppliers();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/products/"
            );
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/categories/"
            );
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8000/api/suppliers/"
            );
            setSuppliers(response.data);
        } catch (error) {
            console.error("Error fetching suppliers:", error);
        }
    };

    const handleInputChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        const updatedValue =
            name === "category" || name === "supplier"
                ? parseInt(value)
                : value;

        if (editingProduct) {
            setEditingProduct((prevProduct) =>
                prevProduct ? { ...prevProduct, [name]: updatedValue } : null
            );
        } else {
            setNewProduct((prevProduct) => ({
                ...prevProduct,
                [name]: updatedValue,
            }));
        }
    };

    const addProduct = async () => {
        try {
            await axios.post("http://localhost:8000/api/products/", newProduct);
            setNewProduct({
                name: "",
                description: "",
                price: 0,
                stock_quantity: 0,
                category: 0,
                supplier: 0,
            });
            fetchProducts();
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    const updateProduct = async () => {
        if (!editingProduct) return;
        try {
            await axios.put(
                `http://localhost:8000/api/products/${editingProduct.id}/`,
                editingProduct
            );
            setEditingProduct(null);
            fetchProducts();
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/products/${id}/`);
            fetchProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div>
            <h1>Products</h1>
            {editingProduct ? (
                <div>
                    <h2>Edit Product: {editingProduct.name}</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={editingProduct.name}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={editingProduct.description}
                        onChange={handleInputChange}
                    />
                    <select
                        name="category"
                        value={editingProduct.category}
                        onChange={handleInputChange}>
                        <option value="0">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="supplier"
                        value={editingProduct.supplier}
                        onChange={handleInputChange}>
                        <option value="0">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={editingProduct.price}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="stock_quantity"
                        placeholder="Stock Quantity"
                        value={editingProduct.stock_quantity}
                        onChange={handleInputChange}
                    />
                    <button onClick={updateProduct}>Save Changes</button>
                    <button onClick={() => setEditingProduct(null)}>
                        Cancel Edit
                    </button>
                </div>
            ) : (
                <div>
                    <input
                        type="text"
                        name="name"
                        placeholder="Product Name"
                        value={newProduct.name}
                        onChange={handleInputChange}
                    />
                    <textarea
                        name="description"
                        placeholder="Description"
                        value={newProduct.description}
                        onChange={handleInputChange}
                    />
                    <select
                        name="category"
                        value={newProduct.category}
                        onChange={handleInputChange}>
                        <option value="0">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <select
                        name="supplier"
                        value={newProduct.supplier}
                        onChange={handleInputChange}>
                        <option value="0">Select Supplier</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        name="price"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                    />
                    <input
                        type="number"
                        name="stock_quantity"
                        placeholder="Stock Quantity"
                        value={newProduct.stock_quantity}
                        onChange={handleInputChange}
                    />
                    <button onClick={addProduct}>Add Product</button>
                </div>
            )}

            <h2>All Products</h2>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.stock_quantity} in stock - $
                        {product.price}
                        <button onClick={() => setEditingProduct(product)}>
                            Edit
                        </button>
                        <button onClick={() => deleteProduct(product.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ProductList;
