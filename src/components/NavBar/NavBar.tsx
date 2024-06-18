import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './NavBar.module.css';
import logoNetflix from '../../assets/logoNetflix.png';
import ProfileManager from '../Profile/ProfileModal';

const NavBar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const isAuthenticated = profile !== null;

  const handleOpenProfileManager = () => {
    setIsModalOpen(true);
    setDropdownOpen(false); // Cierra el dropdown cuando se abre el modal
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img src={logoNetflix} alt="Netflix Logo" />
      </div>
      <div className={styles.links}>
        {!!profile && ["admin","super_admin"].includes(profile.role) && (
          <>
            <Link to="/users" className={styles.navLink}>Usuarios</Link>
            <Link to="/movies" className={styles.navLink}>Películas</Link>
            <Link to="/movies-netflix" className={styles.navLink}>Peliculas Clientes</Link>
          </>
        )}
        {!!profile && ["super_admin"].includes(profile.role) && (
          <>
            <Link to="/pays" className={styles.navLink}>Pagos</Link>
            <Link to="/subscriptions" className={styles.navLink}>Subscripciones</Link>
          </>
        )}
        {profile?.role === 'client' && (
          <>
          <Link to="/movies-netflix" className={styles.navLink}>Películas</Link>
          </>
        )}
      </div>
      <div className={styles.actions}>
        {isAuthenticated ? (
          <div className={styles.dropdown}>
            <button onClick={toggleDropdown} className={styles.navButton}>Cuenta</button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={handleOpenProfileManager} className={styles.dropdownItem}>Administrar Perfil</button>
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
      <ProfileManager isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </header>
  );
};

export default NavBar;
