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

    useEffect(() => {
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
    }, []);

    return (
        <BootstrapLayout>
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-green-50 to-white px-4 py-10">
                <div className="w-full max-w-5xl rounded-2xl bg-white p-8 shadow-xl">
                    <h1 className="mb-6 text-center text-3xl font-extrabold text-green-600">🍽️ รายการอาหาร</h1>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-green-600"></div>
                            <span className="ml-4 text-lg text-gray-500">กำลังโหลดข้อมูล...</span>
                        </div>
                    ) : foods.length === 0 ? (
                        <p className="text-center text-lg text-gray-400">ไม่มีข้อมูลอาหารในระบบ</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full overflow-hidden rounded-lg border border-gray-300">
                                <thead className="bg-green-100 text-green-800">
                                    <tr>
                                        <th className="px-4 py-3 text-left">ชื่ออาหาร</th>
                                        <th className="px-4 py-3 text-left">หมวดหมู่</th>
                                        <th className="px-4 py-3 text-right">แคลอรี่</th>
                                        <th className="px-4 py-3 text-right">ราคา (บาท)</th>
                                        <th className="px-4 py-3 text-center">วันที่พร้อมเสิร์ฟ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {foods.map((food, index) => (
                                        <tr key={food.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-4 py-3">{food.name}</td>
                                            <td className="px-4 py-3">{food.category}</td>
                                            <td className="px-4 py-3 text-right">{food.calories}</td>
                                            <td className="px-4 py-3 text-right">{food.price.toFixed(2)}</td>
                                            <td className="px-4 py-3 text-center">{new Date(food.available_date).toLocaleDateString('th-TH')}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </BootstrapLayout>
    );
};

export default FoodList;
