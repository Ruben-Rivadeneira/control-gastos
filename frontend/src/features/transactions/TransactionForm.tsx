import { Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../services/api';

type Category = {
    id: string;
    name: string;
    type: 'ingreso' | 'gasto';
};

const TransactionForm: React.FC = () => {
    const { user } = useAuth();
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        type: 'gasto' as 'ingreso' | 'gasto',
        amount: '',
        categoryId: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
    });

    useEffect(() => {
        const fetchCategories = async () => {
            if (!user?.id) return;

            try {
                const data = await get(`/categories?id=${user.id}`);
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Respuesta inesperada de categorías:', data);
                }
            } catch (err) {
                console.error('Error al cargar categorías:', err);
            }
        };

        fetchCategories();
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.amount || !formData.categoryId || !formData.description || !user?.id) return;

        await post('/transactions', {
            type: formData.type,
            amount: parseFloat(formData.amount),
            categoryId: formData.categoryId,
            description: formData.description,
            date: formData.date,
            userId: user.id,
        });

        setFormData({
            type: 'gasto',
            amount: '',
            categoryId: '',
            description: '',
            date: new Date().toISOString().split('T')[0],
        });

        alert('Transacción registrada');
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Agregar Transacción</h1>
                <p className="text-gray-600">Registrar un ingreso o egreso</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Tipo */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo</label>
                        <div className="flex space-x-4">
                            {(['ingreso', 'gasto'] as const).map((type) => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => handleInputChange('type', type)}
                                    className={`flex-1 p-4 rounded-lg border-2 ${formData.type === type
                                            ? type === 'ingreso'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 bg-white text-gray-700'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-lg font-semibold">
                                            {type === 'ingreso' ? 'Ingreso' : 'Egreso'}
                                        </div>
                                        <div className="text-sm">
                                            {type === 'ingreso' ? 'Dinero recibido' : 'Gasto o salida'}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Monto */}
                    <div>
                        <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                            Monto
                        </label>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                            <input
                                type="number"
                                step="0.01"
                                id="amount"
                                value={formData.amount}
                                onChange={(e) => handleInputChange('amount', e.target.value)}
                                className="block w-full pl-7 pr-3 py-3 border border-gray-300 rounded-lg"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>

                    {/* Categoría */}
                    <div>
                        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Categoría
                        </label>
                        <select
                            id="category"
                            value={formData.categoryId}
                            onChange={(e) => handleInputChange('categoryId', e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg"
                            required
                        >
                            <option value="">Selecciona una categoría</option>
                            {categories
                                .filter((cat) => cat.type === formData.type)
                                .map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    {/* Descripción */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                            Descripción
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg"
                            placeholder="Ej: sueldo, alquiler, comida..."
                            required
                        />
                    </div>

                    {/* Fecha */}
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                            Fecha
                        </label>
                        <input
                            type="date"
                            id="date"
                            value={formData.date}
                            onChange={(e) => handleInputChange('date', e.target.value)}
                            className="block w-full px-3 py-3 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* Botón */}
                    <button
                        type="submit"
                        className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition ${formData.type === 'ingreso'
                                ? 'bg-green-600 hover:bg-green-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                            }`}
                    >
                        <Plus className="w-5 h-5" />
                        <span>Agregar {formData.type === 'ingreso' ? 'Ingreso' : 'Egreso'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TransactionForm;
