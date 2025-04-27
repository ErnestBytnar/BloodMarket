import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username,
                password
            });
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
            navigate('/dashboard');
        } catch (err) {
            setError('Nieprawidłowe dane logowania');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleLogin} style={styles.form}>
                <h2 style={styles.title}>BloodMarket</h2>
                <input
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                {error && <p style={styles.error}>{error}</p>}
                <button type="submit" style={styles.button}>Zaloguj się</button>
                <p style={styles.registerText}>
                    Nie masz konta? <a href="/register" style={styles.registerLink}>Zarejestruj się</a>
                </p>
            </form>
        </div>
    );
};

const styles = {
    container: {
        backgroundColor: '#0d0d0d',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        backgroundColor: '#1a1a1a',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 0 10px #ff0000',
        display: 'flex',
        flexDirection: 'column',
        width: '300px',
    },
    title: {
        color: '#ff0000',
        textAlign: 'center',
        marginBottom: '20px',
        fontFamily: 'monospace',
    },
    input: {
        backgroundColor: '#333',
        border: '1px solid #555',
        padding: '10px',
        marginBottom: '15px',
        borderRadius: '4px',
        color: 'white',
    },
    button: {
        backgroundColor: '#ff0000',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        color: 'white',
        fontWeight: 'bold',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
        textAlign: 'center',
    },
    registerText: {
        color: 'white',
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '14px',
    },
    registerLink: {
        color: '#ff0000',
        textDecoration: 'none',
    }
};

export default Login;
