import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

import AddProductPage from "./pages/AddProductPage/AddproductPage"

import HomePage from "./pages/HomePage/HomePage"
import ImagePage from "./pages/ImagePage/ImagePage"
import LoginPage from "./pages/LoginPage/LoginPage"
import PrivateChat from "./pages/PrivateChat/PrivateChat"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import UserProfile from "./pages/UserProfile/UserProfile"
import ProtectedRoute from "./components/ProtectedRoute";
import LoggedRoute from "./components/LoggedRoute";
import AdminRoute from "./components/AdminRoute";
import AdminPage from "./pages/AdminPage/AdminPage";
import ChatWrapper from"./pages/PrivateChat/PrivateChat";

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/chat/:receiver" element={<PrivateChat />} />
                    <Route path="/login" element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                    <Route path="/register" element={<LoggedRoute><RegisterPage /> </LoggedRoute>} />
                    <Route path="/dashboard" element={<ProtectedRoute><HomePage /></ProtectedRoute>}/>
                    <Route path="/add" element={<ProtectedRoute><AddProductPage /></ProtectedRoute>}/>
                    <Route path="/admin" element={<AdminRoute><AdminPage /></AdminRoute>}/>

                    <Route path="/image/:id" element={<ProtectedRoute><ImagePage /></ProtectedRoute>} />

                     <Route path="/user" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />

                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
