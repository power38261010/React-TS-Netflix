import React, { useState, useEffect, KeyboardEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import styles from './NavBar.module.css';
import logoNetflix from '../../assets/logoNetflix.png';
import ProfileManager from '../Profile/ProfileModal';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SearchIcon from '@mui/icons-material/Search';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { searchMovies } from '../../app/slices/moviesSlice';

const NavBar: React.FC = () => {
  const { profile, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDropdown = (state: boolean) => {
    setDropdownOpen(state);
  };

  const isAuthenticated = profile !== null;

  const handleOpenProfileManager = () => {
    setIsModalOpen(true);
    setDropdownOpen(false);
  };

  const handleSearch = () => {
    dispatch(searchMovies({ title: searchTerm }));
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.logo}>
        <Link to="/">
          <img src={logoNetflix} alt="Netflix Logo" />
        </Link>
      </div>
      <div className={styles.links}>
        {!!profile && profile.role === 'super_admin' && (
          <>
            <Link
              to="/super-admin-dashboard"
              className={`${styles.navLink} ${location.pathname === '/super-admin-dashboard' ? styles.activeLink : ''}`}
            >
              Dashboard
            </Link>
          </>
        )}
        {!!profile && ['admin', 'super_admin'].includes(profile.role) && (
          <>
            <Link
              to="/admin-content"
              className={`${styles.navLink} ${location.pathname === '/admin-content' ? styles.activeLink : ''}`}
            >
              Administrar Películas
            </Link>
            <Link
              to="/users"
              className={`${styles.navLink} ${location.pathname === '/users' ? styles.activeLink : ''}`}
            >
              Administrar Usuarios
            </Link>
          </>
        )}
        {profile?.role === 'client' && (
          <>
            <Link
              to="/movies-netflix"
              className={`${styles.navLink} ${location.pathname === '/movies-netflix' ? styles.activeLink : ''}`}
            >
              Películas
            </Link>
          </>
        )}
      </div>
      {profile?.role === 'client' && location.pathname === '/movies-netflix' && (
        <div className={styles.searchContainer}>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Buscar"
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SearchIcon className={styles.searchIcon} onClick={handleSearch} />
          </div>
        </div>
      )}
      <div className={styles.actions}>
        {isAuthenticated ? (
          <div
            className={styles.dropdown}
            onMouseEnter={() => toggleDropdown(true)}
            onMouseLeave={() => toggleDropdown(false)}
          >
            <button className={styles.navButton}>
              <AccountCircleIcon
                fontSize="large"
                style={{
                  color:
                    profile.role === 'admin' || profile.role === 'super_admin'
                      ? 'red'
                      : profile.role === 'client' && profile?.subscription?.id === 2
                      ? 'yellow'
                      : 'white',
                }}
              />
              <span className={styles.navButtonText}>{profile?.username}</span>
            </button>
            {dropdownOpen && (
              <div className={styles.dropdownMenu}>
                <button onClick={handleOpenProfileManager} className={styles.dropdownItem}>
                  Perfil
                </button>
                <hr className={styles.dropdownDivider} />
                <button onClick={handleLogout} className={styles.dropdownItem}>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          location.pathname !== '/login' && (
            <button onClick={() => navigate('/login')} className={styles.navButton}>
              Iniciar Sesión
            </button>
          )
        )}
      </div>
      <ProfileManager isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </header>
  );
};

export default NavBar;
