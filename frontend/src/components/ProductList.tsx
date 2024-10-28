import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  description: string;
  stock_quantity: number;
  price: number;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    stock_quantity: 0,
    price: 0.0,
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products from the backend
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/products/');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  // Add a new product
  const addProduct = async () => {
    try {
      await axios.post('http://localhost:8000/api/products/', newProduct);
      fetchProducts(); // Refresh the product list
      setNewProduct({ name: '', description: '', stock_quantity: 0, price: 0.0 });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  // Edit an existing product
  const editProduct = async (product: Product) => {
    try {
      await axios.put(`http://localhost:8000/api/products/${product.id}/`, product);
      fetchProducts(); // Refresh the product list
      setEditingProduct(null); // Clear the editing state
    } catch (error) {
      console.error('Error editing product:', error);
    }
  };

  // Delete a product
  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/products/${id}/`);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  return (
    <div>
      <h1>Product Management</h1>

      <div>
        <h2>{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={editingProduct ? editingProduct.name : newProduct.name}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, name: e.target.value })
              : handleInputChange(e)
          }
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={editingProduct ? editingProduct.description : newProduct.description}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, description: e.target.value })
              : handleInputChange(e)
          }
        />
        <input
          type="number"
          name="stock_quantity"
          placeholder="Stock Quantity"
          value={editingProduct ? editingProduct.stock_quantity : newProduct.stock_quantity}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, stock_quantity: +e.target.value })
              : handleInputChange(e)
          }
        />
        <input
          type="number"
          step="0.01"
          name="price"
          placeholder="Price"
          value={editingProduct ? editingProduct.price : newProduct.price}
          onChange={(e) =>
            editingProduct
              ? setEditingProduct({ ...editingProduct, price: +e.target.value })
              : handleInputChange(e)
          }
        />
        <button onClick={editingProduct ? () => editProduct(editingProduct) : addProduct}>
          {editingProduct ? 'Save Changes' : 'Add Product'}
        </button>
        {editingProduct && <button onClick={() => setEditingProduct(null)}>Cancel</button>}
      </div>

      <h2>All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            {product.name} - {product.stock_quantity} in stock - ${product.price}
            <button onClick={() => setEditingProduct(product)}>Edit</button>
            <button onClick={() => deleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
