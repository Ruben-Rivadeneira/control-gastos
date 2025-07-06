import { ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import React from 'react';
import type { Transaction } from '../../types';
import { formatCurrency, formatDate } from '../../utils/currency';

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Transacciones recientes</h3>
        <div className="text-center py-8 text-gray-500">
          No hay datos disponibles. Empieza añadiendo tu primera transacción!
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Transacciones recientes</h3>
        <span className="text-sm text-gray-500">{transactions.length} Transacciones</span>
      </div>

      <div className="space-y-4">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id} 
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-2 rounded-full ${
                transaction.type === 'ingreso' ? 'bg-green-100' : 'bg-red-100'
              }`}>
                {transaction.type === 'ingreso' ? 
                  <ArrowUpRight className="w-4 h-4 text-green-600" /> :
                  <ArrowDownLeft className="w-4 h-4 text-red-600" />
                }
              </div>
              
              <div>
                <p className="font-medium text-gray-900">{transaction.description}</p>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{transaction.category}</span>
                  <span>•</span>
                  <span>{formatDate(transaction.date)}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className={`font-semibold ${
                transaction.type === 'ingreso' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'ingreso' ? '+' : '-'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
