export interface Transaction {
  id: string;
  type: 'ingreso' | 'gasto';
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
  userId: string;
}

export interface PurchaseItem {
  id: string;
  name: string;
  price: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: string;
  userId: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  type: 'ingreso' | 'gasto' | 'ambos';
  userId: string
}

export interface MonthlyData {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}