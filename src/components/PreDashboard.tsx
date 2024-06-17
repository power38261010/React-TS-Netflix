import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { searchMovies, getAllPaymentSubscriptions, getAllPayments, getAllSubscriptions, searchUsers } from '../app/slices/index'; // Asegúrate de que las rutas sean correctas
import { CircularProgress, Box, Typography } from '@mui/material';
import netflixLogo from '../assets/logoNetflix.png'; // Asegúrate de que la ruta sea correcta
import { AppDispatch } from '../app/store';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getAllWayPayments } from '../app/slices/paymentSubscriptionSlice';

const LoadingScreen = () => {
  const { profile, token } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  if ( !!profile  && profile.username === "super_admin") {
    dispatch(getAllPaymentSubscriptions());
    dispatch(getAllPayments());
  }
  if ( !!profile && ["admin","super_admin"].includes(profile.role)) {
    dispatch(searchUsers({}));
  }
  useEffect(() => {
    dispatch(searchMovies({}));
    dispatch(getAllWayPayments());
    dispatch(getAllSubscriptions());
    if (profile !== null && token !== null )
      {
          if (["admin","super_admin"].includes(profile.role))  navigate('/admin-dashboard');
          else navigate('/dashboard');
        }
  }, [dispatch]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: 'black',
        color: 'white',
      }}
    >
      <img src={netflixLogo} alt="Netflix Logo" style={{ width: '150px', marginBottom: '20px' }} />
      <CircularProgress color="inherit" />
      <Typography variant="h6" sx={{ marginTop: '20px' }}>Cargando...</Typography>
    </Box>
  );
};

export default LoadingScreen;
