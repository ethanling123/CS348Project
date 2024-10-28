import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface LowStockProduct {
  name: string;
  stock_quantity: number;
}

const Report: React.FC = () => {
  const [lowStockProducts, setLowStockProducts] = useState<LowStockProduct[]>([]);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    const response = await axios.get('http://localhost:8000/api/reports/low-stock/');
    setLowStockProducts(response.data);
  };

  return (
    <div>
      <h1>Low Stock Report</h1>
      <ul>
        {lowStockProducts.map((product, index) => (
          <li key={index}>
            {product.name} - {product.stock_quantity} in stock
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Report;
