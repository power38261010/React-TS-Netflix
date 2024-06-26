import React, { useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Movie } from '../../../app/interfaces/Movie';
import { useAuth } from '../../../contexts/AuthContext';
import { rateMovie } from '../../../app/slices/moviesSlice';
import { AppDispatch } from '../../../app/store';
import { useDispatch } from 'react-redux';
import { AnimatedIconButton } from './AnimationRateMovie';
import styles from './TrailerBestMoviesComponent.module.css';

interface MovieItemComponentProps {
  movie: Movie;
  onOpenModal: (movie: Movie) => void;
  onOpenPlayMovie: (movie: Movie) => void;
}

const MovieItemComponent: React.FC<MovieItemComponentProps> = ({ movie, onOpenModal, onOpenPlayMovie }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile } = useAuth();
  const playerRef = useRef<any>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const handleVideoError = () => {
    setVideoError(true);
  };

  const onPlayerReady = (event: any) => {
    if (event?.target) {
      const player = event.target;
      player.playVideo();
      playerRef.current = player;
    } else {
      console.error('El objeto de video no está inicializado correctamente.');
    }
  };

  const rateThisMovie = (islikeIt: boolean) => {
    dispatch(rateMovie({ id: movie.id, isLike: islikeIt }));
  };

  const videoId = movie?.trailerUrl?.split('v=')[1]?.split('&')[0];

  const opts = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      loop: 1,
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
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 1)',
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
                <AnimatedIconButton onClick={() => rateThisMovie(true)} sx={{ color: 'white' }}>
                  <ThumbUpIcon />
                </AnimatedIconButton>
                <AnimatedIconButton onClick={() => rateThisMovie(false)} sx={{ color: 'red' }}>
                  <ThumbDownIcon />
                </AnimatedIconButton>
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
