import React, { useRef, useState, useEffect } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MovieItemComponent from './MovieItemComponent';
import { Movie } from '../../../app/interfaces/Movie';

interface CarrouselMoviesComponentProps {
  movies: Movie[];
  onOpenModal: (movie: Movie) => void;
  onOpenPlayMovie: (movie: Movie) => void;
}

const genres = [
  "Accion", "Drama", "Belico", "Comedia", "Ciencia-Ficcion",
  "Suspenso", "Aventura", "Fantasia", "Horror", "Documental",
  "Futurista", "Retro"
];

const CarrouselMoviesComponent: React.FC<CarrouselMoviesComponentProps> = ({ movies, onOpenModal, onOpenPlayMovie }) => {
  const genreRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const handleScroll = (genre: string) => {
    const ref = genreRefs.current[genre];
    if (ref) {
      const { scrollLeft, scrollWidth, clientWidth } = ref;
      setShowLeftChevron(genre, scrollLeft > 0);
      setShowRightChevron(genre, scrollWidth - scrollLeft > clientWidth);
    }
  };

  const scrollRight = (genre: string) => {
    const ref = genreRefs.current[genre];
    if (ref) {
      ref.scrollBy({ left: 340, behavior: 'smooth' });
    }
  };

  const scrollLeft = (genre: string) => {
    const ref = genreRefs.current[genre];
    if (ref) {
      ref.scrollBy({ left: -340, behavior: 'smooth' });
    }
  };

  const [chevronVisibility, setChevronVisibility] = useState<{ [key: string]: { left: boolean; right: boolean } }>({});

  const setShowLeftChevron = (genre: string, show: boolean) => {
    setChevronVisibility((prev) => ({ ...prev, [genre]: { ...prev[genre], left: show } }));
  };

  const setShowRightChevron = (genre: string, show: boolean) => {
    setChevronVisibility((prev) => ({ ...prev, [genre]: { ...prev[genre], right: show } }));
  };

  useEffect(() => {
    genres.forEach((genre) => {
      handleScroll(genre);
    });
  }, [movies]);

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
              {chevronVisibility[genre]?.left && (
                <IconButton onClick={() => scrollLeft(genre)} sx={{ ml: 2 }}>
                  <ChevronLeftIcon style={{ color: 'white' }} />
                </IconButton>
              )}
              <Box
                ref={(el: any) => { genreRefs.current[genre] = el }}
                onScroll={() => handleScroll(genre)}
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
                <Box sx={{ ml: 3 }}></Box>
                {moviesByGenre.map((movie) => (
                  <Box key={movie.id} sx={{ m: 2, flexShrink: 0, transition: 'transform 0.3s' }}>
                    <Box
                      key={movie.id}
                      sx={{
                        marginY: 2,
                        flexShrink: 0,
                        transition: 'transform 0.3s',
                        position: 'relative',
                        zIndex: 1,
                        '&:hover': {
                          transform: 'scale(1.3)',
                          zIndex: 10,
                        }
                      }}
                    >
                      <MovieItemComponent movie={movie} onOpenModal={onOpenModal} onOpenPlayMovie={onOpenPlayMovie} />
                    </Box>
                  </Box>
                ))}
                <Box sx={{ mr: 3 }}></Box>
              </Box>
              {chevronVisibility[genre]?.right && (
                <IconButton onClick={() => scrollRight(genre)} sx={{ ml: 2 }}>
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
