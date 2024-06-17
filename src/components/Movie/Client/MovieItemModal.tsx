import React from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import YouTube from 'react-youtube';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Movie } from '../../../app/interfaces/Movie';
import { useAuth } from '../../../contexts/AuthContext';

interface MovieItemModalProps {
  movie: Movie | null;
  onClose: () => void;
}

const MovieItemModal: React.FC<MovieItemModalProps> = ({ movie, onClose }) => {
  const { profile } = useAuth();
  
  if (!movie) return null;

  const opts = {
    height: '390', // Altura fija para mantener proporción del video
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      playlist: movie?.trailerUrl?.split('v=')[1].split('&')[0],
    },
  };

  return (
    <Modal open={!!movie} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '800px', bgcolor: 'black', color: 'white', p: 4, position: 'relative', borderRadius: 1 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ mb: 2 }}>
          <YouTube videoId={movie?.trailerUrl?.split('v=')[1].split('&')[0]} opts={opts} />
          <Box /*sx = {{ position: 'absolute', paddingBottom: -10, paddingLegt: -10, borderRadius:5  }} **/>
            <Typography variant="h4" sx={{ mb: 1 }}>{movie.title}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button disabled={!profile?.isPaid} variant="contained" color="primary" sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
          {profile?.isPaid && (<PlayCircleIcon sx={{ mr: 1 }} />) }
            {profile?.isPaid ? "Reproducir": "Renueva tu Subscripcion" }

          </Button>
          <IconButton sx={{ color: 'white' }}>
            <ThumbUpIcon />
          </IconButton>
          <IconButton sx={{ color: 'white' }}>
            <ThumbDownIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Géneros: </strong> {movie?.genre?.split(' ').join(', ')+'.'}
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Rating: </strong> {movie.rating}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Descripción: </strong> {movie.description}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
};

export default MovieItemModal;
