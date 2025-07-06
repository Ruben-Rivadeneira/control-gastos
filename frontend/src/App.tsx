import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import MainLayout from "./layout/MainLayout";
import PrivateRoute from "./views/PrivateRoute";

function App() {
  return /*<MainLayout />*/(
    /*<div className="min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold text-center py-4">Control de Gastos</h1>
      <TransactionManager />
    </div>*/
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={<PrivateRoute><MainLayout /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )

}

export default App