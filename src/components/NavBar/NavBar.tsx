// src/components/NavBar/NavBar.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './NavBar.module.css';
import logoNetflix from '../../assets/logoNetflix.png';

const NavBar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isAuthenticated = profile !== null;

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoNetflix} alt="Netflix Logo" />
      </div>
      <div className={styles.links}>
        {profile?.role === 'admin' && (
          <>
            <Link to="/pays" className={styles.navLink}>Pagos</Link>
            <Link to="/users" className={styles.navLink}>Usuarios</Link>
            <Link to="/movies" className={styles.navLink}>Películas</Link>
          </>
        )}
        {profile?.role === 'client' && (
          <>
            <Link to="/movies" className={styles.navLink}>Películas</Link>
            <Link to="/favorites" className={styles.navLink}>Favoritos</Link>
            <Link to="/new-releases" className={styles.navLink}>Estrenos</Link>
          </>
        )}
      </div>
      <div className={styles.actions}>
        {isAuthenticated ? (
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.navButton}>Cuenta</button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="#" className={styles.dropdownItem}>Administrar Perfil</Link>
                <button onClick={handleLogout} className={styles.dropdownItem}>Cerrar Sesión</button>
              </div>
            )}
          </div>
        ) : (
          location.pathname !== '/login' && (
            <button onClick={() => navigate('/login')} className={styles.navButton}>Iniciar Sesión</button>
          )
        )}
      </div>
    </header>
  );
};

export default NavBar;
