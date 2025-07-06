import { useState } from 'react'
import AddTransaction from '../views/AddTransaction'
import Analytics from '../views/Analytics'
import CategoriesView from '../views/Categories'
import Dashboard from '../views/dashboard'
import PurchaseList from '../views/PurchaseList'
import Transactions from '../views/Transactions'
import Header from './Header'
import Sidebar from './Sidebar'

const MainLayout = () => {
    const [activeTab, setActiveTab] = useState("transactions")

    const renderTab = () => {
        switch (activeTab) {
            case "dashboard": return <Dashboard />
            case "transactions": return <Transactions />
            case "add-transaction": return <AddTransaction />
            case 'categories': return <CategoriesView />
            case "analytics": return <Analytics />
            case "purchase-list": return <PurchaseList />
            default: return null
        }
    }

    return (
        <div className="flex h-screen">
            <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 flex flex-col bg-gray-50 overflow-y-auto">
                <Header />
                <main className="p-6 flex-1 overflow-y-auto">
                    {renderTab()}
                </main>
            </div>
        </div>
    )
}

export default MainLayout
