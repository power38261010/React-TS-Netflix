import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { getBestMovies, searchMovies } from '../../../app/slices/moviesSlice';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from './TrailerBestMoviesComponent.module.css';
import { useInView } from 'react-intersection-observer';
import { roundToTwoDecimals, selectStyles } from '../../Helpers';
import { Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import Info from '@mui/icons-material/Info';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Movie } from '../../../app/interfaces/Movie';
import { genres } from '../../Helpers';

interface TrailerBestMoviesProps {
  onOpenPlayMovie: (movie: Movie) => void;
  onOpenModal: (movie: Movie) => void;
}

const TIME_TRANSITION_BEST_MOVIES = parseInt(process.env.TIME_TRANSITION_BEST_MOVIES ?? "60") * 1000

const TrailerBestMoviesComponent: React.FC<TrailerBestMoviesProps> = ({ onOpenPlayMovie, onOpenModal }) => {

  const { profile } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { bestMovies} = useSelector((state: RootState) => state.movies);

  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [genre, setGenre] = useState<string>("");
  const [videoError, setVideoError] = useState(false);
  const playerRef = useRef<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
  dispatch(getBestMovies({}));

    dispatch(searchMovies({ genre: genre }));
  }, [dispatch, genre]);

  useEffect(() => {
    if (bestMovies.length > 0) {

      const timer = setInterval(() => {
        if (isVisible) {
          setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % bestMovies.length);
        }
      }, TIME_TRANSITION_BEST_MOVIES);

      return () => clearInterval(timer);
    }
  }, [bestMovies, isVisible]);

  const currentTrailer = bestMovies[currentTrailerIndex];
  const videoId = currentTrailer?.trailerUrl?.split('v=')[1]?.split('&')[0];

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      disablekb: 1,
      fs: 0,
      controls: 0,
      quality: 'hd1080',
    },
  };

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
  

  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === 0) {
      setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % bestMovies.length);
    }
  };

  const handleSlideChange = (index: number) => {
    setCurrentTrailerIndex(index);
    if (playerRef.current) {
      playerRef.current.playVideo();
    }
  };

  const { ref } = useInView({
    threshold: 0.73,
    onChange: (inView) => {
      setIsVisible(inView);
      if (!inView) {
        playerRef.current?.pauseVideo();
      } else {
        playerRef.current?.playVideo();
      }
    },
  });



  return (
    <div className={styles.trailerContainer} ref={ref}>
      <div className={styles.genreSelectContainer}>
        <FormControl variant="outlined" fullWidth sx={selectStyles}>
          <InputLabel id="genre-select-label">Género</InputLabel>
          <Select
            labelId="genre-select-label"
            id="genre-select"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            label="Género"
          >
            <MenuItem key="Todos" selected={ (genre === '') } value=""><em>Todos</em></MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre} value={genre}>{genre}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      {videoError ? (
        <div className={styles.errorPopup}>Video no disponible</div>
      ) : (
        videoId && (
          <YouTube
            videoId={videoId}
            opts={opts}
            onReady={onPlayerReady}
            onError={handleVideoError}
            onStateChange={onPlayerStateChange}
          />
        )
      )}
      <div className={styles.movieInfo}>
        {currentTrailer ? (
          <>
            <h2>{currentTrailer.title}</h2>
            <div className={styles.rating}>Ranking: {roundToTwoDecimals(currentTrailer.rating)}</div>
          </>
        ) : (
          <div>No hay trailers disponibles</div>
        )}
      </div>
      <div className={styles.moviePlay}>
        <Button
          variant="contained"
          startIcon={<PlayArrowIcon sx={{ height: 15 }} />}
          onClick={() => {
            playerRef.current?.pauseVideo();
            if (!!profile && profile?.isPaid) {
              onOpenPlayMovie(currentTrailer);
            } else {
              navigate('/payment-create');
            }
          }}
          sx={{
            mr: 2,
            bottom: 2,
            left: 2,
            backgroundColor: '#fff',
            color: '#000',
            fontSize: '24px',
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#777',
            },
          }}
        >
          {profile?.isPaid ? "Reproducir" : "Renueve su Subscripcion"}
        </Button>

        <Button
          variant="contained"
          startIcon={<Info fontSize='large' />}
          onClick={() => {
            playerRef.current?.pauseVideo();
            onOpenModal(currentTrailer);
          }}
          sx={{
            mr: 2,
            bottom: 2,
            left: 2,
            backgroundColor: '#777',
            color: '#fff',
            fontSize: '24px',
            textTransform: 'none',
            borderRadius: '6px',
            '&:hover': {
              backgroundColor: '#555',
            },
          }}
        >
          Más información
        </Button>
      </div>
      <div className={styles.slideControls}>
        {bestMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={index === currentTrailerIndex ? styles.activeSlide : ''}
          />
        ))}
      </div>
    </div>
  );
};

export default TrailerBestMoviesComponent;
