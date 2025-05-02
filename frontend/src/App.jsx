import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage/LoginPage";
import RegisterPage from "./pages/RegisterPage/RegisterPage";
import HomePage from "./pages/HomePage/HomePage";
import AddProductPage from "./pages/AddProductPage/AddProductPage"
import Layout from "./components/Layout";
import Navbar from "./components/Navbar/Navbar";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                <Route path="/" element={<Layout />}  >
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/add" element={<AddProductPage />} />
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
