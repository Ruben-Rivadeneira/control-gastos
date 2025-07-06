import { DollarSign, TrendingDown, TrendingUp } from 'lucide-react';
import React from 'react';
import { useApp } from '../../context/AppContext';
import { calculateTotals, getCategoryTotals, getMonthlyData } from '../../utils/analytics';
import CategoryChart from './CategoryChart';
import MonthlyChart from './MonthlyChart';
import RecentTransactions from './RecentTransactions';
import StatsCard from './StatsCard';

const Dashboard: React.FC = () => {
  const { state } = useApp();
  const { income, expenses, net } = calculateTotals(state.transactions);
  const monthlyData = getMonthlyData(state.transactions);
  const categoryTotals = getCategoryTotals(state.transactions);
  const recentTransactions = state.transactions.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visión General</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Ingresos"
          amount={income}
          icon={TrendingUp}
          color="green"
        />
        <StatsCard
          title="Total Gastos"
          amount={expenses}
          icon={TrendingDown}
          color="red"
        />
        <StatsCard
          title="Balance"
          amount={net}
          icon={DollarSign}
          color={net >= 0 ? 'green' : 'red'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MonthlyChart data={monthlyData} />
        <CategoryChart data={categoryTotals} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={recentTransactions} />
      
    </div>
  );
};

export default Dashboard;