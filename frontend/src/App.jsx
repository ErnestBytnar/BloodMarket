import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import AddProductPage from "./pages/AddProductPage/AddProductPage"
import Layout from "./components/Layout";
import Navbar from "./components/Navbar/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import LoggedRoute from "./components/LoggedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage/AdminPage";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                <Route path="/" element={<Layout />}  >
                    <Route path="/login" element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                    <Route path="/register" element={<LoggedRoute><RegisterPage /> </LoggedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
                    <Route path="/add" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>}/>
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}/>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
