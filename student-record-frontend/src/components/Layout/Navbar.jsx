/**
 * Navbar Component
 * Top navigation bar with app title and notifications
 * Fixed position at top of the page
 */

import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Avatar,
} from '@mui/material';
import {
    Notifications,
    Menu as MenuIcon,
} from '@mui/icons-material';

const Navbar = ({ toggleSidebar }) => {
    return (
        <AppBar
            position="fixed"
            sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
                background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 100%)',
            }}
        >
            <Toolbar>
                {/* Hamburger menu for mobile */}
                <IconButton
                    color="inherit"
                    edge="start"
                    onClick={toggleSidebar}
                    sx={{ mr: 2, display: { sm: 'block', md: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* App Logo/Title */}
                <Typography
                    variant="h6"
                    sx={{
                        flexGrow: 1,
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <span style={{ fontSize: '1.5rem' }}>🎓</span>
                    Student Record Management
                </Typography>

                {/* Notification Bell */}
                <IconButton color="inherit">
                    <Badge badgeContent={4} color="error">
                        <Notifications />
                    </Badge>
                </IconButton>

                {/* User Avatar */}
                <Avatar sx={{ ml: 2, bgcolor: 'secondary.main', width: 36, height: 36 }}>
                    A
                </Avatar>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;