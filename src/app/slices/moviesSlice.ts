import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { movieService } from '../../services/movieService';
import { Movie } from '../interfaces/Movie';

interface RateMovie {
  id: number;
  isLike: boolean;
}

export const createMovie = createAsyncThunk('movies/createMovie', async (movie: Movie) => {
  await movieService.createMovie(movie);
  return movie;
});

export const updateMovie = createAsyncThunk('movies/updateMovie', async (movie: Movie) => {
  await movieService.updateMovie(movie.id, movie);
  return movie;
});

export const deleteMovie = createAsyncThunk('movies/deleteMovie', async (id: number) => {
  await movieService.deleteMovie(id);
  return id;
});

export const searchMovies = createAsyncThunk('movies/searchMovies',
  async ({
    title,
    description,
    genre,
    operation,
    releaseDate,
    subscriptionType,
    orderByProperty,
    pageIndex,
    pageSize
  }: {
    title?: string;
    description?: string;
    genre?: string;
    operation?: string;
    releaseDate?: Date;
    subscriptionType?: number;
    orderByProperty?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    return movieService.searchMovies(
      title,//titulo
      description, //descripcion de la peliucla
      genre, // genero
      operation, // operacion( '==' , '<=','>=', '!=' ) -> where movie.releaseDate "operacion" params.releaseDate
      releaseDate, // releaseDate (params.releaseDate)
      subscriptionType, // subscription.id
      orderByProperty, // irrelevante
      pageIndex, // indice -> paginado ( Siguiente y Anterior)
      pageSize // tamaño en cantidad de registros -> paginado
    );
  }
);

export const getBestMovies = createAsyncThunk('movies/getBestMovies',
  async ({
    title,
    description,
    genre,
    operation,
    releaseDate,
    subscriptionType,
    orderByProperty,
    pageIndex,
    pageSize
  }: {
    title?: string;
    description?: string;
    genre?: string;
    operation?: string;
    releaseDate?: Date;
    subscriptionType?: number;
    orderByProperty?: string;
    pageIndex?: number;
    pageSize?: number;
  }) => {
    let bestMoviesSlice = await movieService.searchMovies(
      title,
      description,
      genre,
      operation,
      releaseDate,
      subscriptionType,
      orderByProperty,
      pageIndex,
      pageSize
    );
    console.log("bestMoviesSlice ",bestMoviesSlice)
    let bms = [...bestMoviesSlice].sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
    return bms?.slice(0, 3);
  }
);

export const rateMovie = createAsyncThunk('movies/rateMovie', async (rate: RateMovie)  => {
  let success = await movieService.rateMovie(rate.id, rate.isLike);
  let rateAux : RateMovie = {
    id: 0,
    isLike: false
  }
  if ( !success ) {
    return rateAux;
  }
  return  rate;
});

interface MoviesState {
  movies: Movie[];
  bestMovies: Movie[];
  loading: boolean;
  error: string | null;
}

const initialState: MoviesState = {
  movies: [],
  bestMovies: [],
  loading: false,
  error: null,
};

// Funciones auxiliares para manejar los estados de las acciones asíncronas
const handlePending = (state: MoviesState) => {
  state.loading = true;
  state.error = null;
};

const handleRejected = (state: MoviesState, action: any) => {
  state.loading = false;
  console.log("action.error ", action.error)
  state.error = action.error.message ?? 'Error al realizar la acción';
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    addMovie: (state, action: PayloadAction<Movie>) => {
      state.movies.push(action.payload);
    },
    removeMovie: (state, action: PayloadAction<number>) => {
      state.movies = state.movies.filter(movie => movie.id !== action.payload);
    },
    getMovieById: (state, action: PayloadAction<number>) => {
      const movie = state.movies.find(movie => movie.id === action.payload);
      if (movie) {
        Object.assign(movie, action.payload);
      }
    },
  },
  extraReducers: builder => {
    builder
      .addCase(createMovie.pending, handlePending)
      .addCase(createMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading = false;
        state.movies.push(action.payload);
      })
      .addCase(createMovie.rejected, handleRejected)

      .addCase(updateMovie.pending, handlePending)
      .addCase(updateMovie.fulfilled, (state, action: PayloadAction<Movie>) => {
        state.loading = false;
        const index = state.movies.findIndex(movie => movie.id === action.payload.id);
        if (index !== -1) {
          state.movies[index] = action.payload;
        }
      })
      .addCase(updateMovie.rejected, handleRejected)

      // rateMovie
      .addCase(rateMovie.pending, handlePending)
      .addCase(rateMovie.fulfilled, (state, action: PayloadAction<RateMovie >) => {
        state.loading = false;
        const index = state.movies.findIndex(movie => movie.id === action.payload.id);
        if (index !== -1) {
          // let rating = state.movies[index].rating ?? 7.5:
          // movie = state.movies[index]
          state.movies[index].rating = state.movies[index].rating ?? 7.5 +0.01;
        }
      })
      .addCase(rateMovie.rejected, handleRejected)

      .addCase(deleteMovie.pending, handlePending)
      .addCase(deleteMovie.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.movies = state.movies.filter(movie => movie.id !== action.payload);
      })
      .addCase(deleteMovie.rejected, handleRejected)

      .addCase(searchMovies.pending, handlePending)
      .addCase(searchMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(searchMovies.rejected, handleRejected)

      .addCase(getBestMovies.pending, handlePending)
      .addCase(getBestMovies.fulfilled, (state, action: PayloadAction<Movie[]>) => {
        state.loading = false;
        state.bestMovies = action.payload;
      })
      .addCase(getBestMovies.rejected, handleRejected);
  },
});

export const { addMovie, removeMovie, getMovieById } = moviesSlice.actions;

export default moviesSlice.reducer;
