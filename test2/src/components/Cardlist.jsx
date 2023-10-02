import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Promocardtest from './Promocardtest';
import { useSearch } from '../SearchContext';

function Cardlist() {

    const [cards, setCards] = useState([]);
    const { searchValue } = useSearch();
    const { checkedCategories } = useSearch();


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
    <div className="card-list">
      <h1>{searchValue}</h1>
      {cards.map((cardData, index) => (
        <Promocardtest key={index} data={cardData} searchValue={searchValue} checkedDays={checkedCategories}/>
      ))}
    </div>
  );
}

export default Cardlist;