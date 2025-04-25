import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";



const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    passwordRep: ''
  });

  const [formErrors, setFormErrors] = useState({
    username: '',
    email: '',
    password: '',
    passwordRep: ''
  });

  const updateField = e => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    // Czyść błąd przy zmianie pola
    setFormErrors({
      ...formErrors,
      [e.target.name]: ''
    });
    setError(null);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) return "Email jest wymagany";
        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)) {
          return "Nieprawidłowy adres email";
        }
        return '';

      case 'username':
        if (!value) return "Nazwa jest wymagana";
        if (!/^[a-zA-Z0-9._-]{2,20}$/i.test(value)) {
          return "Niepoprawna nazwa użytkownika (2-20 znaków)";
        }
        return '';

      case 'password':
        if (!value) return "Hasło jest wymagane";
        if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(value)) {
          return "Hasło wymaga 8 znaków, w tym dużej i małej litery, cyfry i znaku specjalnego";
        }
        return '';

      case 'passwordRep':
        if (!value) return "Powtórz hasło";
        if (value !== form.password) return "Hasła nie są identyczne";
        return '';

      default:
        return '';
    }
  };

  const validateForm = () => {
    const errors = {
      email: validateField('email', form.email),
      username: validateField('username', form.username),
      password: validateField('password', form.password),
      passwordRep: validateField('passwordRep', form.passwordRep)
    };

    setFormErrors(errors);

    return !Object.values(errors).some(error => error !== '');
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      await registerUser(form.username, form.email, form.password);
      alert("Rejestracja zakończona sukcesem!");
      navigate('/login');
    } catch (error) {
      if (error.response && error.response.data) {
        // Obsługa błędów z backendu
        const backendErrors = error.response.data;

        const newErrors = {};
        if (backendErrors.username) newErrors.username = backendErrors.username.join(' ');
        if (backendErrors.email) newErrors.email = backendErrors.email.join(' ');
        if (backendErrors.password) newErrors.password = backendErrors.password.join(' ');

        setFormErrors(prev => ({ ...prev, ...newErrors }));

        setError("Popraw błędy w formularzu");
      } else {
        setError(error.message || "Wystąpił błąd podczas rejestracji");
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Nazwa użytkownika"
            value={form.username}
            onChange={updateField}
            style={{ width: '100%', padding: '8px' }}
          />
          {formErrors.username && <p style={{ color: "red", margin: '5px 0 0', fontSize: '0.9em' }}>{formErrors.username}</p>}
        </div>

        <div>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={updateField}
            style={{ width: '100%', padding: '8px' }}
          />
          {formErrors.email && <p style={{ color: "red", margin: '5px 0 0', fontSize: '0.9em' }}>{formErrors.email}</p>}
        </div>

        <div>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Hasło"
            value={form.password}
            onChange={updateField}
            style={{ width: '100%', padding: '8px' }}
          />
          {formErrors.password && <p style={{ color: "red", margin: '5px 0 0', fontSize: '0.9em' }}>{formErrors.password}</p>}
        </div>

        <div>
          <input
            id="passwordRep"
            name="passwordRep"
            type="password"
            placeholder="Powtórz hasło"
            value={form.passwordRep}
            onChange={updateField}
            style={{ width: '100%', padding: '8px' }}
          />
          {formErrors.passwordRep && <p style={{ color: "red", margin: '5px 0 0', fontSize: '0.9em' }}>{formErrors.passwordRep}</p>}
        </div>

        <div style={{ fontSize: '0.8em', color: '#666' }}>
          <p>Wymagania hasła:</p>
          <ul>
            <li>Minimum 8 znaków</li>
            <li>Przynajmniej jedna duża litera</li>
            <li>Przynajmniej jedna mała litera</li>
            <li>Przynajmniej jedna cyfra</li>
            <li>Przynajmniej jeden znak specjalny (@$!%*?&)</li>
          </ul>
        </div>

        {error && <p style={{ color: "red", textAlign: 'center' }}>{error}</p>}

        <button
          type="submit"
          style={{
            padding: '10px',
            backgroundColor: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Zarejestruj
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;