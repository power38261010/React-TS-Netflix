import { User } from '../app/interfaces/User';
import api from './api';

class UserService {

  async getUserById(id: number): Promise<any | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      return null;
    }

  }

  async getAll(): Promise<User[] | []> {
    try {
      const response = await api.get(`/users`);
      console.log(' response get all users ', response)
      return response.data;
    } catch (error) {
      console.error(`Error fetching user getall`, error);
      return [];
    }

  }


  async softDeleteUser(id: number): Promise<boolean> {
    try {
      await api.put(`users/softdelete/${id}`);
      return true;
    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);
      return false;
    }
  }


  async upUser(id: number, role:string ): Promise<boolean> {
    try {
      await api.put(`/users/up-user/${id}/${role}`);
      return true;
    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);
      return false;
    }
  }

  async searchUsers(
    searchTerm?: string,
    role?: string,
    expirationDate?: Date,
    isPaid?: boolean,
    subscriptionType?: string,
    pageIndex: number = 1,
    pageSize: number = 20
  ): Promise<any[]> {
    try {
      const response = await api.get('/users/search', {
        params: {
          searchTerm,
          role,
          expirationDate,
          isPaid,
          subscriptionType,
          pageIndex,
          pageSize
        }
      });
      console.log('response users', response)
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  }
}

export const userService = new UserService();

