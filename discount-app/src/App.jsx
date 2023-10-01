import { useState } from 'react';
import { createTheme } from '@mui/material';
import Box from '@mui/material/Box'
import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import LocalesTable from './components/tables/LocalesTable';
const App = () => {
  const [count, setCount] = useState(0); 

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Dashboard content={<><LocalesTable/></>}/>
      </Box>
      
    </>
    
  );
};

export default App;
