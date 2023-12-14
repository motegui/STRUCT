import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './dashboard/Dashboard';
import Maps from './maps/Maps';
import Profile from './profile/Profile';
import Signin from './signin/Signin';

const MainRoutes = () => {
    const isLoggedIn = localStorage.getItem("discountIsLoggedIn") != null; // Replace with your login verification logic
    console.log(isLoggedIn);
    return (
        <Routes>
                <>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/maps" element={<Maps />} />
                    <Route path="/login" element={<Signin />} />
                </>
        </Routes>
    );
};

export default MainRoutes;