import React from 'react';
import { Box } from '@mui/material';
import MovieComponent from '../components/Movie/Admin/MovieComponent';


const MovieAdminApp: React.FC = () => {

  return (
    <>
        <Box sx={{ bgcolor: '#141414'}}>
          <MovieComponent />
        </Box>
    </>
  );
};

export default MovieAdminApp;