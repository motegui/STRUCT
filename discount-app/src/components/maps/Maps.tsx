import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Map, { GeolocateControl, Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import mapboxgl from 'mapbox-gl';

const Maps = () => {

    const [viewport, setViewport] = useState({
        latitude:-34.6058270445443,
        longitude: -58.373919120610424,
        zoom: 14
    }); 


    const [showPopup, setShowPopup] = useState(false);

    return (
        <Box sx={{width: '100%', height: '100%'}}>
            <Map initialViewState={{...viewport}} mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN ?? ''} style={{width: '100%', height: '100vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9">
            <Marker longitude={viewport.longitude} latitude={viewport.latitude} anchor="bottom" >
                <img src="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" alt="marker" width="30px" height="30px"/>
            </Marker>
            <NavigationControl position='bottom-right' />
            <GeolocateControl 
            positionOptions={ {enableHighAccuracy: true} }
            showUserLocation={true}
            onGeolocate={(e) => {
                setViewport({
                    latitude: e.coords.latitude,
                    longitude: e.coords.longitude,
                    zoom: 14
                    })}}
              position='bottom-right'
              trackUserLocation
              
            />
            </Map>
        </Box> 
        
        
     );
}

 
export default Maps;