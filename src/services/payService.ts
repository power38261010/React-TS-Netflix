import { Pay } from '../app/interfaces/Pay';
import api from './api';

class PayService {

  async getAllPayments  (): Promise<any[]>  {
    try {
      const response = await api.get('/payments');
      console.log("pays " ,response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  };

  async getAllWayPayments (): Promise<Pay[]>  {
    try {
      const response = await api.get('/payments/ars');
      console.log("pays ars  " ,response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      return [];
    }
  };

  async createPay (pay: Pay): Promise<Pay>  {
    try {
      const response = await api.post<Pay>('/payments', pay);
      console.log('pay sudo create , ', response)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el pago');
    }
  };

  async updatePay  (id: number, pay: Pay): Promise<Pay>  {
    try {
      const response = await api.put<Pay>(`/payments/${id}`, pay);
      console.log('pay sudo updatePay , ', response)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el pago');
    }
  };

  async deletePay  (id: number): Promise<void>  {
    try {
      let res = await api.delete(`/payments/${id}`);
      console.log('pay sudo deletePay , ', res)

    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al eliminar el pago');
    }
  };

}

export const payService = new PayService();
