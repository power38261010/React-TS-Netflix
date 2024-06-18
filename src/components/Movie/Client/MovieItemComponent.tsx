import React, { useState } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Movie } from '../../../app/interfaces/Movie';
import { useAuth } from '../../../contexts/AuthContext';

interface MovieItemComponentProps {
  movie: Movie;
  onOpenModal: (movie: Movie) => void;
  onOpenPlayMovie: (movie: Movie) => void;
}

const MovieItemComponent: React.FC<MovieItemComponentProps> = ({ movie, onOpenModal, onOpenPlayMovie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { profile } = useAuth();

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: movie?.trailerUrl?.split('v=')[1].split('&')[0],
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
      controls: 0,
      quality: 'hd1080',
    },
  };

  return (
    <Box
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        position: 'relative',
        height: '250px',
        width: '300px',
        overflow: 'hidden',
      }}
    >
      {isHovered ? (
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <YouTube videoId={movie?.trailerUrl?.split('v=')[1].split('&')[0]} opts={opts} />
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="body1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {profile?.isPaid && (
                  <IconButton onClick={() => onOpenPlayMovie(movie)}>
                    <PlayCircleIcon style={{ color: 'white' }} />
                  </IconButton>
                )}
                <IconButton>
                  <ThumbUpIcon style={{ color: 'white' }} />
                </IconButton>
                <IconButton>
                  <ThumbDownIcon style={{ color: 'red' }} />
                </IconButton>
              </Box>
              <Tooltip title="Más detalles">
                <IconButton onClick={() => onOpenModal(movie)} sx={{ mr: '8px' }}>
                  <ExpandMoreIcon style={{ color: 'white' }} />
                </IconButton>
              </Tooltip>
            </Box>
            <Typography variant="body2" color="white">
              {movie.genre}
            </Typography>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            minHeight: '250px',
            minWidth: '300px',
            width: '100%',
            background: `url(${movie?.posterUrl}) center center/cover no-repeat`,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: 'white',
              padding: '10px',
              boxSizing: 'border-box',
            }}
          >
            <Typography variant="h6" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {movie.title}
            </Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default MovieItemComponent;
