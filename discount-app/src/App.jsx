import { useState } from 'react';
import Box from '@mui/material/Box'
import './App.css';
import Navbar from './components/navbar/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import Locales from './components/tables/Locales';
import Pago from './components/tables/Pago';
const App = () => {
  const [count, setCount] = useState(0); 

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Dashboard content={<><Locales /> <Pago /></>}/>
      </Box>
      
    </>
    
  );
};

export default App;
