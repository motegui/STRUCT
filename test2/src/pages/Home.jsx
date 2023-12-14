import Categorycard from "../components/Categorycard"
import FooterCh from "../components/FooterCh"
import Cardlist from "../components/Cardlist"
import MySearchMessage from "../components/MySearchMessage"
import { useSearch } from '../SearchContext';
import Daycard from "../components/Daycard"
import BankCard from "../components/BankCard"
import LocalCard from "../components/LocalCard"
import MyHeader from "../components/MyHeader"
import {createClient} from '@supabase/supabase-js'
import { useEffect } from 'react';
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '')


export default function Home(){


  async function fetchGeocode(place) {
    let data = await fetch('https://api.mapbox.com/geocoding/v5/mapbox.places/' + place + '.json?country=ar&limit=10&proximity=ip&language=es&access_token=' + process.env.REACT_APP_MAPBOX_TOKEN);
    if (data.ok) {
        let json = await data.json();
        return json.features;
    } else {
        console.log("Error");
    }
    return null;
}

async function fetchDatabase() {
    let { data: data, error } = await supabase
        .from('DESCUENTO')
        .select('local,dia_semanal,beneficio,img_local,banco');
    return data;
}

// para un mismo local, pueden haber muchas promociones

// primero obtengo de la base de datos todas las promociones y por local las guardo en el mapa

async function iterateCorrectlyAndSave() {
    localStorage.removeItem('geocode');
    let dbdata = await fetchDatabase();
    let map = new Map();
    let imgMap = new Map();
    if (dbdata) {
        for (let i=0;i<dbdata.length;i++) {
            imgMap.set(dbdata[i].local, dbdata[i].img_local + '\n');
            if (map.get(dbdata[i].local)) {
                map.set(dbdata[i].local, map.get(dbdata[i].local) + ',' + dbdata[i].beneficio + '}' + dbdata[i].dia_semanal + '}' + dbdata[i].banco +'\n');
            } else {
                map.set(dbdata[i].local, dbdata[i].beneficio + '}' + dbdata[i].dia_semanal + '}' + dbdata[i].banco + '\n');
            }
        }
       // todos los nombres de los locales sin repetir
        let keys = map.keys();
        let set = new Set();
        for(let i=0;i<map.size;i++){
            set.add(keys.next().value);
        } 
        let index=0;
        let newObj = [{}];
        newObj.shift();
        set.forEach(async (value) => {
            let geocode = await fetchGeocode(value);
            let entry = map.get(value);
            let img = imgMap.get(value);
            geocode?.forEach((feature) => {
                newObj.push({local:value, discount: entry, img: img, ...feature,});
            }); 
            
            if (index === set.size-1)
                localStorage.setItem('geocode', JSON.stringify(newObj));
            index++;
        })
    }

}

useEffect(() => {
  iterateCorrectlyAndSave();
}
, []);

    
    const { searchValue, userEmail , userName} = useSearch();

    const HeaderStyles = {
        position: 'sticky',
        top: 0,
        left: 0,
        zIndex: 1,
        width: '100%',
      };
      
      const FiltersStyles = {
        position: 'sticky',
        top: "90px",
        bottom:"30px",
        left: 0,
        zIndex: 2,
        height: "400px",
      };

      const ContentStyles = {
        flexGrow: 1,
      };

    return (
    <>
      <div className="body">
        <div style={HeaderStyles}>
            <MyHeader/>
        </div>
        <div className="main">
        <div className='my-row'>
            <div className='category-col' style={FiltersStyles}>
            {userEmail ? <Categorycard/> : <></>}
            <Daycard />
            <BankCard />
            <LocalCard />
            </div>
                <div className='content-col' style={ContentStyles}>
                    <Cardlist/>
                </div>
            </div>
        </div>
        <FooterCh />
        </div>
    </>
    )
}