import type { LucideIcon } from 'lucide-react';
import React from 'react';

interface StatsCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: 'green' | 'red' | 'blue';
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatsCard: React.FC<StatsCardProps> = ({ title, amount, icon: Icon, color, trend }) => {
  const colorClasses = {
    green: 'from-green-500 to-green-600 text-green-600 bg-green-50',
    red: 'from-red-500 to-red-600 text-red-600 bg-red-50',
    blue: 'from-blue-500 to-blue-600 text-blue-600 bg-blue-50',
  };

  const formatAmount = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-2xl font-bold ${amount < 0 ? 'text-red-600' : `text-${color}-600`}`}>
            {amount < 0 && title === 'Net Balance' ? '-' : ''}
            {formatAmount(amount)}
          </p>
          {trend && (
            <p className={`text-sm mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% desde el último mes
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color].split(' ').slice(2).join(' ')}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color].split(' ')[2]}`} />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;