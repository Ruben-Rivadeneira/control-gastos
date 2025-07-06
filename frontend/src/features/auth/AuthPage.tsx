import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthPage: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);

    const features = [
        {
            icon: TrendingUp,
            title: 'Tracking de Ingresos y Gastos',
            description: 'Monitorea tu flujo financiero',
        },
        {
            icon: BarChart3,
            title: 'Analitica',
            description: 'Gráficos e información de gastos',
        },
        {
            icon: PieChart,
            title: 'Desglose de categorías',
            description: 'Organización de gastos por categoría',
        },
        
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex">
            {/* Left Side - Features */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-green-600 p-12 flex-col justify-center">
                <div className="max-w-lg">
                    <div className="flex items-center space-x-3 mb-8">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white">Control de Gastos</h1>
                    </div>

                    <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                        Registra tus finanzas
                    </h2>

                    <div className="space-y-6">
                        {features.map((feature, index) => {
                            const Icon = feature.icon;
                            return (
                                <div key={index} className="flex items-start space-x-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
                                        <p className="text-blue-100 text-sm">{feature.description}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Right Side - Auth Forms */}
            <div className="flex-1 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {isLogin ? (
                            <LoginForm onSwitchToRegister={() => setIsLogin(false)} />
                        ) : (
                            <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;