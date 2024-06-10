import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar/NavBar';

const AdminDashboard: React.FC = () => {
  const { logout , profile, token } = useAuth();
  const navigate = useNavigate ();

  const handleLogout = async () => {
    await logout ();
    // navigate('/movies'); // Cambia la ruta según tus necesidades
  }

  const handleUsers = async () => {
    navigate('/users'); // Cambia la ruta según tus necesidades
  }

  const handlePays = async () => {
    navigate('/pays'); // Cambia la ruta según tus necesidades
  }
  
  const handleMovies = async () => {
    navigate('/movies'); // Cambia la ruta según tus necesidades
  }

  return (
    <div>
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">Panel de Administrador</h2>
      {/* Agregare mas contenido del panel de administrador aquí */}
        <button  onClick={handleLogout}>
          Cerrar Sesion
        </button>

        <button  onClick={handleMovies}>
          Movies
        </button>

        <button  onClick={handleUsers}>
          Users
        </button>

        <button  onClick={handlePays}>
          Pays
        </button>
    </div>
  );
};

export default AdminDashboard;
