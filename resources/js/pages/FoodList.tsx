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

type ValidationErrors = {
    [key: string]: string[];
};

const FoodList: React.FC = () => {
    const [foods, setFoods] = useState<Food[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [formData, setFormData] = useState<Partial<Food>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});

    // Load data
    const fetchData = () => {
        setLoading(true);
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
        // ล้าง error ของ field นั้นเวลา user แก้ไข
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Save (Add or Edit)
    const handleSubmit = async () => {
        setErrors({}); // reset errors
        // แปลง calories, price ให้เป็นตัวเลขก่อนส่ง (ถ้ามี)
        const payload = {
            ...formData,
            calories: formData.calories !== undefined ? Number(formData.calories) : undefined,
            price: formData.price !== undefined ? Number(formData.price) : undefined,
        };

        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `/api/food/${formData.id}` : '/api/food';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                if (response.status === 422) {
                    // Validation error from Laravel
                    const data = await response.json();
                    setErrors(data.errors || {});
                } else {
                    const data = await response.json();
                    alert(data.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
                }
                return;
            }

            // สำเร็จ
            setFormData({});
            setIsFormOpen(false);
            setIsEditing(false);
            fetchData();
        } catch (err) {
            console.error('Fetch error:', err);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    // Delete
    const handleDelete = async (id: number) => {
        if (!window.confirm('ยืนยันการลบอาหารรายการนี้หรือไม่?')) return;

        try {
            const response = await fetch(`/api/food/${id}`, { method: 'DELETE' });
            if (!response.ok) {
                const data = await response.json();
                alert(data.message || 'เกิดข้อผิดพลาดในการลบ');
                return;
            }
            fetchData();
        } catch (err) {
            console.error('Delete error:', err);
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    // Open edit modal
    const handleEdit = (food: Food) => {
        setFormData(food);
        setIsEditing(true);
        setErrors({});
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
                                setErrors({});
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
                        <div className="bg-opacity-50 bg-opacity-50 fixed inset-0 z-50 mt-3 flex items-center justify-center bg-black">
                            <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg">
                                <h2 className="text-text-2 text-green mx-2 mb-6 font-bold">{isEditing ? '🖋 แก้ไขอาหาร' : '+ เพิ่มอาหาร'}</h2>

                                <div className="space-y-5">
                                    <div className="mx-2">
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            placeholder="ชื่ออาหาร"
                                            className={`w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none ${
                                                errors.name ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
                                            }`}
                                            value={formData.name || ''}
                                            onChange={handleChange}
                                        />
                                        {errors.name && <p className="mx-2 mt-1 text-sm text-red-600">{errors.name.join(', ')}</p>}

                                        <input
                                            id="category"
                                            name="category"
                                            type="text"
                                            placeholder="หมวดหมู่"
                                            className={`mx-2 mt-3 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none ${
                                                errors.category ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
                                            }`}
                                            value={formData.category || ''}
                                            onChange={handleChange}
                                        />
                                        {errors.category && <p className="mx-2 mt-1 text-sm text-red-600">{errors.category.join(', ')}</p>}

                                        <input
                                            id="calories"
                                            name="calories"
                                            type="number"
                                            placeholder="แคลอรี่"
                                            className={`mt-3 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none ${
                                                errors.calories ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
                                            }`}
                                            value={formData.calories !== undefined ? formData.calories : ''}
                                            onChange={handleChange}
                                        />
                                        {errors.calories && <p className="mx-2 mt-1 text-sm text-red-600">{errors.calories.join(', ')}</p>}
                                    </div>

                                    <div className="mx-2 ">
                                        <input
                                            id="price"
                                            name="price"
                                            type="number"
                                            placeholder="ราคา"
                                            className={`w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none${
                                                errors.price ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
                                            }`}
                                            value={formData.price !== undefined ? formData.price : ''}
                                            onChange={handleChange}
                                        />
                                        {errors.price && <p className="mx-2 mt-1 text-sm text-red-600">{errors.price.join(', ')}</p>}

                                        <input
                                            id="available_date"
                                            name="available_date"
                                            type="date"
                                            className={`mx-2 mt-3 w-full rounded border px-3 py-2 focus:ring-2 focus:outline-none ${
                                                errors.available_date ? 'border-red-500 focus:ring-red-400' : 'border-gray-300 focus:ring-green-400'
                                            }`}
                                            value={formData.available_date || ''}
                                            onChange={handleChange}
                                        />
                                        {errors.available_date && (
                                            <p className="mx-2 mt-1 text-sm text-red-600">{errors.available_date.join(', ')}</p>
                                        )}
                                    </div>
                                    <div className="mx-2 mt-3 flex justify-end gap-2">
                                        <button
                                            className="btn btn-secondary mx-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700 mb-3"
                                            onClick={() => {
                                                setFormData({});
                                                setIsFormOpen(false);
                                                setIsEditing(false);
                                                setErrors({});
                                            }}
                                        >
                                            ยกเลิก
                                        </button>

                                        <button
                                            className="btn btn-success rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700 mb-3"
                                            onClick={handleSubmit}
                                        >
                                            {isEditing ? 'บันทึก' : 'เพิ่ม'}
                                        </button>
                                    </div>
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
