import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Navbar from "./components/Navbar/Navbar";
import MainPage from "./pages/MainPage";
import WelcomePage from "./pages/WelcomePage";
import LoggedRoute from "./components/LoggedRoute";

const App = () => {
    
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Layout />}  >
                        <Route path="/login" element={<LoggedRoute><LoginPage /></LoggedRoute>} />
                        <Route path="/register" element={<LoggedRoute><RegisterPage /> </LoggedRoute>} />
                        <Route path="/" element={< WelcomePage/>} />
                        <Route path="/main" element={<ProtectedRoute><MainPage /></ProtectedRoute>}/>
                        
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App;
