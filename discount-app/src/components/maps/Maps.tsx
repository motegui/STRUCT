import { Box } from '@mui/material';
import React, { useState } from 'react';
import Map from 'react-map-gl';

const Maps = () => {

    const [viewport, setViewport] = useState({
        latitude:-34.6058270445443,
        longitude: -58.373919120610424,
        zoom: 14
    });

    return (
        <Box sx={{width: '100%', height: '100%'}}>
            <Map initialViewState={{...viewport}} mapboxAccessToken="pk.eyJ1IjoibXF1ZXNhZGEwMiIsImEiOiJjbG45NHp5M2EwM3J0MmlvZG5ra2xjNTI1In0.vh8cLg7QO7h3gXmZ5I0ryw" style={{width: '100%', height: '100vh'}}
        mapStyle="mapbox://styles/mapbox/streets-v9">
            </Map>
        </Box> 
        
        
     );
}

 
export default Maps;