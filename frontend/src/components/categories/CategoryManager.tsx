import { Edit2, Plus, Tag, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { get, post } from '../../services/api';
import type { Category } from '../../types';

const CategoryManager: React.FC = () => {
    const { state, dispatch } = useApp();
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        color: '#3B82F6',
        type: 'gasto' as 'ingreso' | 'gasto' | 'ambos',
    });

    const predefinedColors = [
        '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
        '#EC4899', '#14B8A6', '#F97316', '#84CC16', '#6366F1'
    ];

    useEffect(() => {
        const loadCategories = async () => {
            if (!user?.id) return;

            try {
                const result = await get(`/categories?id=${user.id}`);
                dispatch({ type: 'LOAD_CATEGORIES', payload: result });
            } catch (error) {
                console.error('Error loading categories:', error);
            }
        };

        loadCategories();
    }, [user, dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !user) return;

        const newCategory: Category = {
            id: crypto.randomUUID(),
            name: formData.name,
            color: formData.color,
            type: formData.type,
            userId: user.id,
        };

        try {
            await post('/categories', newCategory);
            dispatch({ type: 'ADD_CATEGORY', payload: newCategory });
            resetForm();
        } catch (error) {
            console.error('Error saving category:', error);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', color: '#3B82F6', type: 'gasto' });
        setShowForm(false);
        setEditingCategory(null);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({ name: category.name, color: category.color, type: category.type });
        setShowForm(true);
    };

    const handleDelete = (categoryId: string, categoryName: string) => {
        const isUsed = state.transactions.some(t => t.category === categoryName);
        if (
            isUsed && !window.confirm(`La categoría "${categoryName}" está en uso. ¿Eliminar de todos modos?`) ||
            !isUsed && !window.confirm(`¿Eliminar la categoría "${categoryName}"?`)
        ) return;

        dispatch({ type: 'DELETE_CATEGORY', payload: categoryId });
    };

    const getTypeColor = (type: string) => ({
        ingreso: 'text-green-600 bg-green-100',
        gasto: 'text-red-600 bg-red-100',
        ambos: 'text-blue-600 bg-blue-100',
    }[type] || 'text-gray-600 bg-gray-100');

    const getTypeLabel = (type: string) => ({
        ingreso: 'Ingreso',
        gasto: 'Gasto',
        ambos: 'Ambos',
    }[type] || 'Desconocido');

    const incomeCategories = state.categories.filter(c => c.type === 'ingreso' || c.type === 'ambos');
    const expenseCategories = state.categories.filter(c => c.type === 'gasto' || c.type === 'ambos');

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Categorías</h1>
                    <p className="text-gray-600">Gestiona tus categorías personalizadas</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Añadir categoría</span>
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-xl border p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {editingCategory ? 'Editar categoría' : 'Nueva categoría'}
                    </h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg"
                            placeholder="Nombre"
                            required
                        />
                        <div className="flex space-x-3">
                            {(['ingreso', 'gasto', 'ambos'] as const).map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, type })}
                                    className={`px-3 py-2 rounded-lg border ${formData.type === type ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                                >
                                    {getTypeLabel(type)}
                                </button>
                            ))}
                        </div>
                        <input
                            type="color"
                            value={formData.color}
                            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                            className="w-16 h-10 border rounded"
                        />
                        <div className="flex space-x-3">
                            <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg">
                                {editingCategory ? 'Actualizar' : 'Crear'}
                            </button>
                            <button type="button" onClick={resetForm} className="px-4 py-2 border rounded-lg">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Display categories */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[{ title: 'Ingresos', items: incomeCategories }, { title: 'Gastos', items: expenseCategories }].map(section => (
                    <div key={section.title} className="bg-white rounded-xl border p-6 shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <Tag className="w-5 h-5 text-gray-600" />
                            <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
                        </div>
                        <div className="space-y-2">
                            {section.items.map(category => (
                                <div key={category.id} className="flex justify-between items-center p-2 rounded hover:bg-gray-50">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }} />
                                        <span>{category.name}</span>
                                        <span className={`px-2 py-0.5 rounded text-xs ${getTypeColor(category.type)}`}>{getTypeLabel(category.type)}</span>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button onClick={() => handleEdit(category)} className="text-gray-400 hover:text-blue-600">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(category.id, category.name)} className="text-gray-400 hover:text-red-600">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryManager;
