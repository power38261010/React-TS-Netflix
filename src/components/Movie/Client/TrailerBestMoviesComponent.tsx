import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../app/store';
import { searchMovies } from '../../../app/slices/moviesSlice';
import YouTube, { YouTubeProps } from 'react-youtube';
import styles from './TrailerBestMoviesComponent.module.css';

const TrailerBestMoviesComponent: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { movies } = useSelector((state: RootState) => state.movies);

  const [currentTrailerIndex, setCurrentTrailerIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const playerRef = useRef<any>(null);

  useEffect(() => {
    dispatch(searchMovies({}));
  }, [dispatch]);

  useEffect(() => {
    if (movies.length > 0) {
      const sortedMovies = [...movies].sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
      const topThreeMovies = sortedMovies?.slice(0, 3);

      const timer = setInterval(() => {
        setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % topThreeMovies.length);
      }, 60000); // Cambiar tráiler cada 60 segundos

      return () => clearInterval(timer);
    }
  }, [movies]);

  const sortedMovies = [...movies].sort((a, b) => (b?.rating ?? 0) - (a?.rating ?? 0));
  const topThreeMovies = sortedMovies.slice(0, 3);
  const currentTrailer = topThreeMovies[currentTrailerIndex];
  const videoId = currentTrailer?.trailerUrl?.split('v=')[1]?.split('&')[0];

  const opts: YouTubeProps['opts'] = {
    height: '100%',
    width: '100%',
    playerVars: {
      autoplay: 1,
      modestbranding: 1, // Reducir la marca de YouTube
      rel: 0, // No mostrar videos relacionados al final
      iv_load_policy: 3, // No mostrar anotaciones
      disablekb: 1, // Desactivar el teclado
      fs: 0, // Deshabilitar pantalla completa
      controls: 0, // Desactivar controles
      quality: 'hd1080', // Establecer calidad del video a la más alta disponible
    },
  };

  const handleVideoError = () => {
    setVideoError(true);
  };

  const onPlayerReady = (event: { target: { playVideo: () => void; }; }) => {
    event?.target?.playVideo();
    playerRef.current = event?.target; // Guardar la referencia del reproductor
  };

  const onPlayerStateChange = (event: { data: number }) => {
    if (event.data === 0) { // Video ha terminado
      setCurrentTrailerIndex((prevIndex) => (prevIndex + 1) % topThreeMovies.length);
    }
  };

  const handleSlideChange = (index: number) => {
    setCurrentTrailerIndex(index);
    playerRef.current?.playVideo();
  };

  return (
    <div className={styles.trailerContainer}>
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
            <div className={styles.rating}>Ranking: {currentTrailer.rating}</div>
          </>
        ) : (
          <div>No hay trailers disponibles</div>
        )}
      </div>
      <div className={styles.slideControls}>
        {topThreeMovies.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={index === currentTrailerIndex ? styles.activeSlide : ''}
          >
            {/* {index + 1} */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrailerBestMoviesComponent;
