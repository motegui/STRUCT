import * as React from 'react';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import HomeIcon from '@mui/icons-material/Home';
import { Button, ButtonGroup } from '@mui/material';
import DescuentosTable from '../tables/DescuentosTable';
import LocalesTable from '../tables/LocalesTable';
import PagosTable from '../tables/PagosTable';
import $ from 'jquery'
import { useEffect } from 'react';
import {createClient} from '@supabase/supabase-js'
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '')


const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  }));

const Dashboard = (props) => {

  function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    event.preventDefault();
    console.info('You clicked a breadcrumb.');
  }


  const allTables = [
    {table: <DescuentosTable />, name: 'Descuentos'},
    {table: <LocalesTable />, name: 'Locales'},
    {table: <PagosTable />, name: 'Pagos'}
  ];

  const [tables, changeTable] = React.useState(allTables[0]);

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

    return ( 
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <div role="presentation" onClick={handleClick}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link
              underline="hover"
              sx={{ display: 'flex', alignItems: 'center' }}
              color="inherit"
              href="/"
            >
              <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
              Main Dashboard
            </Link>
          </Breadcrumbs>
        </div>
      
        
        <ButtonGroup sx={{ marginBottom: '20px', marginTop: '20px' }} fullWidth variant="outlined" aria-label="outlined button group">
          {allTables.map((table, index) => (
            <Button key={index} onClick={() => {
              changeTable(allTables[index]);
            }}>{table.name}</Button>
          ))}
        </ButtonGroup>
        {tables.table};
        {props.content}
      </Box>
     );
}
 
export default Dashboard;