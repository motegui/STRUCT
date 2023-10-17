import { Box } from '@mui/material';
import { styled } from '@mui/system'
import React, { useMemo, useState } from 'react';
import MapGL, { GeolocateControl, Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import GeocoderControl from './geocoder-control';
import { Button, buttonClasses } from '@mui/base';
import { createClient } from '@supabase/supabase-js'
const supabase = createClient('https://rkdpcpsryixjcglwqfaa.supabase.co', process.env.REACT_APP_SUPABASE_TOKEN || '')

const blue = {
    500: '#007FFF',
    600: '#0072E5',
    700: '#0059B2',
};

const CustomButton = styled(Button)`
font-family: 'IBM Plex Sans', sans-serif;
font-size: 0.875rem;
line-height: 1.5;
background-color: ${blue[500]};
color: white;
border-radius: 8px;
font-weight: 600;
padding: 8px 16px;
cursor: pointer;
transition: all 150ms ease;
border: none;

&:hover:not(:disabled) {
background-color: ${blue[600]};
}

&:active:not(:disabled) {
background-color: ${blue[700]};
}

&.${buttonClasses.focusVisible} {
box-shadow: 0 4px 20px 0 rgb(61 71 82 / 0.1), 0 0 0 5px rgb(0 127 255 / 0.5);
outline: none;
}

&.${buttonClasses.disabled} {
opacity: 0.5;
cursor: not-allowed;
}
`;

const Maps = () => {

    const [viewport, setViewport] = useState({
        latitude: -34.6058270445443,
        longitude: -58.373919120610424,
        zoom: 14
    });


    interface Marker {
        latitude: number;
        longitude: number;
        local: string;
        discount: string;
        img: string;
    }

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
            .select('local,dia_semanal,descripcion_descuento,img_local');
        return data;
    }


    // por cada local en la base de datos, buscar la geolocalizacion y guardarla en el localstorage

   /*  async function iterateOverAndSave() {
        localStorage.removeItem('geocode');
        let dbdata = await fetchDatabase();
        let newObj = [{}];
        newObj.shift();
        if (dbdata) {
            for(let i=0; i<dbdata.length; i++){
                let geocode = await fetchGeocode(dbdata[i].local);
                geocode?.forEach((feature) => {
                    newObj.push({...dbdata[i], ...feature,});
                }); 
                if (i === dbdata.length-1)
                    localStorage.setItem('geocode', JSON.stringify(newObj));
            }
        }
    } */

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
                    map.set(dbdata[i].local, map.get(dbdata[i].local) + ',' + dbdata[i].descripcion_descuento + ',' + dbdata[i].dia_semanal + '\n');
                } else {
                    map.set(dbdata[i].local, dbdata[i].descripcion_descuento + ',' + dbdata[i].dia_semanal + '\n');
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


    async function searchGeocode() {
        await iterateCorrectlyAndSave();
        //await iterateOverAndSave();
    }

    async function saveGeocode() {
        await searchGeocode();
    };

    const newMarkers: Marker[] = JSON.parse(localStorage.getItem('geocode') ?? '[]').map(poi => ({
        latitude: poi.center[1],
        longitude: poi.center[0],
        local: poi.local,
        discount: poi.discount,
        img: poi.img
    }));
        const [popupInfo, setPopupInfo] = useState<Marker | null>(null);

        const pins = 
            newMarkers.map((marker, index) => (
                    <Marker
                    key={index}
                    latitude={marker.latitude}
                    longitude={marker.longitude}
                    anchor='bottom'
                    onClick={(e) => {
                        e.originalEvent.stopPropagation();
                        setPopupInfo(marker); // replace with database info
                    }}
                >
                    <img src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" alt="marker" width="30px" height="30px" />
                </Marker>
                
            ));
            


        return (
            <Box sx={{ width: '100%', height: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CustomButton style={{ marginTop: '70px', marginBottom: '10px', marginRight: '10px' }} onClick={() => saveGeocode()}>GEOFETCH (press, then reload)</CustomButton>
                    <CustomButton style={{ marginTop: '70px', marginBottom: '10px', marginLeft: '10px' }} onClick={() => localStorage.removeItem('geocode')}>CLEAR LOCALSTORAGE</CustomButton>
                </div>
                <MapGL initialViewState={{ ...viewport }} mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN ?? ''} style={{ width: '100%', height: '80vh'}}
                    mapStyle="mapbox://styles/mapbox/streets-v9">
                    <GeocoderControl mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN} position="top-left" />
                    <NavigationControl position='bottom-right' />
                    <GeolocateControl
                        positionOptions={{ enableHighAccuracy: true }}
                        showUserLocation={true}
                        onGeolocate={(e) => {
                            setViewport({
                                latitude: e.coords.latitude,
                                longitude: e.coords.longitude,
                                zoom: 14
                            })
                        }}
                        position='bottom-right'
                        trackUserLocation={true}

                    />
                    {pins}
                    {popupInfo && (
                        <Popup
                            anchor="top"
                            longitude={popupInfo.longitude}
                            latitude={popupInfo.latitude}
                            onClose={() => setPopupInfo(null)}
                        >
                            <div>
                                <h2 style={{textAlign: 'center'}}>{popupInfo.local}</h2><br />
                                <img src={popupInfo.img} alt="local" width="200px" height="200px" /><br />
                                {popupInfo.discount}
                            </div>
                        </Popup>
                    )}
                </MapGL>
            </Box>
        );
    }


export default Maps;