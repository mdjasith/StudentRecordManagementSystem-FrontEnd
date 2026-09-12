/**
 * Layout Component
 * Wraps all pages with Navbar and Sidebar
 * Manages mobile drawer state
 */

import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const Layout = ({ children }) => {
    // State for mobile drawer
    const [mobileOpen, setMobileOpen] = useState(false);

    // Toggle mobile drawer
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            {/* Navbar */}
            <Navbar toggleSidebar={handleDrawerToggle} />

            {/* Sidebar */}
            <Sidebar
                mobileOpen={mobileOpen}
                handleDrawerToggle={handleDrawerToggle}
            />

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    bgcolor: '#f5f5f5',
                }}
            >
                {/* Toolbar spacer for fixed navbar */}
                <Toolbar />
                {children}
            </Box>
        </Box>
    );
};

export default Layout;