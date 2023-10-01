import React, { createContext, useContext, useState } from 'react';

// Create a context
const SearchContext = createContext();

// Create a context provider component
export function SearchProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue }}>
      {children}
    </SearchContext.Provider>
  );
}

// Create a custom hook to access the context
export function useSearch() {
  return useContext(SearchContext);
}