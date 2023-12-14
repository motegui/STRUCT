import { createTheme } from '@mui/material';
import Box from '@mui/material/Box'
import './App.css';
import Navbar from './components/navbar/Navbar';

import MainRoutes from './components/routes';
import Signin from './components/signin/Signin';
const App = () => {
  const isLoggedIn = localStorage.getItem("discountIsLoggedIn") != null; // Replace with your login verification logic
  return (
    <>
    {isLoggedIn && (
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <MainRoutes />
      </Box>
    )}
    {!isLoggedIn && (
      <Signin />
    )}
    </>
    
  );
};

export default App;
