import api from './api';
import { Subscription } from '../app/interfaces/Subscription';
import { reload } from './statusError';

class SubscriptionService {
  // Método para obtener todas las suscripciones
  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await api.get('/subscriptions');
      console.log("response.data sub ", response.data)
      return response.data;
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
        // reload()
      return [];
    }
  }

  // Método para obtener una suscripción por ID
  // async getSubscriptionById(id: number): Promise<Subscription | null> {
  //   try {
  //     const response = await api.get(`/subscriptions/${id}`);
  //     return response.data;
  //   } catch (error) {
  //     console.error(`Error fetching subscription with ID ${id}:`, error);
  //     reload()
  //     return null;
  //   }
  // }

  // Método para crear una nueva suscripción
  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    try {
      const response = await api.post('/subscriptions', subscription);
      console.log("cr response.data ",response.data)
      return response.data;
      } catch (error: any) {
        // reload()
        throw new Error(error.response?.data?.message || 'Error creating subscription');
        }
  }
  
  // Método para actualizar una suscripción existente
  async updateSubscription(id: number, subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    try {
      const response = await api.put(`/subscriptions/${id}`, subscription);
      console.log("up response.data ",response.data)
      return response.data;
    } catch (error: any) {
      // reload()
      throw new Error(error.response?.data?.message || 'Error updating subscription');
    }
  }

  // Método para eliminar una suscripción
  async deleteSubscription(id: number): Promise<void> {
    try {
      await api.delete(`/subscriptions/${id}`);
    } catch (error: any) {
      // reload()
      throw new Error(error.response?.data?.message || 'Error deleting subscription');
    }
  }
}

// Exporta la clase como instancia única (singleton)
export const subscriptionService = new SubscriptionService();
