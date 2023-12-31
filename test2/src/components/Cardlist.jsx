import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Promocardtest from './Promocardtest';
import { useSearch } from '../SearchContext';

function Cardlist() {

    const [cards, setCards] = useState([]);
    const { searchValue } = useSearch();
    const { checkedCategories } = useSearch();
    const { showOnlyFavourites } = useSearch();
    const {selectedBanks, selectedLocal} = useSearch();


    useEffect(() => {
        async function fetchCards() {
            try {
              const { data: DESCUENTO, error } = await supabase.from('DESCUENTO').select('*');
              if (error) {
                console.error('Error fetching data:', error);
                return;
              }
              setCards(DESCUENTO);
            } catch (error) {
              console.error('Error fetching data:', error);
            }
          }
      
          fetchCards();
        }, []);

  return (
    <div className='cardlistContainer'>
      <div className="card-list">
      {cards.map((cardData, index) => (
          <Promocardtest key={index} data={cardData} searchValue={searchValue} checkedDays={checkedCategories} favsOnly={showOnlyFavourites} selectedBanks={selectedBanks} selectedLocal={selectedLocal}/>
      ))}
    </div>
    </div>
    
  );
}

export default Cardlist;