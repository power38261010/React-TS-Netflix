import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { searchMovies, deleteMovie } from '../../../app/slices/moviesSlice';
import { Movie } from '../../../app/interfaces/Movie';
import { MovieSubscriptionDto } from '../../../app/interfaces/MovieSubscription';
import {
  Box,
  Button,
  IconButton,
  Input,
  Modal,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Search as SearchIcon } from '@mui/icons-material';
import styles from './MovieComponent.module.css';
import { genres, roundToTwoDecimals } from '../../Helpers';
import MovieItemModal from './MovieItemModal';
import { getAllSubscriptions } from '../../../app/slices';
import { inputStyles, selectStyles } from '../../Helpers';
import styled from '@mui/styled-engine';

// Estilos personalizados para el modal de confirmación
const ConfirmDeleteModalPaper = styled(Paper)`
  position: absolute;
  width: 30vw;
  height: 15vh;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #141414; /* Color oscuro estilo Netflix */
  color: white; /* Texto blanco */
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;


const MovieComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies } = useSelector((state: RootState) => state.movies);
  const { subscriptions } = useSelector((state: RootState) => state.subscriptions);

  const [anyMovie, setAnyMovie] = useState<Movie>({
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

  const [searchTerm, setSearchTerm] = useState('');
  const [genre, setGenre] = useState('');
  const [subscriptionType, setSubscriptionType] = useState<number | undefined>(undefined);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(20);
  const [isCreate, setIsCreate] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState<number | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const getTypesSubscription = (moviesSub: MovieSubscriptionDto[]) => {
    let idsSubs = moviesSub?.map(ms => ms.subscriptionId);
    let matchSub = subscriptions?.filter(s => idsSubs?.includes(s.id))?.map(sf => sf.type);
    return matchSub?.join(', ');
  };

  const handleDeleteCandidate = (id: number) => {
    setDeleteCandidateId(id);
    setConfirmDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteCandidateId !== null) {
      dispatch(deleteMovie(deleteCandidateId))
        .unwrap()
        .then(() => {
          setSnackbarSeverity('success');
          setSnackbarMessage('Película eliminada correctamente');
          setSnackbarOpen(true);
        })
        .catch((error) => {
          setSnackbarSeverity('error');
          setSnackbarMessage('Error al eliminar la película');
          setSnackbarOpen(true);
        })
        .finally(() => {
          setDeleteCandidateId(null);
          setConfirmDeleteModalOpen(false);
        });
    }
  };

  const handleCancelDelete = () => {
    setDeleteCandidateId(null);
    setConfirmDeleteModalOpen(false);
  };

  const handleSearch = () => {
    dispatch(searchMovies({ title: searchTerm, genre, subscriptionType, pageIndex, pageSize }));
  };

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, []);

  useEffect(() => {
    handleSearch();
  }, [dispatch, genre, subscriptionType, pageIndex]);

  return (
    <div className={styles.container} >
      <div className={styles.searchContainer}>
        <div className={styles.search}>
          <TextField
            fullWidth
            size='small'
            label="Buscar"
            name="searchTerm"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            sx={inputStyles}
          />
          <SearchIcon className={styles.searchIcon} onClick={handleSearch} />
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
            <InputLabel id="genre-select-label">Género</InputLabel>
            <Select
              value={genre}
              onChange={(e) => setGenre(e.target.value as string)}
              label="Género"
              className={styles.selector}
            >
              <MenuItem key="Todos" selected={(genre === '')} value=""><em>Todos</em></MenuItem>
              {genres.map((g) => (
                <MenuItem key={g} value={g}>{g}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth sx={selectStyles}>
            <InputLabel id="subscription-select-label">Subscripcion</InputLabel>
            <Select
              value={subscriptionType}
              onChange={(e) => setSubscriptionType(e.target.value as number)}
              label="Subscripcion"
              className={styles.selector}
            >
              <MenuItem key="Todos" selected={(subscriptionType === undefined)} value=""><em>Todos</em></MenuItem>
              {subscriptions.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>{sub.type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className={styles.genreSelectContainer}>
          <Button
            variant="contained"
            color="primary"
            size='medium'
            onClick={() => {
              setAnyMovie({
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
              setIsCreate(true);
              setOpenModal(true);
            }}
          >
            Nueva Película
          </Button>
        </div>
      </div>

      <TableContainer component={Paper} sx={{ background: 'black', color: 'white' }} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: 'white' }}>Imagen</TableCell>
              <TableCell sx={{ color: 'white' }}>Titulo</TableCell>
              <TableCell sx={{ color: 'white' }}>Rating</TableCell>
              <TableCell sx={{ color: 'white' }}>Genero</TableCell>
              <TableCell sx={{ color: 'white' }}>Descripcion</TableCell>
              <TableCell sx={{ color: 'white' }}>Subscripciones</TableCell>
              <TableCell sx={{ color: 'white' }}>Fecha de Lanzamiento</TableCell>
              <TableCell sx={{ color: 'white' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className={styles.cell}>
                  <img src={movie.posterUrl} alt={"Sin Imagen"} className={styles.poster} />
                </TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{movie.title}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{roundToTwoDecimals(movie.rating)}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{movie.genre}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.shortenDescription}>{movie.description}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{getTypesSubscription(movie?.movieSubscriptions || [])}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>{new Date(movie?.releaseDate || '').toLocaleDateString()}</TableCell>
                <TableCell sx={{ color: 'white' }} className={styles.cell}>
                  <IconButton
                    onClick={() => {
                      setAnyMovie(movie);
                      setIsCreate(false);
                      setOpenModal(true);
                    }}
                  >
                    <EditIcon sx={{ color: 'white' }} className={styles.editIcon} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteCandidate(movie.id)}>
                    <DeleteIcon className={styles.deleteIcon} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box className={styles.pagination}>
        <Button onClick={() => setPageIndex(pageIndex - 1)} disabled={pageIndex === 1}>{"<"}</Button>
        <Typography variant="body2">{pageIndex}</Typography>
        <Button onClick={() => setPageIndex(pageIndex + 1)} disabled={movies.length < pageSize}>{">"}</Button>
      </Box>
      {openModal && (
        <MovieItemModal
          movie={anyMovie}
          onClose={() => setOpenModal(false)}
          isCreate={isCreate}
          subscriptions={subscriptions}
          setOpenModal={setOpenModal}
        />
      )}
      {/* Confirmación de eliminación */}
      <Modal
        open={confirmDeleteModalOpen}
        onClose={handleCancelDelete}
        aria-labelledby="confirm-delete-modal"
        aria-describedby="confirm-delete-modal-description"
      >
        <ConfirmDeleteModalPaper>
          <Typography variant="h6" component="h2" gutterBottom>
            Confirmar eliminación
          </Typography>
          <Typography variant="body1" gutterBottom>
            ¿Está seguro que desea eliminar esta película?
          </Typography>
          <Box className={styles.confirmDeleteButtons}>
            <Button variant="contained" color="primary" onClick={handleConfirmDelete} style={{ marginRight: '8px' }}>
              Sí
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleCancelDelete}>
              No
            </Button>
          </Box>
        </ConfirmDeleteModalPaper>
      </Modal>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default MovieComponent;
