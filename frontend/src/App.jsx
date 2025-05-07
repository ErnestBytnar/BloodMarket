import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";
import AddProductPage from "./pages/AddProductPage"
import ImagePage from './pages/ImagePage';
import PrivateChat from './pages/PrivateChat';
import UserProfile from './pages/UserProfile';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/dashboard" element={<HomePage />} />
                    <Route path="/add" element={<AddProductPage />} />
                    <Route path="/image/:id" element={<ImagePage />} />
                     <Route path="/chat" element={<PrivateChat />} />
                     <Route path="/user" element={<UserProfile />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
