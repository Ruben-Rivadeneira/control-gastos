import {
    BarChart3,
    CreditCard,
    Home,
    PlusCircle,
    ShoppingCart
} from 'lucide-react';
import React from 'react';

interface SidebarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'transactions', label: 'Transacciones', icon: CreditCard },
        { id: 'add-transaction', label: 'Registrar Transacción', icon: PlusCircle },
        { id: 'analytics', label: 'Analítica', icon: BarChart3 },
        { id: 'purchase-list', label: 'Lista de Compras', icon: ShoppingCart },
    ];

    return (
        <div className="w-64 bg-white shadow-lg h-full">
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">Control Gastos</h1>
                <p className="text-sm text-gray-600 mt-1">Administrador de gastos financieros</p>
            </div>

            <nav className="mt-6">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id)}
                            className={`w-full flex items-center px-6 py-3 text-left transition-all duration-200 hover:bg-gray-50 ${activeTab === item.id
                                    ? 'text-blue-600 bg-blue-50 border-r-2 border-blue-600'
                                    : 'text-gray-700 hover:text-gray-900'
                                }`}
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;