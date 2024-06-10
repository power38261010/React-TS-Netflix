import api from './api';
import { reload } from './statusError';

class UserService {
  async getUserById(id: number): Promise<any | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      reload();
      return null;
    }
  }

  async updateUser(id: number, userData: any): Promise<boolean> {
    try {
      await api.put(`/users/${id}`, userData);
      return true;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      reload();
      return false;
    }
  }

  async softDeleteUser(id: number): Promise<boolean> {
    try {
      await api.delete(`/users/softdelete/${id}`);
      return true;
    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);
      reload();
      return false;
    }
  }

  async searchUsers(
    username?: string,
    role?: string,
    expirationDate?: Date,
    isPaid?: boolean,
    subscriptionType?: string,
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<any[]> {
    try {
      const response = await api.get('/users/search', {
        params: {
          username,
          role,
          expirationDate,
          isPaid,
          subscriptionType,
          pageIndex,
          pageSize
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      reload();
      return [];
    }
  }
}

// Exporta la clase como instancia única (singleton)
export const userService = new UserService();

// Agrega aquí otros métodos de servicio relacionados con usuarios según sea necesario
