export interface Movie {
  id: number;
  title?: string;
  description?: string;
  genre?: string;
  releaseDate?: Date;
  posterUrl?: string;
  trailerUrl?: string;
  rating?: number;
  movieSubscriptions?: MovieSubscriptionDto[];
}

export interface MovieSubscriptionDto {
  id: number;
  subscriptionId: number;
  movieId: number;
}