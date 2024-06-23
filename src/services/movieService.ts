import { Movie } from '../app/interfaces/Movie';
import api from './api';
class MovieService {


  async rateMovie(id: number, isLike: boolean): Promise<boolean> {
    try {
      await api.put(`/movies/rating/${id}/${isLike}`);
      return true;
    } catch (error) {
      console.error(`Error to rate movie with ID ${id}:`, error);
      return false;
    }
  }

  async createMovie(movieData: any): Promise<boolean> {
    try {
      await api.post('/movies', movieData);
      return true;
    } catch (error) {
      console.error('Error creating movie:', error);
      return false;
    }
  }

  async updateMovie(id: number, movieData: any): Promise<boolean> {
    try {
      await api.put(`/movies/${id}`, movieData);
      return true;
    } catch (error) {
      console.error(`Error updating movie with ID ${id}:`, error);
      return false;
    }
  }

  async deleteMovie(id: number): Promise<boolean> {
    try {
      await api.delete(`/movies/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting movie with ID ${id}:`, error);
      return false;
    }
  }

  async searchMovies(
    title?: string,
    description?: string,
    genre?: string,
    operation: string = "==",
    releaseDate?: Date,
    subscriptionType?: number,
    orderByProperty: string = "Title",
    pageIndex: number = 1,
    pageSize: number = 10
  ): Promise<Movie[]> {
    try {
      const response = await api.get('/movies/search', {
        params: {
          title,
          description,
          genre,
          operation,
          releaseDate,
          subscriptionType,
          orderByProperty,
          pageIndex,
          pageSize
        }
      });
      console.log("movies " ,response.data);
      return response.data;
    } catch (error) {
      console.error('Error searching movies:', error);
      return [];
    }
  }
}

export const movieService = new MovieService();
