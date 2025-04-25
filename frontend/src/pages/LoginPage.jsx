import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import styled from "styled-components";

// Styled components dla lepszego wyglądu
const LoginContainer = styled.div`
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  color: #d32f2f;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;

  &:focus {
    border-color: #d32f2f;
    outline: none;
  }
`;

const Button = styled.button`
  padding: 12px;
  background-color: #d32f2f;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #b71c1c;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #d32f2f;
  text-align: center;
  margin: 0.5rem 0;
`;

const PasswordRequirements = styled.div`
  font-size: 0.8rem;
  color: #666;
  margin-top: -0.5rem;
  margin-bottom: 0.5rem;
`;

const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        username: '',
        password: '',
    });

    const updateField = e => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
        setError(null); // Czyść błąd przy zmianie danych
    };

    const validate = form => {
        if(!form.username) {
            return "Nazwa użytkownika jest wymagana";
        }

        if(!form.password) {
            return "Hasło jest wymagane";
        }

        return null;
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const errorMsg = validate(form);

        if(errorMsg) {
            setError(errorMsg);
            return;
        }

        setLoading(true);

        try {
            await login(form.username, form.password);
            window.dispatchEvent(new Event("authChange"));
            navigate("/main");
        } catch(error) {
            if (error.response && error.response.status === 429) {
                setError(error.response.data.error || "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.");
            } else {
                setError("Niepoprawna nazwa użytkownika lub hasło");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <LoginContainer>
            <Title>Logowanie do BloodMarket</Title>
            <Form onSubmit={handleLogin}>
                <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={updateField}
                    disabled={loading}
                />

                <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={updateField}
                    disabled={loading}
                />

                <PasswordRequirements>
                    Wymagania hasła: min. 8 znaków, duża i mała litera, cyfra, znak specjalny
                </PasswordRequirements>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Button type="submit" disabled={loading}>
                    {loading ? "Logowanie..." : "Zaloguj się"}
                </Button>
            </Form>
        </LoginContainer>
    );
};

export default LoginPage;