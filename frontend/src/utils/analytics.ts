import type { MonthlyData, Transaction } from '../types';

export const calculateTotals = (transactions: Transaction[]) => {
    const income = transactions
        .filter(t => t.type === 'ingreso')
        .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
        .filter(t => t.type === 'gasto')
        .reduce((sum, t) => sum + t.amount, 0);

    return {
        income,
        expenses,
        net: income - expenses,
    };
};

export const getMonthlyData = (transactions: Transaction[]): MonthlyData[] => {
    const monthlyMap = new Map<string, { income: number; expenses: number }>();

    transactions.forEach(transaction => {
        const monthKey = new Date(transaction.date).toISOString().slice(0, 7);
        const existing = monthlyMap.get(monthKey) || { income: 0, expenses: 0 };

        if (transaction.type === 'ingreso') {
            existing.income += transaction.amount;
        } else {
            existing.expenses += transaction.amount;
        }

        monthlyMap.set(monthKey, existing);
    });

    return Array.from(monthlyMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .slice(-6) // Last 6 months
        .map(([month, data]) => ({
            month: new Date(month + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            income: data.income,
            expenses: data.expenses,
            net: data.income - data.expenses,
        }));
};

export const getCategoryTotals = (transactions: Transaction[]) => {
    const categoryMap = new Map<string, number>();

    transactions
        .filter(t => t.type === 'gasto')
        .forEach(transaction => {
            const existing = categoryMap.get(transaction.category) || 0;
            categoryMap.set(transaction.category, existing + transaction.amount);
        });

    return Array.from(categoryMap.entries())
        .map(([name, amount]) => ({ name, amount }))
        .sort((a, b) => b.amount - a.amount);
};