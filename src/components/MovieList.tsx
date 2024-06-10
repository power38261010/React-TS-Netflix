import React from 'react';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
}

interface MovieListProps {
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ movies }) => {
  return (
    <div className="grid grid-cols-3 gap-4">
      {movies.map((movie) => (
        <div key={movie.id} className="bg-gray-200 p-4 rounded">
          <img src={movie.posterUrl} alt={movie.title} className="w-full h-auto mb-2" />
          <p className="text-sm font-bold">{movie.title}</p>
        </div>
      ))}
    </div>
  );
};

export default MovieList;
