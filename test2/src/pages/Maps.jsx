import React from 'react'
import { useState } from 'react';
import { Box } from '@mui/material';
import Map, { GeolocateControl, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css'; 
import Mainnavbar from '../components/Mainnavbar';
import NavBar from '../components/Navbar';

const Maps = () => {

    const [viewport, setViewport] = useState({
        latitude:-34.6058270445443,
        longitude: -58.373919120610424,
        zoom: 14
    }); 


    return ( 
        <>
            <div className="body">
        <Mainnavbar />
        <NavBar />
        <Box sx={{width: '100%', height: '100%'}}>
            <Map initialViewState={{...viewport}} mapboxAccessToken="pk.eyJ1IjoibXF1ZXNhZGEwMiIsImEiOiJjbG45NHp5M2EwM3J0MmlvZG5ra2xjNTI1In0.vh8cLg7QO7h3gXmZ5I0ryw" style={{width: '100%', height: '100vh'}}
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
        </div>
        </>
     );
}
 
export default Maps;