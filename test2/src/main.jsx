import React from 'react'
import { createRoot } from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { SearchProvider } from './SearchContext.jsx';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'

const root = createRoot(document.getElementById('root'));

root.render(
  <SearchProvider>
    <BrowserRouter>
      <ChakraProvider>
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ChakraProvider>
    </BrowserRouter>
  </SearchProvider>
);