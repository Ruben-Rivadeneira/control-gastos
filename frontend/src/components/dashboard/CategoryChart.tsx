import React from 'react';
import { formatCurrency } from '../../utils/currency';

interface CategoryChartProps {
  data: Array<{ name: string; amount: number }>;
}

const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Categorías de Gastos</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos de gastos disponibles
        </div>
      </div>
    );
  }

  const colors = [
    'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500',
    'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500'
  ];

  const maxAmount = Math.max(...data.map(d => d.amount));
  const total = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Categorías de Gastos</h3>
      
      <div className="space-y-4">
        {data.slice(0, 8).map((category, index) => {
          const percentage = (category.amount / total) * 100;
          
          return (
            <div key={category.name} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{category.name}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900">
                    {formatCurrency(category.amount)}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${colors[index % colors.length]}`}
                  style={{ width: `${(category.amount / maxAmount) * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryChart;