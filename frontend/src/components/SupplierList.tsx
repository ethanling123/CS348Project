import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Supplier {
  id: number;
  name: string;
  contact_info: string;
}

const SupplierList: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [newSupplier, setNewSupplier] = useState<Supplier>({
    id: 0,
    name: '',
    contact_info: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/suppliers/');
      setSuppliers(response.data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    }
  };

  const addSupplier = async () => {
    try {
      await axios.post('http://localhost:8000/api/suppliers/', {
        name: newSupplier.name,
        contact_info: newSupplier.contact_info,
      });
      setNewSupplier({ id: 0, name: '', contact_info: '' });
      fetchSuppliers();
    } catch (error) {
      console.error('Error adding supplier:', error);
    }
  };

  const deleteSupplier = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/api/suppliers/${id}/`);
      fetchSuppliers();
    } catch (error) {
      console.error('Error deleting supplier:', error);
    }
  };

  return (
    <div>
      <h1>Suppliers</h1>
      <input
        type="text"
        placeholder="Supplier Name"
        value={newSupplier.name}
        onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
      />
      <textarea
        placeholder="Contact Info"
        value={newSupplier.contact_info}
        onChange={(e) => setNewSupplier({ ...newSupplier, contact_info: e.target.value })}
      />
      <button onClick={addSupplier}>Add Supplier</button>

      <h2>All Suppliers</h2>
      <ul>
        {suppliers.map((supplier) => (
          <li key={supplier.id}>
            {supplier.name} - {supplier.contact_info}{' '}
            <button onClick={() => deleteSupplier(supplier.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupplierList;
