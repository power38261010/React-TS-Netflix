import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const { login, profile, token } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  const navigate = useNavigate();

  if (profile !== null && token !== null) {
    navigate('/pre-dashboard');
  }

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const isAuthenticated = await login(username, password);
      if (isAuthenticated) {
        navigate('/pre-dashboard');
      }
    } catch (error :any) {
      setErrorMessage(error.response.data.message);
    }
  };

  return (
    <div className={styles.login}>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <h1>Iniciar Sesion</h1>
        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className={styles.loginButton} type="submit">
          Iniciar Sesion
        </button>
        <div className={styles.extraLinks}>
 
          <a href="" >Necesitas Ayuda?</a>
          <br />
          <a href="" onClick={ ()=>   navigate('/register') }>Eres Nuevo en Neftlix? Registrate Ahora</a>
        </div>
      </form>
      <footer className={styles.footer}>
        <p>&copy; 2024 Netflix, Inc.</p>
      </footer>
    </div>
  );
};

export default LoginForm;
