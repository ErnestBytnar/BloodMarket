import { useState } from "react";
import { registerUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError]=useState(null);
  const [form,setForm]=useState({
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

  const updateField = e =>{
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })

  }

  const validate = form =>{
    if(!form.email){
      return "Email jest wymagany";
    }
    else if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(form.email)){
      return "Nieprawidłowy adres email";
    }

    if(!form.username){
      return "Nazwa jest wymagana";
    }
    else if(!/^[a-zA-Z0-9._-]{2,20}$/i.test(form.username))
      return "Niepoprawna nazwa użytkownika";

    if(!form.password){
      return "Hasło jest wymagane";
    }
    else if(!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i.test(form.password)){
      return "Hasło musi zawierać co najmniej 8 znaków, jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny";
    }

    if(!form.passwordRep){
      return "Powtórz hasło";
    }
    
    if(form.password !== form.passwordRep){
      return "Hasła nie są takie same";
    }

    return null;
    
  }



  const handleRegister = async (e) => {
    e.preventDefault();
    const errorMsg = validate(form);
    if(errorMsg){
      setError(errorMsg);
      return; 
    }
    try{
      await registerUser(
       form.username,
        form.email,
         form.password);
      alert("Rejestracja zakończona sukcesem");
      navigate('/login');
    }
    catch(error){
      if (error.response && error.response.data) {
        const errorData = error.response.data;
        setFormErrors({
          username: errorData.username || '',
          email: errorData.email || '',
          password: errorData.password || '',
          passwordRep: errorData.passwordRep || ''
        });
      } else {
        setError("Wystąpił błąd. Spróbuj ponownie później.");
      }
    }
  };

  return (
    <div>
      <h2>Rejestracja</h2>
      <form onSubmit={handleRegister}>
      <div>
        <input
          id="username"
          name="username"
          type="text"
          placeholder="Nazwa użytkownika"
          value={form.username}
          onChange={updateField}
        />
        {formErrors.username && <p style={{ color: "red" }}>{formErrors.username}</p>}
        </div>
        <div>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={updateField}
        />
        {formErrors.email && <p style={{ color: "red" }}>{formErrors.email}</p>}
        </div>

        <div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Hasło"
          value={form.password}
          onChange={updateField}
        />
        {formErrors.password && <p style={{ color: "red" }}>{formErrors.password}</p>}
        </div>

        <div>
        <input
          id="passwordRep"
          name="passwordRep"
          type="password"
          placeholder="Powtórz hasło"
          onChange={updateField}
        />
        </div>
        <p>Hasło musi zawierać co najmniej 8 znaków, jedną dużą literę, jedną małą literę, jedną cyfrę i jeden znak specjalny</p>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button type="submit">Zarejestruj</button>
      </form>
    </div>
  );
};

export default RegisterPage;
