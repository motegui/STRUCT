import { createTheme } from '@mui/material';
import Box from '@mui/material/Box'
import './App.css';
import Navbar from './components/navbar/Navbar';

import MainRoutes from './components/routes';
const App = () => {
  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <MainRoutes />
      </Box>
    </>
    
  );
};

export default App;
