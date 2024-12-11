import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../config/api";

interface Category {
    id: number;
    name: string;
}

const CategoryList: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState("");

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/api/categories/`);
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const addCategory = async () => {
        try {
            await axios.post(`${API_BASE_URL}/api/categories/`, {
                name: newCategory,
            });
            setNewCategory("");
            fetchCategories();
        } catch (error) {
            console.error("Error adding category:", error);
        }
    };

    const deleteCategory = async (id: number) => {
        try {
            await axios.delete(`${API_BASE_URL}/api/categories/${id}/`);
            fetchCategories();
        } catch (error) {
            console.error("Error deleting category:", error);
        }
    };

    return (
        <div>
            <h1>Categories</h1>
            <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="New Category"
            />
            <button onClick={addCategory}>Add Category</button>
            <ul>
                {categories.map((category) => (
                    <li key={category.id}>
                        {category.name}{" "}
                        <button onClick={() => deleteCategory(category.id)}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryList;
