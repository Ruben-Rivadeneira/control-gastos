import { BarChart3, PieChart, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTotals, getCategoryTotals, getMonthlyData } from '../../utils/analytics';
import { formatCurrency } from '../../utils/currency';

const Analytics: React.FC = () => {
    const { state } = useApp();
    const [timeRange, setTimeRange] = useState('6months');

    const { income, expenses, net } = calculateTotals(state.transactions);
    const monthlyData = getMonthlyData(state.transactions);
    const categoryTotals = getCategoryTotals(state.transactions);

    const currentMonth = new Date().toISOString().slice(0, 7);
    const currentMonthTransactions = state.transactions.filter(
        t => t.date.startsWith(currentMonth)
    );
    const currentMonthTotals = calculateTotals(currentMonthTransactions);

    const savingsRate = income > 0 ? ((income - expenses) / income * 100) : 0;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Analítica</h1>
                <p className="text-gray-600">Información detallada sobre tus patrones financieros</p>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Tasa de Ahorro</p>
                            <p className={`text-2xl font-bold ${savingsRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {savingsRate.toFixed(1)}%
                            </p>
                        </div>
                        <TrendingUp className="w-8 h-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Este Mes</p>
                            <p className={`text-2xl font-bold ${currentMonthTotals.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency(currentMonthTotals.net)}
                            </p>
                        </div>
                        <BarChart3 className="w-8 h-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Gastos Mensuales Promedio</p>
                            <p className="text-2xl font-bold text-red-600">
                                {formatCurrency(monthlyData.length > 0 ?
                                    monthlyData.reduce((sum, m) => sum + m.expenses, 0) / monthlyData.length : 0
                                )}
                            </p>
                        </div>
                        <TrendingDown className="w-8 h-8 text-red-500" />
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">Total de Transacciones</p>
                            <p className="text-2xl font-bold text-gray-900">{state.transactions.length}</p>
                        </div>
                        <PieChart className="w-8 h-8 text-indigo-500" />
                    </div>
                </div>
            </div>

            {/* Monthly Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Resumen Financiero Mensual</h3>

                {monthlyData.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay datos mensuales disponibles
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-700">Mes</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Ingreso</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Gasto</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">Balance</th>
                                    <th className="text-right py-3 px-4 font-medium text-gray-700">% de Ahorro</th>
                                </tr>
                            </thead>
                            <tbody>
                                {monthlyData.map((month, index) => {
                                    const monthSavingsRate = month.income > 0 ? (month.net / month.income * 100) : 0;

                                    return (
                                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-4 px-4 font-medium text-gray-900">{month.month}</td>
                                            <td className="py-4 px-4 text-right text-green-600 font-medium">
                                                {formatCurrency(month.income)}
                                            </td>
                                            <td className="py-4 px-4 text-right text-red-600 font-medium">
                                                {formatCurrency(month.expenses)}
                                            </td>
                                            <td className={`py-4 px-4 text-right font-bold ${month.net >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {formatCurrency(month.net)}
                                            </td>
                                            <td className={`py-4 px-4 text-right font-medium ${monthSavingsRate >= 0 ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                {monthSavingsRate.toFixed(1)}%
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Categoría de gastos</h3>

                {categoryTotals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No hay datos disponibles
                    </div>
                ) : (
                    <div className="space-y-4">
                        {categoryTotals.map((category, index) => {
                            const percentage = expenses > 0 ? (category.amount / expenses * 100) : 0;
                            const colors = [
                                'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
                                'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
                            ];

                            return (
                                <div key={category.name} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 flex-1">
                                        <div className={`w-4 h-4 rounded-full ${colors[index % colors.length]}`} />
                                        <span className="font-medium text-gray-900">{category.name}</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2 ml-4">
                                            <div
                                                className={`h-2 rounded-full ${colors[index % colors.length]}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="ml-6 text-right">
                                        <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
                                        <p className="text-sm text-gray-500">{percentage.toFixed(1)}%</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Analytics;