import { Box } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import Map, { GeolocateControl, Marker, NavigationControl, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Geocoder from '@mapbox/mapbox-gl-geocoder'
import GeocoderControl from './geocoder-control';

const Maps = () => {

    const [viewport, setViewport] = useState({
        latitude: -34.6058270445443,
        longitude: -58.373919120610424,
        zoom: 14
    }); 


    const [showPopup, setShowPopup] = useState(false);

    return (
        <Box sx={{ width: '100%', height: '100%' }}>
            <div id = "map">
            <Map initialViewState={{ ...viewport }} mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN ?? ''} style={{ width: '100%', height: '90vh', marginTop: '60px' }}
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
                    trackUserLocation

                />
            </Map>
            </div>
        </Box>


    );
}


export default Maps;