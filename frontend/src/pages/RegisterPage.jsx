import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/user/register/', {
                username,
                email,
                password
            });
            setSuccess('Rejestracja udana! Możesz się teraz zalogować.');
            setError('');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            console.error(err.response?.data);
            if (err.response?.data) {
                const errors = Object.values(err.response.data).flat().join(' ');
                setError(errors || 'Błąd rejestracji.');
            } else {
                setError('Błąd sieci.');
            }
            setSuccess('');
        }
    };

    return (
        <div style={styles.container}>
            <form onSubmit={handleRegister} style={styles.form}>
                <h2 style={styles.title}>Rejestracja</h2>
                <input
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                {success && <p style={styles.success}>{success}</p>}
                <button type="submit" style={styles.button}>Zarejestruj się</button>
                <p style={styles.loginText}>
                    Masz już konto? <a href="/login" style={styles.loginLink}>Zaloguj się</a>
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
        fontSize: '14px',
    },
    success: {
        color: 'lime',
        marginBottom: '10px',
        textAlign: 'center',
        fontSize: '14px',
    },
    loginText: {
        color: 'white',
        marginTop: '15px',
        textAlign: 'center',
        fontSize: '14px',
    },
    loginLink: {
        color: '#ff0000',
        textDecoration: 'none',
    }
};

export default Register;
