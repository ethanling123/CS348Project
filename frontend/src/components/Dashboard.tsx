import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Product {
  id: number;
  name: string;
  stock_quantity: number;
}

const Dashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [lowStock, setLowStock] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products/');
        setProducts(response.data);

        const lowStockResponse = await axios.get('http://localhost:8000/api/reports/low-stock/');
        setLowStock(lowStockResponse.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Inventory Dashboard</h1>

      <h2>Low Stock Products (Less than 5)</h2>
      {lowStock.length > 0 ? (
        <ul>
          {lowStock.map((product) => (
            <li key={product.id}>
              {product.name} - {product.stock_quantity} left
            </li>
          ))}
        </ul>
      ) : (
        <p>No low stock products</p>
      )}

      <h2>All Products</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name} - {product.stock_quantity} in stock</li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
