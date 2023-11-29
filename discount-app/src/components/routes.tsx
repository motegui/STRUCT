import React from 'react';
import {Routes, Route} from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Maps from './maps/Maps';
import Profile from './profile/Profile';

const MainRoutes=()=>{
    return(
        <Routes>
            <Route path="/" element={<Dashboard/>}/>
            <Route path="/maps" element={<Maps/>}/>
            <Route path="/profile" element={<Profile/>}/>
        </Routes>
    )
}

export default MainRoutes;