import React, { useState } from 'react';
import { Box } from '@mui/material';
import CarrouselMoviesComponent from './CarrouselMoviesComponent';
import MovieItemModal from './MovieItemModal';
import TrailerBestMoviesComponent from './TrailerBestMoviesComponent';
import { Movie } from '../../../app/interfaces/Movie';
import { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const { movies } = useSelector((state: RootState) => state.movies);
  // const movies: Movie[] = [
  //   // Array de objetos Movie
  // ];

  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <>
      <TrailerBestMoviesComponent />
      <Box sx={{ bgcolor: '#141414', p: 2 }}>
        <CarrouselMoviesComponent movies={movies} onOpenModal={handleOpenModal} />
        <MovieItemModal movie={selectedMovie} onClose={handleCloseModal} />
      </Box>
    </>
  );
};

export default App;
