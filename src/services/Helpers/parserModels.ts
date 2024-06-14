// helpers.ts
import { Movie } from '../../app/interfaces/Movie';
import {  MovieSubscriptionDto } from '../../app/interfaces/MovieSubscription';

export const parseMovie = (data: any): Movie => {
  const movieSubscriptions: MovieSubscriptionDto[] = data.movieSubscriptions.$values.map((subscription: any) => ({
    id: subscription.id,
    subscriptionId: subscription.subscriptionId,
    movieId: subscription.movieId,
  }));

  return {
    id: data.id,
    title: data.title,
    description: data.description,
    genre: data.genre,
    releaseDate: new Date(data.releaseDate),
    posterUrl: data.posterUrl,
    trailerUrl: data.trailerUrl,
    rating: data.rating,
    movieSubscriptions: movieSubscriptions,
  };
};

export const parseMovies = (data: any): Movie[] => {
  // Asegurarse de acceder a la propiedad $values antes de mapear
  if (!data.$values) {
    throw new Error("Invalid data format: Missing $values property");
  }
  return data.$values.map(parseMovie);
};
