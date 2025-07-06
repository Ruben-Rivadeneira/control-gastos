import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from 'react';
import { get } from '../services/api';
import type { Category, Product, Transaction } from '../types';
import { useAuth } from './AuthContext';

interface AppState {
  transactions: Transaction[];
  purchaseItems: Product[];
  categories: Category[];
}

type AppAction =
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'ADD_PURCHASE_ITEM'; payload: Product }
  | { type: 'DELETE_PURCHASE_ITEM'; payload: string }
  | { type: 'ADD_CATEGORY'; payload: Category }
  | { type: 'UPDATE_CATEGORY'; payload: Category }
  | { type: 'DELETE_CATEGORY'; payload: string }
  | { type: 'LOAD_CATEGORIES'; payload: Category[] }
  | { type: 'LOAD_TRANSACTIONS'; payload: Transaction[] }
  | { type: 'LOAD_DATA'; payload: AppState }
  | { type: 'CLEAR_DATA' };

const initialState: AppState = {
  transactions: [],
  purchaseItems: [],
  categories: [],
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_TRANSACTION':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };
    case 'DELETE_TRANSACTION':
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
      };
    case 'ADD_PURCHASE_ITEM':
      return {
        ...state,
        purchaseItems: [action.payload, ...state.purchaseItems],
      };
    case 'DELETE_PURCHASE_ITEM':
      return {
        ...state,
        purchaseItems: state.purchaseItems.filter(item => item.id !== action.payload),
      };
    case 'ADD_CATEGORY':
      return {
        ...state,
        categories: [...state.categories, action.payload],
      };
    case 'UPDATE_CATEGORY':
      return {
        ...state,
        categories: state.categories.map(cat =>
          cat.id === action.payload.id ? action.payload : cat
        ),
      };
    case 'DELETE_CATEGORY':
      return {
        ...state,
        categories: state.categories.filter(cat => cat.id !== action.payload),
      };
    case 'LOAD_CATEGORIES':
      return {
        ...state,
        categories: action.payload,
      };
    case 'LOAD_TRANSACTIONS':
      return {
        ...state,
        transactions: action.payload,
      };
    case 'LOAD_DATA':
      return action.payload;
    case 'CLEAR_DATA':
      return initialState;
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      if (!user?.id) {
        dispatch({ type: 'CLEAR_DATA' });
        return;
      }

      try {
        const [categories, transactions] = await Promise.all([
          get(`/categories?id=${user.id}`),
          get(`/transactions?id=${user.id}`),
        ]);

        dispatch({ type: 'LOAD_CATEGORIES', payload: categories });
        dispatch({ type: 'LOAD_TRANSACTIONS', payload: transactions });
        console.log('[AppContext] Datos cargados correctamente');
      } catch (error) {
        console.error('[AppContext] Error al cargar datos:', error);
      }
    };

    loadData();
  }, [user]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
