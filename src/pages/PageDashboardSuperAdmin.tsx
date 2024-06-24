import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import SubscriptionComponent from '../components/Subscription/SubscriptionComponent';
import PayComponent from '../components/Pay/Admin/PayComponent';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { getAllPaymentSubscriptions, getAllPayments, getAllSubscriptions } from '../app/slices';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';

const UserAdminApp: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);
  const { pays } = useSelector((state: RootState) => state.pays);
  const { paysub } = useSelector((state: RootState) => state.payment);

  useEffect(() => {
    dispatch(getAllSubscriptions());
    dispatch(getAllPayments());
    dispatch(getAllPaymentSubscriptions());
  }, []);

  return (
    <>
        {/* <DashboardContent subscriptions = {subscriptions} pays = {pays}  users = {users} paysub = {paysub}/> */}
      <Box sx={{
        display: 'flex',
        bgcolor: '#141414',
        height: '100vh',
        justifyContent: 'space-between',
        alignItems: 'stretch'
      }}>
        <Box sx={{ flex: '0 0 61%',marginLeft: '2%', marginRight: '5%' }}>
          <PayComponent />
        </Box>
        <Box sx={{ flex: '0 0 30%',marginRight: '2%' }}>
          <SubscriptionComponent />
        </Box>
      </Box>
    </>
  );
};

export default UserAdminApp;