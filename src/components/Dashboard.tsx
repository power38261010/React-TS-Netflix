import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import NavBar from './NavBar/NavBar';

const AdminDashboard: React.FC = () => {
  const { logout , profile, token } = useAuth();
  const navigate = useNavigate ();
  const handleLogout = async () => {
    await logout ();
    // navigate('/movies'); // Cambia la ruta según tus necesidades
  }
  return (
    <div>
      <NavBar />
      <h2 className="text-2xl font-bold mb-4">Panel de user</h2>
      {/* Agregare mas contenido del panel de user aquí */}
      <button  onClick={handleLogout}>
        Cerrar Sesion
      </button>
    </div>
  );
};

export default AdminDashboard;
