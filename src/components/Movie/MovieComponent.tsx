// MovieComponent.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../app/store';
import { searchMovies, createMovie, updateMovie, deleteMovie } from '../../app/slices/moviesSlice';
import { Movie } from '../../app/interfaces/Movie';

const MovieComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies, loading, error } = useSelector((state: RootState) => state.movies);

  // Local state to handle form inputs
  const [newMovie, setNewMovie] = useState<Movie>({
    id: 0,
    title: '',
    description: '',
    genre: '',
    releaseDate: new Date(),
    posterUrl: '',
    trailerUrl: '',
    rating: 0,
    movieSubscriptions: [],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMovie({ ...newMovie, [e.target.name]: e.target.value });
  };

  const handleCreateMovie = () => {
    dispatch(createMovie(newMovie));
  };

  const handleUpdateMovie = (movie: Movie) => {
    dispatch(updateMovie(movie));
  };

  const handleDeleteMovie = (id: number) => {
    dispatch(deleteMovie(id));
  };

  useEffect(() => {
    dispatch(searchMovies({}));
  }, [dispatch]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Películas</h1>
      <ul>
        {movies.map(movie => (
          <li key={movie.id}>
            {movie.title}
            <button onClick={() => handleUpdateMovie({ ...movie, title: movie.title + ' (Updated)' })}>
              Update
            </button>
            <button onClick={() => handleDeleteMovie(movie.id)}>Delete</button>
          </li>
        ))}
      </ul>
      
      <h2>Create Movie</h2>
      <form>
        <input name="title" placeholder="Title" onChange={handleInputChange} />
        <input name="description" placeholder="Description" onChange={handleInputChange} />
        <input name="genre" placeholder="Genre" onChange={handleInputChange} />
        <input name="posterUrl" placeholder="Poster URL" onChange={handleInputChange} />
        <input name="trailerUrl" placeholder="Trailer URL" onChange={handleInputChange} />
        <input name="rating" placeholder="Rating" type="number" onChange={handleInputChange} />
        <button type="button" onClick={handleCreateMovie}>Create Movie</button>
      </form>
    </div>
  );
};

export default MovieComponent;
