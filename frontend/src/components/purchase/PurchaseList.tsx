/*import { AlertCircle, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { get } from '../../services/api';
import type { Product } from '../../types';
import { formatCurrency } from '../../utils/currency';

const PurchaseList: React.FC = () => {
    const { state, dispatch } = useApp();
    const { state: authState } = useAuth();

    const [products, setProducts] = useState<Product[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [notes, setNotes] = useState('');

    const totalAmount = state.purchaseItems.reduce((sum, item) => sum + item.price, 0);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await get('/products');
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    console.error('Respuesta inesperada al cargar productos:', data);
                }
            } catch (error) {
                console.error('Error al obtener productos:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const product = products.find(p => p.id === selectedProductId);
        if (!product || !authState.user) return;

        const purchaseItem: Product = {
            id: crypto.randomUUID(),
            name: product.name,
            price: product.price,
            category: product.category,
            userId: authState.user.id,
        };

        dispatch({ type: 'ADD_PURCHASE_ITEM', payload: purchaseItem });

        // Reset
        setSelectedProductId('');
        setPriority('medium');
        setNotes('');
        setShowForm(false);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('¿Eliminar este ítem de la lista de compras?')) {
            dispatch({ type: 'DELETE_PURCHASE_ITEM', payload: id });
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'text-red-600 bg-red-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'low': return 'text-green-600 bg-green-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Lista de Compras</h1>
                    <p className="text-gray-600">Selecciona productos para comprar</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                    <Plus className="w-5 h-5" />
                    <span>Añadir Producto</span>
                </button>
            </div>

            {/* Total Summary *//*}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-medium">Total a Comprar</h2>
                        <p className="text-3xl font-bold">{formatCurrency(totalAmount)}</p>
                        <p className="text-sm opacity-80">{state.purchaseItems.length} productos</p>
                    </div>
                    <ShoppingCart className="w-12 h-12 opacity-80" />
                </div>
            </div>

            {/* Formulario *//*}
            {showForm && (
                <div className="bg-white border rounded-xl p-6 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Nuevo ítem</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="product" className="block text-sm font-medium text-gray-700 mb-2">Producto</label>
                                <select
                                    id="product"
                                    value={selectedProductId}
                                    onChange={(e) => setSelectedProductId(e.target.value)}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                                    required
                                >
                                    <option value="">Selecciona un producto</option>
                                    {products.map(p => (
                                        <option key={p.id} value={p.id}>
                                            {p.name} – {formatCurrency(p.price)}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">Prioridad</label>
                                <select
                                    id="priority"
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                                >
                                    <option value="low">Baja</option>
                                    <option value="medium">Media</option>
                                    <option value="high">Alta</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notas</label>
                            <textarea
                                id="notes"
                                rows={3}
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                                placeholder="Información adicional"
                            />
                        </div>

                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
                            >
                                Añadir a Lista
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Compras *//*}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {state.purchaseItems.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <div className="text-lg font-medium mb-2">Sin productos aún</div>
                        <p>Añade productos de tu lista de deseos.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {state.purchaseItems.map((item) => (
                            <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-3 mb-1">
                                            <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(item.priority)}`}>
                                                {item.priority}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500 space-x-4">
                                            <span className="bg-gray-100 px-2 py-1 rounded-full">{item.category}</span>
                                            {item.priority === 'high' && (
                                                <span className="text-red-600 inline-flex items-center space-x-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    <span>Prioridad Alta</span>
                                                </span>
                                            )}
                                        </div>
                                        {item.notes && (
                                            <p className="text-sm text-gray-600 mt-2">{item.notes}</p>
                                        )}
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p className="text-xl font-bold text-gray-900">{formatCurrency(item.price)}</p>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PurchaseList;*/
