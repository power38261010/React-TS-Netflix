import React, { useRef, useState } from 'react';
import { Modal, Box, IconButton } from '@mui/material';
import YouTube from 'react-youtube';
import CloseIcon from '@mui/icons-material/Close';
import styles from './TrailerBestMoviesComponent.module.css';
import { Movie } from '../../../app/interfaces/Movie';

interface PlayMovieComponentProps {
  movie: Movie | null;
  onClosePlayMovie: () => void;
}

const PlayMovieComponent: React.FC<PlayMovieComponentProps> = ({ movie, onClosePlayMovie }) => {
  const playerRef = useRef<any>(null);
  const [videoError, setVideoError] = useState(false);

  if (!movie) return null;

  const handleVideoError = () => {
    setVideoError(true);
  };

  const onPlayerReady = (event: any) => {
    if (event?.target) {
      event?.target?.playVideo();
      playerRef.current = event?.target;
    }
  };

  const videoId = movie?.trailerUrl?.split('v=')[1].split('&')[0];

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      fs: 1,
      playlist: videoId,
      modestbranding: 1,
      rel: 0,
      iv_load_policy: 3,
      disablekb: 1,
      controls: 0,
      quality: 'hd1080'
    },
  };

  return (
    <Modal
      open={!!movie}
      onClose={onClosePlayMovie}
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Box
        sx={{
          width: '100%',
          height: '100%',
          bgcolor: 'black',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <IconButton
          onClick={onClosePlayMovie}
          sx={{ position: 'absolute', top: 8, right: 8, color: 'white' }}
        >
          <CloseIcon />
        </IconButton>
        <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {videoError ? (
              <div className={styles.errorPopup}>Video no disponible</div>
            ) : (
              videoId && (
                <YouTube
                  videoId={videoId}
                  opts={opts}
                  onReady={onPlayerReady}
                  onError={handleVideoError}
                  style={{ width: '100%', height: '100%' }}
                />
              )
            )}
        </Box>
      </Box>
    </Modal>
  );
};

export default PlayMovieComponent;
