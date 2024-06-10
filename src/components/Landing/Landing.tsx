// src/components/NetflixLanding.tsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './NetflixLanding.module.css';
import logoNetflix from '../../assets/logoNetflix.png';
import NavBar from '../NavBar/NavBar';



const NetflixLanding: React.FC = () => {
  const navigate = useNavigate();
  
    const goToLogin = async () => {
      try {
          navigate('/login'); // Cambia la ruta según tus necesidades
      } catch (error) {
        console.error('Error al dirigirse a login:', error);
      }
    };
    return (
      <div className={styles.netflixLanding}>
        {/* <NavBar /> */}
        {/* <header className={styles.header }>
          <div className={styles.logo}>
            <img src={logoNetflix} alt="Netflix Logo" />
          </div>
          <div className={styles.actions}>
            <button onClick = {goToLogin} className={styles.signIn}>Iniciar Sesion</button>
          </div>
        </header> */}
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
