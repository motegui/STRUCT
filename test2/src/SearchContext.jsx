import React, { createContext, useContext, useState } from 'react';

// Create a context
const SearchContext = createContext();

// Create a context provider component
export function SearchProvider({ children }) {
  const [searchValue, setSearchValue] = useState('');
  const [checkedCategories, setCheckedCategories] = useState({
    Lunes: false,
    Martes: false,
    Miércoles: false,
    Jueves: false,
    Viernes: false,
    Sabado: false,
    Domingo: false,
  });

  const updateCheckedCategories = (newCheckedCategories) => {
    setCheckedCategories(newCheckedCategories);
  };

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue, checkedCategories, updateCheckedCategories }}>
      {children}
    </SearchContext.Provider>
  );
}

// Create a custom hook to access the context
export function useSearch() {
  return useContext(SearchContext);
}