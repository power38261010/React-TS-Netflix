import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../../app/store';
import { PaySubscription } from '../../app/interfaces/PaymentSubscription';
import { getAll } from '../../app/slices/usersSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import { VictoryPie, VictoryBar } from 'victory';

const DashboardComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { allUsers } = useSelector((state: RootState) => state.users);
  const { paysub } = useSelector((state: RootState) => state.payment);

  const [annualCount, setAnnualCount] = useState<number>(0);
  const [semiAnnualCount, setSemiAnnualCount] = useState<number>(0);
  const [monthlyCount, setMonthlyCount] = useState<number>(0);
  const [annualRevenue, setAnnualRevenue] = useState<number>(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(0);
  const [totalYearlyRevenue, setTotalYearlyRevenue] = useState<number>(0);

  useEffect(() => {
    if (paysub.length > 0) {
      const currentYear = new Date().getFullYear();
      let annualCount = 0;
      let semiAnnualCount = 0;
      let monthlyCount = 0;
      let annualRevenue = 0;
      let monthlyRevenue = 0;
      let totalYearlyRevenue = 0;

      paysub.forEach((pay: PaySubscription) => {
        if (pay.status === 'approved') {
          const paidYear = new Date(pay.paidDate).getFullYear();
          if (pay.isAnual) {
            annualCount++;
            annualRevenue += pay.amount;
          } else if (paidYear === currentYear) {
            if (pay.description.toLowerCase().includes('semestral')) {
              semiAnnualCount++;
            } else if (pay.description.toLowerCase().includes('mensual')) {
              monthlyCount++;
            }
            if (pay.isAnual) {
              annualRevenue += pay.amount;
            } else {
              monthlyRevenue += pay.amount;
            }
          }

          if (paidYear === currentYear) {
            totalYearlyRevenue += pay.amount;
          }
        }
      });

      setAnnualCount(annualCount);
      setSemiAnnualCount(semiAnnualCount);
      setMonthlyCount(monthlyCount);
      setAnnualRevenue(annualRevenue);
      setMonthlyRevenue(monthlyRevenue);
      setTotalYearlyRevenue(totalYearlyRevenue);
    }
  }, [paysub]);

  useEffect(() => {
    dispatch(getAll());
  }, [dispatch]);

  const clientUsers = allUsers.filter(user => user.role === 'client');
  const paidUsers = clientUsers.filter(user => user.isPaid === true);
  const startedSubscriptions = paidUsers.filter(user => user.subscriptionId === 1);
  const premiumSubscriptions = paidUsers.filter(user => user.subscriptionId === 2);

  return (
    <Box className="dashboard-container" sx={{ bgcolor: '#141414', color: 'white', padding: '20px', height: '100vh', mt: 10 }}>
      <Typography variant="h4" sx={{ marginBottom: '20px' }}>Dashboard de Estadísticas</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 10 }}>
        <Box sx={{ flexBasis: '30%', bgcolor: '#2C2C2C', borderRadius: '10px', padding: '20px' }}>
          <Typography align='center' variant="h5" sx={{ marginBottom: '10px' }}>Recaudación Venta Tipo Anual</Typography>
          <Typography align='center' variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>${annualRevenue.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ flexBasis: '30%', bgcolor: '#2C2C2C', borderRadius: '10px', padding: '20px' }}>
          <Typography align='center' variant="h5" sx={{ marginBottom: '10px' }}>Recaudación Venta Tipo Mensual</Typography>
          <Typography align='center' variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>${monthlyRevenue.toFixed(2)}</Typography>
        </Box>
        <Box sx={{ flexBasis: '30%', bgcolor: '#2C2C2C', borderRadius: '10px', padding: '20px' }}>
          <Typography align='center' variant="h5" sx={{ marginBottom: '10px' }}>Recaudación Total Anual</Typography>
          <Typography align='center' variant="h6" sx={{ fontWeight: 'bold', marginTop: '10px' }}>${totalYearlyRevenue.toFixed(2)}</Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: '10px', marginTop: '20px' }}>
        <Box sx={{ flexBasis: '20%', bgcolor: '#2C2C2C', borderRadius: '10px', padding: '20px', mt: 10 , mr:40, }}>
          <Typography variant="h5" align='center' sx={{ marginBottom: '10px' }}>Pagos de Subscripciones</Typography>
          <VictoryPie
            data={[
              { x: 'Anual', y: annualCount },
              { x: 'Mensual', y: monthlyCount }
            ]}
            colorScale={['#FF5733', '#3333FF']}
            labelRadius={30}
            style={{ labels: { fill: 'white', fontSize: 14, fontWeight: 'bold' } }}
            width={300} // Ajustar el tamaño del VictoryPie
          />
        </Box>
        <Box sx={{ flexBasis: '20%', bgcolor: '#2C2C2C', borderRadius: '10px', padding: '20px', mt: 10 }}>
          <Typography variant="h5" align='center' sx={{ marginBottom: '10px' }}>Usuarios con Subscripciones</Typography>
          <VictoryBar
            data={[
              { x: 'Started', y: startedSubscriptions.length },
              { x: 'Premium', y: premiumSubscriptions.length }
            ]}
            style={{ data: { fill: '#33FFEC' }, labels: { fill: 'white', fontSize: 12 } }} // Ajuste del tamaño de la letra
            barWidth={30} // Reducción del ancho de la barra para mejorar la separación entre las barras
            cornerRadius={4}
            width={300} // Ajustar el tamaño del VictoryBar
            // Agregar ejes cartesianos
            domain={{ y: [0, Math.max(startedSubscriptions.length, premiumSubscriptions.length) + 5] }}
            labels={({ datum }) => `${datum.x}: ${datum.y}`}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardComponent;
