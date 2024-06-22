import React, { useRef, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTube from 'react-youtube';
import { Movie } from '../../../app/interfaces/Movie';
import styles from './MovieItemModal.module.css';
import { genres, roundToTwoDecimals } from '../../Helpers';
import { inputStyles , selectStyles} from '../../Helpers';
import { useDispatch } from 'react-redux';
import {  AppDispatch } from '../../../app/store';
import { createMovie, updateMovie } from '../../../app/slices/moviesSlice';
import { MovieSubscriptionDto } from '../../../app/interfaces/MovieSubscription';

interface MovieItemModalProps {
  movie: Movie | null;
  onClose: () => void;
  isCreate: boolean;
  subscriptions: any[];
  setOpenModal: (e: boolean) => void;
}

const MovieItemModal: React.FC<MovieItemModalProps> = ({
  movie,
  onClose,
  isCreate,
  subscriptions,
  setOpenModal,
}) => {
  const [stateMovie, setStateMovie] = useState<Movie>(movie || {
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
  const dispatch = useDispatch<AppDispatch>();

  const [videoError, setVideoError] = useState(false);
  const playerRef = useRef<any>(null);

  const videoId = stateMovie?.trailerUrl?.split('v=')[1]?.split('&')[0];

  const onPlayerReady = (event: any) => {
    if (event?.target) {
      event?.target?.playVideo();
      playerRef.current = event?.target;
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateMovie({ ...stateMovie, [e.target.name]: e.target.value });
  };

  const getTypesSubscription = (moviesSub: MovieSubscriptionDto[]) => {
    let idsSubs = moviesSub?.map(ms => ms.subscriptionId);
    let matchSub = subscriptions?.filter(s => idsSubs?.includes(s.id))?.map(sf => sf.type);
    return matchSub?.join(', ');
  };

  const handlePushSubscription = (e: React.ChangeEvent<{ value: unknown }>) => {
    let ms: MovieSubscriptionDto[] = [];
    if (stateMovie?.movieSubscriptions && stateMovie.movieSubscriptions.length > 0) ms = [...stateMovie.movieSubscriptions];
    ms.push(anyMovieSubscription(stateMovie.id, parseInt(e.target.value as string) ?? 0));
    setStateMovie({ ...stateMovie, movieSubscriptions: ms });
  };

  const handleRemoveSubscription = (subscriptionId: number) => {
    let ms: MovieSubscriptionDto[] = [];
    if (stateMovie?.movieSubscriptions && stateMovie.movieSubscriptions.length > 0) {
      ms = [...stateMovie.movieSubscriptions];
      ms = ms.filter(item => item.subscriptionId !== subscriptionId);
      setStateMovie({ ...stateMovie, movieSubscriptions: ms });
    }
  };

  const anyMovieSubscription = (movieID: number, subscriptionID: number): MovieSubscriptionDto => {
    return { movieId: movieID, subscriptionId: subscriptionID };
  };

  const handleCreateMovie = () => {
    dispatch(createMovie(stateMovie));
    setOpenModal(false);
  };

  const handleUpdateMovie = () => {
    dispatch(updateMovie( stateMovie));
    setOpenModal(false);
  };

  return (
    <Modal open={!!movie} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box className={styles.modalBox}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}>
          <CloseIcon />
        </IconButton>
        <Box className={styles.modalContent}>
          {videoError ? (
            <div className={styles.errorPopup}>Video no disponible</div>
          ) : (
            videoId && (
              <YouTube
                videoId={videoId}
                opts={{
                  height: '390',
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
                }}
                onReady={onPlayerReady}
                onError={handleVideoError}
              />
            )
          )}
          <div className={styles.movieInfoModal}>
          <TextField
              label="URL del Trailer"
              name="trailerUrl"
              sx={inputStyles}
              value={stateMovie.trailerUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Título"
              name="title"
              sx={inputStyles}
              value={stateMovie.title}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
          <div className={styles.movieInfoModal}>
            {stateMovie.posterUrl ? (
              <img src={stateMovie.posterUrl} alt="Poster" className={styles.poster} />
            ) : (
              'No disponible'
            )}
            <TextField
              label="URL del Poster"
              name="posterUrl"
              sx={inputStyles}
              value={stateMovie.posterUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
          <FormControl variant="outlined" size='small' fullWidth  sx={selectStyles }>
            <InputLabel id="genres-select-label">Géneros</InputLabel>
            <Select
              multiple
              sx={selectStyles}
              value={stateMovie?.genre?.split(' ') }
              onChange={(e) => setStateMovie({ ...stateMovie, genre: (e.target.value as string[]).join(' ') })}
              displayEmpty
              fullWidth
              className={styles.selector}
            >
              {genres.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
            </FormControl>

          </Box>
          <Box sx={{ flex: 1, mr: 2 }}>
          <FormControl variant="outlined" size='small' fullWidth  sx={selectStyles }>
          <InputLabel id="subscriptions-select-label">Subscripciones</InputLabel>
            <Select
              multiple
              sx={selectStyles}
              value={stateMovie?.movieSubscriptions?.map(ms => ms.subscriptionId)}
              onChange={() => handlePushSubscription}
              displayEmpty
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip
                      key={value}
                      label={subscriptions.find((sub) => sub.id === value)?.type}
                      onDelete={() => handleRemoveSubscription(value)}
                      sx={{ backgroundColor: '#000', color: '#fff' }}
                    />
                  ))}
                </Box>
              )}
              fullWidth
              className={styles.selector}
            >
              {subscriptions.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>{sub.type}</MenuItem>
              ))}
            </Select>
            </FormControl>

          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Rating"
              name="rating"
              sx={inputStyles}
              value={roundToTwoDecimals(stateMovie.rating)}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              type="number"
            />
          </Box>
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Descripción"
            name="description"
            sx={inputStyles}
            value={stateMovie.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ display:'flex',justifyContent: 'center', mb:4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={isCreate ? handleCreateMovie : handleUpdateMovie}
          >
            {isCreate ? 'Crear' : 'Actualizar'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default MovieItemModal;
