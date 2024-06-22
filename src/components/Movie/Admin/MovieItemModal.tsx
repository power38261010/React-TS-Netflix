// MovieItemModal.tsx
import React, { useRef, useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Select
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import YouTube from 'react-youtube';
import { Movie } from '../../../app/interfaces/Movie';
import { MovieSubscriptionDto } from '../../../app/interfaces/MovieSubscription';
import styles from './MovieItemModal.module.css';
import { genres } from '../../Helpers';

interface MovieItemModalProps {
  movie: Movie | null;
  onClose: () => void;
  isCreate: boolean;
  handleCreateMovie: () => void;
  handleUpdateMovie: () => void;
  subscriptions: any[];
  handlePushSubscription: (e: React.ChangeEvent<{ value: unknown }>) => void;
  handleRemoveSubscription: (subscriptionId: number) => void;
}

const MovieItemModal: React.FC<MovieItemModalProps> = ({
  movie,
  onClose,
  isCreate,
  handleCreateMovie,
  handleUpdateMovie,
  subscriptions,
  handlePushSubscription,
  handleRemoveSubscription
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
              label="Título"
              name="title"
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
              value={stateMovie.posterUrl}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
            />
          </div>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Select
              multiple
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
          </Box>
          <Box sx={{ flex: 1, mr: 2 }}>
            <Select
              multiple
              value={stateMovie?.movieSubscriptions?.map(ms => ms.subscriptionId)}
              onChange={()=>handlePushSubscription}
              displayEmpty
              fullWidth
              className={styles.selector}
            >
              {subscriptions.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>{sub.type}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box sx={{ flex: 1 }}>
            <TextField
              label="Rating"
              name="rating"
              value={stateMovie.rating}
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
            value={stateMovie.description}
            onChange={handleInputChange}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
        </Box>
        <Box sx={{ mb: 2 }}>
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
