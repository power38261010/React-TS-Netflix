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
  Snackbar,
  Alert,
  CircularProgress
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [loadingPay, setloadingPay] = useState(false);

  const handleConfirm = () => {
    if (isCreate !== null) {
      setloadingPay(true);
      const action = isCreate ? createMovie(stateMovie) : updateMovie(stateMovie);
      dispatch(action)
        .unwrap()
        .then(() => {
          setSnackbarSeverity('success');
          setSnackbarMessage(`Película ${isCreate ? "creada" : "actualizada"} correctamente`);
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarSeverity('error');
          setSnackbarMessage(`Error al ${isCreate ? "crear" : "actualizar"} la película`);
          setSnackbarOpen(true);
        })
        .finally(() => {
          setTimeout(() => {
            setloadingPay(false);
            setOpenModal(false);
          }, 6000);
        });
    }
  };

  const videoId = stateMovie?.trailerUrl?.split('v=')[1]?.split('&')[0];

  const onPlayerReady = (event: any) => {
    if (event?.target) {
      const player = event.target;
      player.playVideo();
      playerRef.current = player;
    } else {
      console.error('El objeto de video no está inicializado correctamente.');
    }
  };

  const handleVideoError = () => {
    setVideoError(true);
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    const updatedValue = name === 'rating' ? parseFloat(value?? 0) : value;
    setStateMovie({ ...stateMovie, [name]: updatedValue });
  };

  const handleSubscriptionChange = (event: any) => {
    const {
      target: { value },
    } = event;
    const selectedValues = typeof value === 'string' ? value.split(',') : value;

    const currentSubscriptions = stateMovie?.movieSubscriptions?.map(sub => sub.subscriptionId);

    const newSubscriptions = selectedValues
      .filter((subId: number) => !currentSubscriptions?.includes(subId))
      .map((subId: number) => anyMovieSubscription(stateMovie.id, subId));

    const remainingSubscriptions = stateMovie?.movieSubscriptions?.filter(sub =>
      selectedValues.includes(sub.subscriptionId)
    );
    console.log('newSubscriptions ',newSubscriptions,' remainingSubscriptions ',remainingSubscriptions )

    setStateMovie({
      ...stateMovie,
      movieSubscriptions: [...remainingSubscriptions?? [], ...newSubscriptions]
    });
    console.log('stateMovie ',stateMovie)
  };

  const anyMovieSubscription = (movieID: number, subscriptionID: number): MovieSubscriptionDto => {
    return { movieId: movieID, subscriptionId: subscriptionID };
  };

  const handleCreateMovie = () => {
    dispatch(createMovie(stateMovie));
    setOpenModal(false);
  };

  const handleUpdateMovie = () => {
    dispatch(updateMovie(stateMovie));
    setOpenModal(false);
  };

  return (
    <Modal open={!!movie} onClose={onClose} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderBlockColor:'white' }}>
      <Box className={styles.modalBox}>
        <IconButton onClick={onClose} sx={{ position: 'absolute', top: 8, right: 8, color: 'white'}}>
          <CloseIcon />
        </IconButton>
        <Box className={styles.modalContent} sx={{ mt : 4}}>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems:'center' , mb: 2 }}>
          <Box sx={{ width: '300px', maxHeigth:'65px', mr: 2 }}>
            <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
              <InputLabel id="genres-select-label">Géneros</InputLabel>
              <Select
                multiple
                sx={selectStyles}
                value={stateMovie?.genre?.split(' ')}
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
          <Box sx={{ width: '250px', mr: 2 }}>
            <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
              <InputLabel id="subscriptions-select-label">Subscripciones</InputLabel>
              <Select
                multiple
                sx={selectStyles}
                value={stateMovie?.movieSubscriptions?.map(ms => ms.subscriptionId)}
                onChange={handleSubscriptionChange}
                displayEmpty
                fullWidth
                className={styles.selector}
              >
                {subscriptions.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>{sub.type}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ width: '90px', heigth:'20px' , top:'20px', mb:2}}>
          <FormControl variant="outlined" size='small' fullWidth >
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
          </FormControl>
          </Box>
        </Box>
        <Box sx={{ mb: 2 }} className={styles.TextAreaBox}>
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
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirm}
          >
          {loadingPay ? <CircularProgress style={{color:'white'}} size={24} /> : isCreate ? 'Crear' : 'Actualizar'}
          </Button>
        </Box>
        {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' , color: 'white', background: 'black'}}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Box>
    </Modal>
  );
};

export default MovieItemModal;
