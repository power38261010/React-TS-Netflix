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
        <Box sx={{ bgcolor: '#141414', height: '100vh' }}>
          {/* <DashboardContent subscriptions = {subscriptions} pays = {pays}  users = {users} paysub = {paysub}/> */}
          <SubscriptionComponent /*subscriptions = {subscriptions} **/ />
          <PayComponent /* subscriptions = {subscriptions} pays = {pays} **/ />

          
        </Box>
    </>
  );
};

export default UserAdminApp;