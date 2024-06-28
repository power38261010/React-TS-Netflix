import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ProfileUpdate } from '../../app/interfaces/ProfileUpdate';
import { inputStyles} from '../Helpers'

interface ProfileManagerProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ isModalOpen, setIsModalOpen }) => {
  const navigate = useNavigate();

  const { profile, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profileState, setProfileState] = useState<ProfileUpdate>({
    id: profile?.id ?? 0,
    username: profile?.username ?? '',
    email: profile?.email ?? '',
    passwordHash: '',
    passwordHashNew: '',
  });
  const [confirmPassword, setConfirmPassword] = useState('');
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfileState({
      id: profile?.id ?? 0,
      username: profile?.username ?? '',
      email: profile?.email ?? '',
      passwordHash: '',
      passwordHashNew: '',
    });
  }, [profile]);


  const handleEditClick = (field: boolean) => {
    setIsEditing(field);
    if (!field) {
      setProfileState((prev) => ({ ...prev, passwordHash : '', passwordHashNew : '' }));
      setConfirmPassword('');
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
      setProfileState((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmPasswordChange = (e: any) => {
    setConfirmPassword(e.target.value);
  };

  const renewSubscription = () => {
    handleClose ();
    navigate('/payment-create');
  }

  const handleUpdateProfile = () => {
    setLoading(true)
    updateProfile(profileState?.id, profileState)
    .then(() => {
      setSnackbarSeverity('success');
      setSnackbarMessage('Perfil actualizado correctamente');
      setSnackbarOpen(true);
      setIsModalOpen(false);
      setIsEditing(false);
    })
    .catch((error) => {
      setSnackbarSeverity('error');
      setSnackbarMessage(error.response.data.message);
      setSnackbarOpen(true);
    })
    .finally(() => {
      setTimeout(() => {
        setLoading(false)
      }, 6000);
    });

  };

  const handleClose = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setProfileState({
      id: profile?.id ?? 0,
      username: profile?.username ?? '',
      passwordHash: '',
      passwordHashNew: '',
      email: profile?.email ?? '',
    });
    setConfirmPassword('');
  };

  return (
    <Modal open={isModalOpen} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: '#141414',
          color: '#fff',
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          sx={{ position: 'absolute', top: 8, right: 8, color: '#fff' }}
          onClick={handleClose}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ display:'flex',justifyContent: 'center' }}>
          <Typography variant="h6" component="h2">
            Perfil
          </Typography>
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Nombre de Usuario"
            name="username"
            value={profileState.username}
            onChange={handleInputChange}
            sx={inputStyles}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={profileState.email}
            onChange={handleInputChange}
            sx={inputStyles}
          />
          <TextField
            fullWidth
            disabled={!isEditing}
            label="Contraseña Actual"
            name="passwordHash"
            value={profileState.passwordHash}
            onChange={handleInputChange}
            type="password"
            sx={inputStyles}
            InputProps={{
              endAdornment: (
                <IconButton onClick={() => handleEditClick(!isEditing)}>
                  <EditIcon sx={{ color: '#fff' }} />
                </IconButton>
              ),
            }}
          />
        {   (profileState.passwordHash !== '' && profileState['passwordHash'].length < 5) &&
        (
          <Box sx={{ display:'flex',justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ mt: 2 , mb: 2 , color:'red' }}>
              Las clave no puede ser menor de 5 digitos!
            </Typography>
          </Box>
        )}
          {isEditing && (
            <>
              <TextField
                fullWidth
                label="Contraseña Nueva"
                name="passwordHashNew"
                value={profileState.passwordHashNew}
                onChange={handleInputChange}
                type="password"
                sx={inputStyles}
              />
              <TextField
                fullWidth
                label="Repetir Contraseña Nueva"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                type="password"
                sx={inputStyles}
              />
            </>
          )}
        </Box>
        {   (profileState.passwordHash !== '' && profileState.passwordHashNew !== '') && (confirmPassword !== profileState.passwordHashNew) &&
        (
          <Box sx={{ display:'flex',justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ mt: 2 , mb: 2 , color:'red' }}>
              Las claves nuevas no coinciden!
            </Typography>
          </Box>
        )}
        {   (profileState.passwordHashNew !== '' && profileState['passwordHashNew'].length < 5) &&
        (
          <Box sx={{ display:'flex',justifyContent: 'center' }}>
            <Typography variant="body1" sx={{ mt: 2 , mb: 2 , color:'red' }}>
              Las clave no puede ser menor de 5 digitos!
            </Typography>
          </Box>
        )}
        { profile?.role === 'client' && (
          <>
            <Typography variant="body1" sx={{ mt: 2 , mb: 2 }}>
              Subscripción: {profile?.subscription?.type ? profile?.subscription?.type :'Sin Subscripción'}
            </Typography>
            <Typography variant="body1"  sx={{ mb: 2 }}>
              Estado: {profile?.isPaid ? 'Pagado' : 'No Pagado'}{'         '}
              <Button variant="contained" color="warning" size="small" sx={{ ml:3, background:'red' }} onClick={renewSubscription}>
                {profile?.isPaid ? "Cambiar Subscripción" : "Renovar Subscripción"}
              </Button>
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Fecha de Caducación: { !!profile?.expirationDate ? profile?.expirationDate.toString().split('T')[0].split('-').reverse().join('/') : "Sin Fecha"}
            </Typography>
          </>
        )}

        {(  profileState.username !== profile?.username || (profileState.email !== profile?.email && profileState.email !== '') ||
        (( profileState.passwordHash !== '' && profileState.passwordHashNew !== '') && confirmPassword === profileState.passwordHashNew )) &&
        (
          <Box sx={{ display:'flex',justifyContent: 'center' }}>
            <Button variant="contained" color="primary" onClick={handleUpdateProfile}>
              {loading ? <CircularProgress style={{color:'white'}} size={24} /> : 'Actualizar Perfil'}
            </Button>
          </Box>
        )}
        {/* Snackbar para mostrar mensajes */}
        <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' , color: 'white', background: 'black'}}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
      </Box>
    </Modal>
  );
};


export default ProfileManager;
