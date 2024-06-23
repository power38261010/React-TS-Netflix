import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import UserComponent from '../components/User/UserComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { useAuth } from '../contexts/AuthContext';
import { getAllSubscriptions } from '../app/slices';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';


const UserAdminApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);
  const { profile } = useAuth();

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, []);

  return (
    <>
        <Box sx={{ bgcolor: '#141414', height: '100vh' }}>
          <UserComponent subscriptions = {subscriptions} profile = {profile}/>
        </Box>
    </>
  );
};

export default UserAdminApp;