import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Register.module.css';

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
        <div className={styles.container}>
            <form onSubmit={handleRegister} className={styles.form}>
                <h2 className={styles.title}>Rejestracja</h2>
    
                <input
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className={styles.input}
                    required
                />
    
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={styles.input}
                    required
                />
    
                <input
                    type="password"
                    placeholder="Hasło"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={styles.input}
                    required
                />
    
                {error && <p className={styles.error}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
    
                <button type="submit" className={styles.button}>
                    Zarejestruj się
                </button>
    
                <p className={styles.loginText}>
                    Masz już konto? <a href="/login" className={styles.loginLink}>Zaloguj się</a>
                </p>
            </form>
        </div>
    );
};


export default Register;
