import { useState } from "react";

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    // Wysyłanie danych do backendu przy pomocy fetch
    try {
      const response = await fetch("http://127.0.0.1:8000/api/register/", {
        method: "POST",  // Metoda HTTP
        headers: {
          "Content-Type": "application/json",  // Informujemy backend, że wysyłamy dane w formacie JSON
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }), // Zamiana danych na format JSON
      });

      if (response.ok) {
        const data = await response.json();
        alert("Rejestracja zakończona sukcesem!");
      } else {
        const errorData = await response.json();
        alert(`Błąd rejestracji: ${errorData.detail || 'Nieznany błąd'}`);
      }
    } catch (error) {
      console.error("Rejestracja nie powiodła się", error);
      alert("Błąd rejestracji.");
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nazwa użytkownika"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Hasło"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
};

export default RegisterPage;
