import React, { useRef, useState } from 'react';
import { Modal, Box, Typography, IconButton, Button } from '@mui/material';
import YouTube from 'react-youtube';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import { Movie } from '../../../app/interfaces/Movie';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { rateMovie } from '../../../app/slices/moviesSlice';
import { AppDispatch } from '../../../app/store';
import { useDispatch } from 'react-redux';
import { AnimatedIconButton} from './AnimationRateMovie';
import styles from './TrailerBestMoviesComponent.module.css';

interface MovieItemModalProps {
  movie: Movie | null;
  onClose: () => void;
  onOpenPlayMovie: (movie: Movie) => void;
}

const MovieItemModal: React.FC<MovieItemModalProps> = ({ movie, onClose, onOpenPlayMovie }) => {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [videoError, setVideoError] = useState(false);
  const playerRef = useRef<any>(null);

  if (!movie) return null;

  const videoId = movie?.trailerUrl?.split('v=')[1]?.split('&')[0];


  const onPlayerReady = (event: any) => {
    if (event?.target) {
      event?.target?.playVideo();
      playerRef.current = event?.target;
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const rateThisMovie = (islikeIt: boolean) => {
    dispatch (rateMovie ({id:movie.id ,isLike:islikeIt }) )
  }

  const opts = {
    height: '390',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
      // playlist: movie?.trailerUrl?.split('v=')[1].split('&')[0],
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
    <Modal open={!!movie} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box sx={{ width: '800px', bgcolor: 'black', color: 'white', p: 4, position: 'relative', borderRadius: 1 }}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
          <CloseIcon />
        </IconButton>
        <Box sx={{ mb: 2 }}>
          {videoError ? (
              <div className={styles.errorPopup}>Video no disponible</div>
            ) : (
              videoId && (
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={onPlayerReady}
                  onError={handleVideoError}
                />
              )
            )}
          <Box>
            <Typography variant="h4" sx={{ mb: 1 }}>{movie.title}</Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              if ( !!profile && profile?.isPaid ) {
                onClose();
                onOpenPlayMovie(movie);
              } else {
                navigate('/payment-create');
              }
            }}
            sx={{ mr: 2, display: 'flex', alignItems: 'center' }}
          >
            {profile?.isPaid && (<PlayCircleIcon sx={{ mr: 1 }} />)}
            {profile?.isPaid ? "Reproducir" : "Renueva tu Subscripcion"}
          </Button>
          <AnimatedIconButton onClick={() => rateThisMovie(true)} sx={{ color: 'white' }}>
            <ThumbUpIcon />
          </AnimatedIconButton>
          <AnimatedIconButton onClick={() => rateThisMovie(false)} sx={{ color: 'red' }}>
            <ThumbDownIcon />
          </AnimatedIconButton>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Typography variant="body1" sx={{ mb: 1 }}>
              <strong>Géneros: </strong> {movie?.genre?.split(' ').join(', ') + '.'}
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
