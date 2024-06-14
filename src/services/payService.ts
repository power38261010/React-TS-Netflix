import { Pay } from '../app/interfaces/Pay';
import api from './api';
import { reload } from './statusError';

class PayService {

  async getAllPayments  (): Promise<any[]>  {
    try {
      const response = await api.get('/payments');
      console.log("pays " ,response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      reload ()
      return [];
    }
  };

  async getAllWayPayments (): Promise<any[]>  {
    try {
      const response = await api.get('/payments/ars');
      console.log("pays ars  " ,response.data);

      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      reload ()
      return [];
    }
  };

  async createPay  (pay: Omit<Pay, 'id'>): Promise<Pay>  {
    try {
      const response = await api.post<Pay>('/', pay);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error al crear el pago');
    }
  };

  async updatePay  (id: number, pay: Omit<Pay, 'id'>): Promise<Pay>  {
    try {
      const response = await api.put<Pay>(`/${id}`, pay);
      return response.data;
    } catch (error: any) {
      reload ()
      throw new Error(error.response?.data?.message || 'Error al actualizar el pago');
    }
  };

  async deletePay  (id: number): Promise<void>  {
    try {
      await api.delete(`/${id}`);
    } catch (error: any) {
      reload ()
      throw new Error(error.response?.data?.message || 'Error al eliminar el pago');
    }
  };

}

// Exporta la clase como instancia única (singleton)
export const payService = new PayService();
// Agrega aquí otros métodos de servicio relacionados con pagos según sea necesario
