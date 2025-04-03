import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const LoginPage = () => {
    const navigate = useNavigate();  
    const { login } = useContext(AuthContext);

    const [error, setError]=useState(null);
    const [form,setForm]=useState({
        username: '',
        password: '',
      });


      const updateField = e =>{
        setForm({
          ...form,
          [e.target.name]: e.target.value
        })
    
      }




      const validate = form =>{
    
        if(!form.username){
          return "Nazwa jest wymagana";
        }
        else if(!/^[a-zA-Z0-9._-]{2,20}$/i.test(form.username))
          return "Dane są nieprawidłowe";
    
        if(!form.password){
          return "Hasło jest wymagane";
        }
        else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(form.password)){
          return "Dane są nieprawidłowe";
        }
    
    
        return null;
        
      }

    const handleLogin = async (e) => {
        e.preventDefault();
        const errorMsg = validate(form);
        if(errorMsg){
            setError(errorMsg);
            return; 
          }

          try{
            await login(
                form.username,
                form.password);
                const event = new Event("authChange");
                window.dispatchEvent(event)
                navigate("/main");
          }
          catch(error){
            if (error.response && error.response.status === 429) {
              setError(error.response.data.error || "Zbyt wiele prób logowania. Spróbuj ponownie za chwilę.");
          } else {
              setError("Niepoprawne dane.");
          }

    };
  };

    return (
        <div>
            <h2>Logowanie</h2>
            <form onSubmit={handleLogin}>
                <input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="Nazwa użytkownika"
                    value={form.username}
                    onChange={updateField}
                 />
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Hasło"
                    value={form.password}
                    onChange={updateField}
                    />
                    {error && <p style={{ color: "red" }}>{error}</p>}
                <button type="submit">Zaloguj</button>
            </form>
        </div>
    );
};

export default LoginPage;
