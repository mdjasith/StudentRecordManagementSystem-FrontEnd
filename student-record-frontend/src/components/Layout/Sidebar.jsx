/**
 * Sidebar Component
 * Navigation menu with all main sections including Settings
 */

import React from 'react';
import {
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Box,
    Divider,
    Typography,
    useTheme,
    useMediaQuery,
} from '@mui/material';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Book as BookIcon,
    Assignment as AssignmentIcon,
    EventNote as EventNoteIcon,
    AttachMoney as AttachMoneyIcon,
    Settings as SettingsIcon,
    School as SchoolIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Students', icon: <PeopleIcon />, path: '/students' },
    { text: 'Courses', icon: <BookIcon />, path: '/courses' },
    { text: 'Enrollments', icon: <AssignmentIcon />, path: '/enrollments' },
    { text: 'Attendance', icon: <EventNoteIcon />, path: '/attendance' },
    { text: 'Fees', icon: <AttachMoneyIcon />, path: '/fees' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },  // ✅ Settings stays here
];

const Sidebar = ({ mobileOpen, handleDrawerToggle }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const drawer = (
        <Box>
            <Toolbar>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SchoolIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                    <Typography variant="h6" fontWeight="bold" color="primary.main">
                        SRMS
                    </Typography>
                </Box>
            </Toolbar>
            <Divider />

            <List sx={{ px: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                            key={item.text}
                            onClick={() => {
                                navigate(item.path);
                                if (isMobile) handleDrawerToggle();
                            }}
                            sx={{
                                borderRadius: 2,
                                mb: 0.5,
                                bgcolor: isActive ? 'primary.light' : 'transparent',
                                color: isActive ? 'primary.main' : 'text.primary',
                                '&:hover': {
                                    bgcolor: 'primary.light',
                                    cursor: 'pointer',
                                },
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    color: isActive ? 'primary.main' : 'inherit',
                                    minWidth: 40,
                                }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: isActive ? 'bold' : 'normal',
                                }}
                            />
                            {isActive && (
                                <Box
                                    sx={{
                                        width: 4,
                                        height: 32,
                                        bgcolor: 'primary.main',
                                        borderRadius: 2,
                                    }}
                                />
                            )}
                        </ListItem>
                    );
                })}
            </List>

            <Divider />
            <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                    v1.0.0
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box
            component="nav"
            sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
            >
                {drawer}
            </Drawer>

            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: drawerWidth,
                    },
                }}
                open
            >
                {drawer}
            </Drawer>
        </Box>
    );
};

export default Sidebar;