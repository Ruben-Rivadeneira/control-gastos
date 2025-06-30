// src/features/transactions/TransactionList.tsx
import {
    ArrowDownLeft,
    ArrowUpRight,
    Filter,
    Trash2,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { del, get } from '../../services/api'

type Transaction = {
    id: string
    type: 'income' | 'expense'
    amount: number
    date: string
    userId: string
    categoryId: string
    categoryName: string
    description: string
}

const TransactionList: React.FC = () => {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await get('/transactions')
            setTransactions(data)
        }
        fetchTransactions()
    }, [])

    const filtered = transactions.filter((t) => {
        const typeMatch = filter === 'all' || t.type === filter
        const categoryMatch = categoryFilter === 'all' || t.categoryName === categoryFilter
        return typeMatch && categoryMatch
    })

    const categories = Array.from(new Set(transactions.map((t) => t.categoryName)))

    const handleDelete = async (id: string) => {
        if (window.confirm('¿Eliminar esta transacción?')) {
            await del(`/transactions/${id}`)
            setTransactions((prev) => prev.filter((t) => t.id !== id))
        }
    }

    const formatCurrency = (amount: number) =>
        amount.toLocaleString('es-AR', { style: 'currency', currency: 'ARS' })

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        })

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Transacciones</h1>
                <p className="text-gray-600">Visualiza y gestiona tus movimientos</p>
            </div>

            {/* Filtros */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-4 mb-4">
                    <Filter className="w-5 h-5 text-gray-500" />
                    <span className="font-medium text-gray-700">Filtros</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as 'all' | 'income' | 'expense')}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="all">Todos</option>
                            <option value="income">Ingresos</option>
                            <option value="expense">Egresos</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-lg"
                        >
                            <option value="all">Todas</option>
                            {categories.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de transacciones */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                {filtered.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-lg font-medium mb-2">No hay transacciones</div>
                        <p>Agrega una o ajusta los filtros.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {filtered.map((t) => (
                            <div
                                key={t.id}
                                className="p-6 hover:bg-gray-50 transition-colors duration-200"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div
                                            className={`p-3 rounded-full ${t.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                                }`}
                                        >
                                            {t.type === 'income' ? (
                                                <ArrowUpRight className="w-5 h-5 text-green-600" />
                                            ) : (
                                                <ArrowDownLeft className="w-5 h-5 text-red-600" />
                                            )}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">
                                                {t.description}
                                            </h3>
                                            <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                                <span className="px-2 py-1 bg-gray-100 rounded-full">{t.categoryName}</span>
                                                <span>{formatDate(t.date)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                        <div className="text-right">
                                            <p
                                                className={`text-xl font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'
                                                    }`}
                                            >
                                                {t.type === 'income' ? '+' : '-'}
                                                {formatCurrency(t.amount)}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => handleDelete(t.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
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
    )
}

export default TransactionList
