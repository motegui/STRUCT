import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [showOnlyFavourites, setShowOnlyFavourites] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('userEmail');
    const storedName = localStorage.getItem('userName');

    if (storedEmail && storedName) {
      setUserEmail(storedEmail);
      setUserName(storedName);
    }
  }, []);
  const [selectedBanks, setSelectedBanks] = useState([]);
  const [selectedLocal, setSelectedLocal] = useState([]);

  const updateCheckedCategories = (newCheckedCategories) => {
    setCheckedCategories(newCheckedCategories);
  };

  const updateShowOnlyFavourites = (value) => { 
    setShowOnlyFavourites(value);
  };

  return (
    <SearchContext.Provider value={{ searchValue, setSearchValue, checkedCategories, updateCheckedCategories, showOnlyFavourites, updateShowOnlyFavourites, userEmail, setUserEmail, userName, setUserName, selectedBanks, setSelectedBanks, selectedLocal, setSelectedLocal}}>
      {children}
    </SearchContext.Provider>
  );
}


export function useSearch() {
  return useContext(SearchContext);
}