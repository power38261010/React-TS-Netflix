import api from './api';
import { reload } from './statusError';

class UserService {
  async getUserById(id: number): Promise<any | null> {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error);
      // reload();
      return null;
    }

  }
  async softDeleteUser(id: number): Promise<boolean> {
    try {
      await api.put(`users/softdelete/${id}`); // Asegúrate de que la ruta aquí coincida exactamente
      return true;
    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);
      // reload();
      return false;
    }
  }


  async upUser(id: number, role:string ): Promise<boolean> {
    try {
      await api.put(`/users/up-user/${id}/${role}`);
      return true;
    } catch (error) {
      console.error(`Error soft deleting user with ID ${id}:`, error);
      // reload();
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
      // reload();
      return [];
    }
  }
}

// Exporta la clase como instancia única (singleton)
export const userService = new UserService();

// Agrega aquí otros métodos de servicio relacionados con usuarios según sea necesario
