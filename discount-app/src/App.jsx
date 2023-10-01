import { useState } from 'react';
import { createTheme } from '@mui/material';
import Box from '@mui/material/Box'
import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import LocalesTable from './components/tables/LocalesTable';
import DescuentosTable from './components/tables/DescuentosTable';
const App = () => {
  const [count, setCount] = useState(0); 

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Dashboard />
      </Box>
      
    </>
    
  );
};

export default App;
