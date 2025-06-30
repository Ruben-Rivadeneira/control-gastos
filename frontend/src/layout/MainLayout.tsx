// src/layout/MainLayout.tsx
import { useState } from 'react'
import Sidebar from '../components/Sidebar'
import AddTransaction from '../views/AddTransaction'
import Analytics from '../views/Analytics'
import Dashboard from '../views/dashboard'
import PurchaseList from '../views/PurchaseList'
import Transactions from '../views/Transactions'

const MainLayout = () => {
    const [activeTab, setActiveTab] = useState("transactions")

    const renderTab = () => {
        switch (activeTab) {
            case "dashboard": return <Dashboard />
            case "transactions": return <Transactions />
            case "add-transaction": return <AddTransaction />
            case "analytics": return <Analytics />
            case "purchase-list": return <PurchaseList />
            default: return null
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <main className="flex-1 bg-gray-50 p-6 overflow-y-auto">
                {renderTab()}
            </main>
        </div>
    )
}

export default MainLayout
