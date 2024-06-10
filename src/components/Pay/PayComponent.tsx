// PayComponent.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { getAllPayments } from '../../app/slices/paysSlice';

const PayComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { payments, loading, error } = useSelector((state: RootState) => state.pays);

  useEffect(() => {
    dispatch(getAllPayments());
  }, [dispatch]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Pagos</h1>
      <ul>
        {payments.map(pay => (
          <li key={pay.id}>{pay.monthlyPayment}</li>
        ))}
      </ul>
    </div>
  );
};

export default PayComponent;
