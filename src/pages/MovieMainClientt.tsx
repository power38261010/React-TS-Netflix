import React, { useState } from 'react';
import { Box } from '@mui/material';
import CarrouselMoviesComponent from '../components/Movie/Client/CarrouselMoviesComponent';
import MovieItemModal from '../components/Movie/Client/MovieItemModal';
import PlayMovieComponent from '../components/Movie/Client/PlayMovieComponent';
import TrailerBestMoviesComponent from '../components/Movie/Client/TrailerBestMoviesComponent';
import { Movie } from '../app/interfaces/Movie';
import { RootState } from '../app/store';
import { useSelector } from 'react-redux';

const App: React.FC = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [selectedPlayMovie, setSelectedPlayMovie] = useState<Movie | null>(null);
  const { movies } = useSelector((state: RootState) => state.movies);


  const handleOpenModal = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  const handlePlayMovie = (movie: Movie) => {
    setSelectedPlayMovie(movie);
  };

  const handleClosePlayMovie = () => {
    setSelectedPlayMovie(null);
  };

  return (
    <>
      <TrailerBestMoviesComponent />
      <Box sx={{ bgcolor: '#141414', p: 2 }}>
        <CarrouselMoviesComponent movies={movies} onOpenModal={handleOpenModal} onOpenPlayMovie={handlePlayMovie} />
        <MovieItemModal movie={selectedMovie} onClose={handleCloseModal} onOpenPlayMovie={handlePlayMovie} />
        <PlayMovieComponent movie={selectedPlayMovie} onClosePlayMovie={handleClosePlayMovie} />
      </Box>
    </>
  );
};

export default App;
