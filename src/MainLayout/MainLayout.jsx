import React from 'react';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css'

const MainLayout = () => {
    
    return (
        <div>
            <ToastContainer />
            <Outlet></Outlet>
        </div>
    );
};

export default MainLayout;