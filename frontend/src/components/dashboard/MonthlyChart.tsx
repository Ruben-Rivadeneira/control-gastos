import React from 'react';
import type { MonthlyData } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface MonthlyChartProps {
  data: MonthlyData[];
}

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data }) => {
  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Control Mensual</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          No hay datos disponibles
        </div>
      </div>
    );
  }

  const maxAmount = Math.max(...data.flatMap(d => [d.income, d.expenses]));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Control Mensual</h3>
      
      <div className="space-y-4">
        {data.map((month, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">{month.month}</span>
              <span className={`text-sm font-medium ${month.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(month.net)}
              </span>
            </div>
            
            <div className="space-y-1">
              {/* Income Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-xs text-green-600 w-16">Ingresos</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(month.income / maxAmount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-20 text-right">
                  {formatCurrency(month.income)}
                </span>
              </div>
              
              {/* Expenses Bar */}
              <div className="flex items-center space-x-3">
                <span className="text-xs text-red-600 w-16">Gastos</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(month.expenses / maxAmount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-600 w-20 text-right">
                  {formatCurrency(month.expenses)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyChart;