import api from './api';
import { Subscription } from '../app/interfaces/Subscription';

class SubscriptionService {

  async getAllSubscriptions(): Promise<Subscription[]> {
    try {
      const response = await api.get('/subscriptions');
      return response.data;
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      return [];
    }
  }

  async createSubscription(subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    try {
      const response = await api.post('/subscriptions', subscription);
      console.log("cr response.data ",response.data)
      return response.data;
      } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error creating subscription');
        }
  }

  async updateSubscription(id: number, subscription: Omit<Subscription, 'id'>): Promise<Subscription> {
    try {
      const response = await api.put(`/subscriptions/${id}`, subscription);
      console.log("up response.data ",response.data)
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error updating subscription');
    }
  }

  async deleteSubscription(id: number): Promise<void> {
    try {
      await api.delete(`/subscriptions/${id}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Error deleting subscription');
    }
  }
}

export const subscriptionService = new SubscriptionService();
