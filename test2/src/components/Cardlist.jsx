import React, { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import Promocardtest from './Promocardtest';

function Card({ data }) {
    return (
        <Promocardtest data={data}/>
    );
  }

function Cardlist() {

    const [cards, setCards] = useState([]);

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
      {cards.map((cardData, index) => (
        <Card key={index} data={cardData} />
      ))}
    </div>
  );
}

export default Cardlist;