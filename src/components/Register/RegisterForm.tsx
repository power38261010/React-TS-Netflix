import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import { useAuth } from '../../contexts/AuthContext';

const RegisterForm: React.FC = () => {
  const { register, errorRegisterMsg, profile, token } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [subscriptionId, setSubscriptionId] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  if (profile !== null && token !== null) {
    navigate('/pre-dashboard');
  }

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Las contraseñas no coinciden');
      return;
    }

    try {
      const isRegistered = await register(username, email, password, subscriptionId);
      if (isRegistered) {
        navigate('/pre-dashboard');
      }
    } catch (error) {
      console.error('Error al registrar:', error);
      setErrorMessage(errorRegisterMsg || 'Error desconocido durante el registro');
    }
  };

  return (
    <div className={styles.register}>
      <form className={styles.registerForm} onSubmit={handleRegister}>
        <h1>Registro</h1>
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
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div className={styles.inputGroup}>
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputGroup}>
          <select
            value={subscriptionId}
            onChange={(e) => setSubscriptionId(Number(e.target.value))}
            required
          >
            <option value={0}>Ninguno</option>
            <option value={1}>Premium</option>
            <option value={2}>Starter</option>
          </select>
        </div>
        <button className={styles.registerButton} type="submit">
          Registrar
        </button>
        <div className={styles.legenda}>
          Prueba la cuenta Premium por 15 días, o Starter por 30, en caso de no optar ahora perderás la oportunidad!
        </div>
      </form>
      <footer className={styles.footer}>
        <p>&copy; 2024 Netflix, Inc.</p>
      </footer>
    </div>
  );
};

export default RegisterForm;
