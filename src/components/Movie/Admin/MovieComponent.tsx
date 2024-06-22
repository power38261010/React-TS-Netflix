// MovieComponent.tsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { searchMovies, createMovie, updateMovie, deleteMovie } from '../../../app/slices/moviesSlice';
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
  InputLabel
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Height, Search as SearchIcon, WidthNormal } from '@mui/icons-material';
import styles from './MovieComponent.module.css';
import { genres } from '../../Helpers';
import MovieItemModal from './MovieItemModal';
import { getAllSubscriptions } from '../../../app/slices';
import { inputStyles , selectStyles} from '../../Helpers';

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

  const getTypesSubscription = (moviesSub: MovieSubscriptionDto[]) => {
    let idsSubs = moviesSub?.map(ms => ms.subscriptionId);
    let matchSub = subscriptions?.filter(s => idsSubs?.includes(s.id))?.map(sf => sf.type);
    return matchSub?.join(', ');
  };

  const handlePushSubscription = (e: React.ChangeEvent<{ value: unknown }>) => {
    let ms: MovieSubscriptionDto[] = [];
    if (anyMovie?.movieSubscriptions && anyMovie.movieSubscriptions.length > 0) ms = [...anyMovie.movieSubscriptions];
    ms.push(anyMovieSubscription(anyMovie.id, parseInt(e.target.value as string) ?? 0));
    setAnyMovie({ ...anyMovie, movieSubscriptions: ms });
  };

  const handleRemoveSubscription = (subscriptionId: number) => {
    let ms: MovieSubscriptionDto[] = [];
    if (anyMovie?.movieSubscriptions && anyMovie.movieSubscriptions.length > 0) {
      ms = [...anyMovie.movieSubscriptions];
      ms = ms.filter(item => item.subscriptionId !== subscriptionId);
      setAnyMovie({ ...anyMovie, movieSubscriptions: ms });
    }
  };

  const anyMovieSubscription = (movieID: number, subscriptionID: number): MovieSubscriptionDto => {
    return { movieId: movieID, subscriptionId: subscriptionID };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAnyMovie({ ...anyMovie, [e.target.name]: e.target.value });
  };

  const handleCreateMovie = () => {
    dispatch(createMovie(anyMovie));
    setOpenModal(false);
  };

  const handleUpdateMovie = () => {
    dispatch(updateMovie( anyMovie));
    setOpenModal(false);
  };

  const handleDeleteMovie = (id: number) => {
    if (window.confirm('¿Quiere eliminar esta Pelicula?')) {
      dispatch(deleteMovie(id));
    }
  };

  const handleSearch = () => {
    dispatch(searchMovies({ title: searchTerm, genre, subscriptionType, pageIndex, pageSize }));
  };


  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, []);

  useEffect(() => {
    handleSearch();
  }, [dispatch, searchTerm, genre, subscriptionType, pageIndex]);

  return (
    <div className={styles.container}>
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
            sx={inputStyles}
          />
          <SearchIcon className={styles.searchIcon} onClick={handleSearch} />
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth  sx={selectStyles }>
            <InputLabel id="genre-select-label">Género</InputLabel>
              <Select
                value={genre}
                onChange={(e) => setGenre(e.target.value as string)}
                label="Género"
                className={styles.selector}
              >
                <MenuItem key="Todos" selected={ (genre === '') } value=""><em>Todos</em></MenuItem>
                {genres.map((g) => (
                  <MenuItem key={g} value={g}>{g}</MenuItem>
                ))}
              </Select>
          </FormControl>
        </div>
        <div className={styles.genreSelectContainer}>
          <FormControl variant="outlined" size='small' fullWidth  sx={selectStyles}>
            <InputLabel id="genre-select-label">Subscripcion</InputLabel>
              <Select
                value={subscriptionType}
                onChange={(e) => setSubscriptionType(e.target.value as number)}
                label="Subscripcion"
                className={styles.selector}
              >
                <MenuItem key="Todos" selected={ (subscriptionType === undefined) } value=""><em>Todos</em></MenuItem>
                {subscriptions.map((sub) => (
                  <MenuItem key={sub.id} value={sub.id}>{sub.type}</MenuItem>
                ))}
              </Select>
          </FormControl>
        </div>

        <Button
          variant="contained"
          color="primary"
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
      <TableContainer component={Paper} className={styles.tableContainer}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Pelicula</TableCell>
              <TableCell>Genero</TableCell>
              <TableCell>Descripcion</TableCell>
              <TableCell>Subscripciones</TableCell>
              <TableCell>Fecha de Lanzamiento</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {movies.map((movie) => (
              <TableRow key={movie.id}>
                <TableCell className={styles.cell}>
                  <img src={movie.posterUrl} alt={movie.title} className={styles.poster} />
                  <div className={styles.titleOverlay}>{movie.title}</div>
                  <div className={styles.ratingOverlay}>{movie.rating}</div>
                </TableCell>
                <TableCell className={styles.cell}>{movie.genre}</TableCell>
                <TableCell className={styles.cell}>{movie.description}</TableCell>
                <TableCell className={styles.cell}>{getTypesSubscription(movie?.movieSubscriptions || [] )}</TableCell>
                <TableCell className={styles.cell}>{new Date(movie?.releaseDate || '').toLocaleDateString()}</TableCell>
                <TableCell className={styles.cell}>
                  <IconButton
                    onClick={() => {
                      setAnyMovie(movie);
                      setIsCreate(false);
                      setOpenModal(true);
                    }}
                  >
                    <EditIcon className={styles.editIcon} />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteMovie(movie.id)}>
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
          handleCreateMovie={handleCreateMovie}
          handleUpdateMovie={handleUpdateMovie}
          subscriptions={subscriptions}
          handlePushSubscription={handlePushSubscription}
          handleRemoveSubscription={handleRemoveSubscription}
        />
      )}
    </div>
  );
};

export default MovieComponent;
