import { LogOut, User } from 'lucide-react';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Header: React.FC = () => {
    const { user, logout } = useAuth();

    const handleLogout = () => {
        if (window.confirm('Estás seguro que quieres salir?')) {
            logout();
        }
    };

    return (
        <header className="bg-white border-b border-gray-200 px-8 py-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Bienvenido, {user?.name}!</h1>
                    <p className="text-gray-600 text-sm">Tu vista general!</p>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="text-sm">
                            <p className="font-medium text-gray-900">{user?.name}</p>
                            <p className="text-gray-500">{user?.email}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-all duration-200"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-medium">Salir</span>
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;