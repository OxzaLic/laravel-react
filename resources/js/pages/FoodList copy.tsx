import BootstrapLayout from '@/layouts/BootstrapLayout';
import React, { useEffect, useState } from 'react';

type Food = {
    id: number;
    name: string;
    category: string;
    calories: number;
    price: number;
    available_date: string;
};

const FoodList: React.FC = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Food>>({});
    const [isEditing, setIsEditing] = useState(false);

    // Load data
    const fetchData = () => {
        fetch('/api/food')
            .then((res) => res.json())
            .then((data) => {
                setFoods(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching foods:', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle form changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Save (Add or Edit)
    const handleSubmit = async () => {
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/food/${formData.id}` : '/api/food';

        await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        setFormData({});
        setIsFormOpen(false);
        setIsEditing(false);
        fetchData();
    };

    // Delete
    const handleDelete = async (id: number) => {
        await fetch(`/api/food/${id}`, { method: 'DELETE' });
        fetchData();
    };

    // Open edit modal
    const handleEdit = (food: Food) => {
        setFormData(food);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    return (
        <BootstrapLayout>
            <div className="d-flex justify-content-center container mt-5">
                <div className="w-full max-w-5xl rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="mb-6 text-center text-3xl font-extrabold text-green-600">🍽️ รายการอาหาร</h1>

                    <div className="mb-4 text-right">
                        <button
                            className="btn btn-primary rounded px-4 py-2 text-white hover:bg-green-600"
                            onClick={() => {
                                setIsFormOpen(true);
                                setFormData({});
                                setIsEditing(false);
                            }}
                        >
                            <i className="bi bi-plus-square"></i> เพิ่มอาหาร
                        </button>
                    </div>

                    {loading ? (
                        <p>กำลังโหลดข้อมูล...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full table-auto overflow-hidden rounded-lg border border-gray-300 text-base">
                                <thead className="bg-gray-400 text-gray-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">ชื่ออาหาร</th>
                                        <th className="px-4 py-3 text-left">หมวดหมู่</th>
                                        <th className="px-4 py-3 text-right">แคลอรี่</th>
                                        <th className="px-4 py-3 text-right">ราคา</th>
                                        <th className="px-4 py-3 text-center">วันที่เพิ่ม</th>
                                        <th className="px-4 py-3 text-center">จัดการ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foods.map((food) => (
                                        <tr key={food.id} className="border-t">
                                            <td className="px-4 py-2">{food.name}</td>
                                            <td className="px-4 py-2">{food.category}</td>
                                            <td className="px-4 py-2 text-right">{food.calories}</td>
                                            <td className="px-4 py-2 text-right">{food.price.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-center">{new Date(food.available_date).toLocaleDateString('th-TH')}</td>
                                            <td className="space-x-2 px-4 py-2 text-center">
                                                <button
                                                    onClick={() => handleEdit(food)}
                                                    className="btn btn-warning btn-sm me-2 rounded bg-yellow-400 px-2 py-1 text-white hover:bg-yellow-500"
                                                >
                                                    แก้ไข
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(food.id)}
                                                    className="btn btn-danger btn-sm rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
                                                >
                                                    ลบ
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {isFormOpen && (
                        <div className="bg-opacity-50 fixed inset-0 z-50 mt-3 flex items-center justify-center bg-black">
                            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                                <h2 className="text-text-2 text-green mx-2 mb-6 font-bold">{isEditing ? '🖋 แก้ไขอาหาร' : '+ เพิ่มอาหาร'}</h2>

                                <div className="space-y-5">
                                    <div className="mx-2">
                                        <label htmlFor="name" className="mb-1 block font-semibold text-gray-700"></label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="ชื่ออาหาร"
                                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                        />
                                        <label htmlFor="category" className="mx-2 mb-1 block font-semibold text-gray-700"></label>
                                        <input
                                            id="category"
                                            name="category"
                                            type="text"
                                            placeholder="หมวดหมู่"
                                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            value={formData.category || ''}
                                            onChange={handleChange}
                                        />

                                        <label htmlFor="calories" className="mx-2 mb-1 block font-semibold text-gray-700"></label>
                                        <input
                                            id="calories"
                                            name="calories"
                                            type="number"
                                            placeholder="แคลอรี่"
                                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            value={formData.calories || ''}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="mx-2 mt-3">
                                        <label htmlFor="price" className="mb-1 block font-semibold text-gray-700"></label>
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="ราคา"
                                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            value={formData.price || ''}
                                            onChange={handleChange}
                                        />

                                        <label htmlFor="available_date" className="mx-2 mb-1 block font-semibold text-gray-700"></label>
                                        <input
                                            id="available_date"
                                            name="available_date"
                                            type="date"
                                            className="w-full rounded border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-green-400 focus:outline-none"
                                            value={formData.available_date || ''}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-center mx-2 mt-3">
                                    <button
                                        type="button"
                                        className="btn btn-secondary rounded bg-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-400"
                                        onClick={() => setIsFormOpen(false)}
                                    >
                                        ยกเลิก
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-success mx-2 rounded bg-green-500 px-4 py-2 text-white hover:bg-green-600 "
                                        onClick={handleSubmit}
                                    >
                                        {isEditing ? 'อัปเดต' : 'เพิ่ม'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default FoodList;
