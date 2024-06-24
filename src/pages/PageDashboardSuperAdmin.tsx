import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import SubscriptionComponent from '../components/Subscription/SubscriptionComponent';
import PayComponent from '../components/Pay/Admin/PayComponent';
import { useDispatch } from 'react-redux';
import { getAllPaymentSubscriptions, getAllPayments, getAllSubscriptions } from '../app/slices';
import { AppDispatch } from '../app/store';
import DashboardComponent from '../components/Dashboard/DashboardComponent';
import { getAll } from '../app/slices/usersSlice';

const UserAdminApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getAllSubscriptions());
    dispatch(getAll());
    dispatch(getAllPayments());
    dispatch(getAllPaymentSubscriptions());
  }, [dispatch]);

  return (
    <>
        <Box sx={{ bgcolor: '#141414', height: '100%' }}>
          <Box sx={{ bgcolor: '#141414', padding: '20px', mb: 1}}>
            <DashboardComponent />
          </Box>
          <Box sx={{ bgcolor: '#141414', padding: '1px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb:5}}>
              <Box sx={{ flex: '0 0 61%', marginLeft: '2%', marginRight: '5%' }}>
                <PayComponent />
              </Box>
              <Box sx={{ flex: '0 0 30%', marginRight: '2%' }}>
                <SubscriptionComponent />
              </Box>
            </Box>
          </Box>
        </Box>

    </>
  );
};

export default UserAdminApp;
