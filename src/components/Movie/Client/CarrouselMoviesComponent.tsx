import React, { useRef, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieItemComponent from './MovieItemComponent';
import { Movie } from '../../../app/interfaces/Movie';

interface CarrouselMoviesComponentProps {
  movies: Movie[];
  onOpenModal: (movie: Movie) => void;
}

const genres = [
  "Accion", "Drama", "Belico", "Comedia", "Ciencia-Ficcion",
  "Suspenso", "Aventura", "Fantasia", "Horror", "Documental",
  "Futurista", "Retro"
];

const CarrouselMoviesComponent: React.FC<CarrouselMoviesComponentProps> = ({ movies, onOpenModal }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftChevron, setShowLeftChevron] = useState(false);
  const [showRightChevron, setShowRightChevron] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftChevron(scrollLeft > 0);
      setShowRightChevron(scrollWidth - scrollLeft > clientWidth);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  return (
    <Box>
      {genres.map((genre) => {
        const moviesByGenre = movies.filter((movie) => movie?.genre?.includes(genre));
        if (moviesByGenre.length === 0) return null;

        return (
          <Box key={genre} sx={{ mb: 4 }}>
            <Typography variant="h4" sx={{ mb: 2, color: 'white' }}>
              {genre}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {showLeftChevron && (
                <IconButton onClick={scrollLeft} sx={{ ml: 2 }}>
                  <ChevronLeftIcon style={{ color: 'white' }} />
                </IconButton>
              )}
              <Box
                ref={scrollRef}
                onScroll={handleScroll}
                sx={{
                  display: 'flex',
                  overflowX: 'auto',
                  whiteSpace: 'nowrap',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  '&::-webkit-scrollbar': {
                    display: 'none',
                  },
                }}
              >
                {moviesByGenre.map((movie) => (
                  <Box key={movie.id} sx={{ mr: 0.5, flexShrink: 0 }}>
                    <MovieItemComponent movie={movie} onOpenModal={onOpenModal} />
                  </Box>
                ))}
              </Box>
              {showRightChevron && (
                <IconButton onClick={scrollRight} sx={{ ml: 2 }}>
                  <ChevronRightIcon style={{ color: 'white' }} />
                </IconButton>
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default CarrouselMoviesComponent;
