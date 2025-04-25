// Update App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import MainPage from "./pages/MainPage";
import WelcomePage from "./pages/WelcomePage";
import LoggedRoute from "./components/LoggedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage";
import BloodOffersPage from "./pages/BloodOffersPage";
import CreateOfferPage from "./pages/CreateOfferPage";
import MakeTransactionPage from "./pages/MakeTransactionPage";
import TransactionsPage from "./pages/TransactionsPage";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route path="/login" element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                        <Route path="/register" element={<LoggedRoute><RegisterPage /></LoggedRoute>} />
                        <Route path="/" element={<WelcomePage />} />
                        <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
                        <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>} />
                        <Route path="/offers" element={<ProtectedRoute><BloodOffersPage /></ProtectedRoute>} />
                        <Route path="/create-offer" element={<ProtectedRoute><CreateOfferPage /></ProtectedRoute>} />
                        <Route path="/make-transaction/:offerId" element={<ProtectedRoute><MakeTransactionPage /></ProtectedRoute>} />
                        <Route path="/transactions" element={<ProtectedRoute><TransactionsPage /></ProtectedRoute>} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;