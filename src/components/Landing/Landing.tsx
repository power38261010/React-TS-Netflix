import React from 'react';
import styles from './NetflixLanding.module.css';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const NetflixLanding: React.FC = () => {
  const { profile, token } = useAuth();
  const navigate = useNavigate();
  if (profile !== null && token !== null )
  {
    navigate('/pre-dashboard');
  }
  return (
    <div className={styles.netflixLanding}>
      <main className={styles.mainContent}>
        <div className={styles.redeemSection}>
          <h1>Películas y series ilimitadas y mucho más</h1>
          <h3>Disfruta donde quieras. Cancela cuando quieras.</h3>
          <p>¿Quieres ver Netflix ya? Ingresa tu email para crear una cuenta o reiniciar tu membresía de Netflix.</p>
          <div className={styles.inputGroup}>
            <input type="text" placeholder="Email" />
            <button>Comenzar !</button>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p>&copy; 2024 Netflix, Inc.</p>
      </footer>
    </div>
  );
};

export default NetflixLanding;
