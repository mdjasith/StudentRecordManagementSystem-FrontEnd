/**
 * Settings Component
 * User preferences: Dark Mode, Notifications, Language, etc.
 */

import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Switch,
    Divider,
    Slider,
    Button,
    Select,
    MenuItem,
    FormControl,
    Card,
    CardContent,
    Grid,
    Alert,
    Snackbar,
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    TextField,
} from '@mui/material';
import {
    DarkMode,
    LightMode,
    Notifications,
    Language,
    VolumeUp,
    VolumeOff,
    Save,
    RestartAlt,
    Person,
    Security,
    Palette,
    School,
    Settings as SettingsIcon,
    Visibility,
    VisibilityOff,
    Lock,
    Save as SaveIcon,
    Refresh,
    CheckCircle,
    Email as EmailIcon,
    Phone as PhoneIcon,
} from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
    // Get dark mode state from context
    const { darkMode, toggleDarkMode } = useTheme();

    // Settings state
    const [settings, setSettings] = useState({
        notifications: true,
        sound: true,
        language: 'en',
        fontSize: 16,
        autoSave: true,
        compactView: false,
    });

    const [profile, setProfile] = useState({
        name: 'Admin User',
        email: 'admin@srms.com',
        phone: '+91 98765 43210',
    });

    const [password, setPassword] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success',
    });

    // Load saved settings on mount
    useEffect(() => {
        const savedSettings = localStorage.getItem('userSettings');
        if (savedSettings) {
            try {
                const parsed = JSON.parse(savedSettings);
                setSettings(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }

        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                const parsed = JSON.parse(savedProfile);
                setProfile(prev => ({ ...prev, ...parsed }));
            } catch (e) {
                console.error('Error loading profile:', e);
            }
        }
    }, []);

    // Handle setting changes
    const handleSettingChange = (setting, value) => {
        setSettings((prev) => ({
            ...prev,
            [setting]: value,
        }));
    };

    // Handle profile changes
    const handleProfileChange = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Handle password change
    const handlePasswordChange = (field, value) => {
        setPassword((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    // Save settings
    const handleSaveSettings = () => {
        localStorage.setItem('userSettings', JSON.stringify(settings));
        localStorage.setItem('userProfile', JSON.stringify(profile));
        showSnackbar('Settings saved successfully!', 'success');
    };

    // Reset settings to default
    const handleResetDefaults = () => {
        setSettings({
            notifications: true,
            sound: true,
            language: 'en',
            fontSize: 16,
            autoSave: true,
            compactView: false,
        });
        localStorage.removeItem('userSettings');
        showSnackbar('Settings reset to default!', 'info');
    };

    // Change password
    const handleChangePassword = () => {
        if (password.new !== password.confirm) {
            showSnackbar('New password and confirm password do not match!', 'error');
            return;
        }
        if (password.new.length < 6) {
            showSnackbar('Password must be at least 6 characters!', 'error');
            return;
        }
        showSnackbar('Password changed successfully!', 'success');
        setPassword({ current: '', new: '', confirm: '' });
    };

    // Show notification
    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <SettingsIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h4" fontWeight="bold">
                    Settings
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Left Side - Main Settings */}
                <Grid item xs={12} md={8}>
                    {/* Appearance Settings */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Palette color="primary" />
                            Appearance
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                        {darkMode ? (
                                            <DarkMode sx={{ color: 'primary.main', fontSize: 28 }} />
                                        ) : (
                                            <LightMode sx={{ color: 'warning.main', fontSize: 28 }} />
                                        )}
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="500">
                                                Dark Mode
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {darkMode ? 'Dark theme enabled' : 'Light theme enabled'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Switch
                                        checked={darkMode}
                                        onChange={toggleDarkMode}
                                        color="primary"
                                    />
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ minWidth: 60 }}>A</Typography>
                                    <Slider
                                        value={settings.fontSize}
                                        onChange={(e, value) => handleSettingChange('fontSize', value)}
                                        min={12}
                                        max={24}
                                        step={1}
                                        sx={{ flex: 1 }}
                                        valueLabelDisplay="auto"
                                    />
                                    <Typography variant="h6">A</Typography>
                                </Box>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    Font Size: {settings.fontSize}px
                                </Typography>
                            </CardContent>
                        </Card>
                    </Paper>

                    {/* Preferences */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SettingsIcon color="primary" />
                            Preferences
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <List>
                            <ListItem>
                                <ListItemIcon>
                                    <Notifications color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Notifications"
                                    secondary="Receive notifications about updates"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        checked={settings.notifications}
                                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>

                            <Divider variant="inset" component="li" />

                            <ListItem>
                                <ListItemIcon>
                                    {settings.sound ? (
                                        <VolumeUp color="primary" />
                                    ) : (
                                        <VolumeOff color="error" />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    primary="Sound"
                                    secondary={settings.sound ? 'Sound enabled' : 'Sound disabled'}
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        checked={settings.sound}
                                        onChange={(e) => handleSettingChange('sound', e.target.checked)}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>

                            <Divider variant="inset" component="li" />

                            <ListItem>
                                <ListItemIcon>
                                    <Language color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Language"
                                    secondary="Select your preferred language"
                                />
                                <ListItemSecondaryAction>
                                    <FormControl size="small" sx={{ minWidth: 120 }}>
                                        <Select
                                            value={settings.language}
                                            onChange={(e) => handleSettingChange('language', e.target.value)}
                                        >
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="es">Spanish</MenuItem>
                                            <MenuItem value="fr">French</MenuItem>
                                            <MenuItem value="de">German</MenuItem>
                                        </Select>
                                    </FormControl>
                                </ListItemSecondaryAction>
                            </ListItem>

                            <Divider variant="inset" component="li" />

                            <ListItem>
                                <ListItemIcon>
                                    <SaveIcon color="primary" />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Auto Save"
                                    secondary="Automatically save changes"
                                />
                                <ListItemSecondaryAction>
                                    <Switch
                                        checked={settings.autoSave}
                                        onChange={(e) => handleSettingChange('autoSave', e.target.checked)}
                                        color="primary"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>
                        </List>
                    </Paper>

                    {/* Profile Settings */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person color="primary" />
                            Profile
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    value={profile.name}
                                    onChange={(e) => handleProfileChange('name', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => handleProfileChange('email', e.target.value)}
                                    InputProps={{
                                        startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Phone"
                                    value={profile.phone}
                                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                                    InputProps={{
                                        startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
                                    }}
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Security Settings */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Lock color="primary" />
                            Security
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Current Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password.current}
                                    onChange={(e) => handlePasswordChange('current', e.target.value)}
                                    InputProps={{
                                        endAdornment: (
                                            <IconButton onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password.new}
                                    onChange={(e) => handlePasswordChange('new', e.target.value)}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Confirm New Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password.confirm}
                                    onChange={(e) => handlePasswordChange('confirm', e.target.value)}
                                    error={password.new !== password.confirm && password.confirm !== ''}
                                    helperText={
                                        password.new !== password.confirm && password.confirm !== ''
                                            ? 'Passwords do not match'
                                            : ''
                                    }
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleChangePassword}
                                    disabled={!password.current || !password.new || !password.confirm}
                                >
                                    Change Password
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Action Buttons */}
                    <Box sx={{ display: 'flex', gap: 2, mt: 2, mb: 3 }}>
                        <Button
                            variant="contained"
                            startIcon={<Save />}
                            onClick={handleSaveSettings}
                            size="large"
                        >
                            Save All Settings
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<RestartAlt />}
                            onClick={handleResetDefaults}
                            size="large"
                        >
                            Reset Defaults
                        </Button>
                    </Box>
                </Grid>

                {/* Right Side - Quick Info & Stats */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Quick Info
                        </Typography>
                        <Divider sx={{ mb: 3 }} />

                        <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                        <School />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Institution
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            Student Record Management
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'success.main' }}>
                                        <Person />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Version
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            v1.0.0
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ mb: 2, bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'warning.main' }}>
                                        <Security />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Security
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            All data encrypted
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>

                        <Card sx={{ bgcolor: 'background.default' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: 'info.main' }}>
                                        <Palette />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">
                                            Theme
                                        </Typography>
                                        <Typography variant="subtitle1" fontWeight="500">
                                            {darkMode ? 'Dark' : 'Light'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Paper>

                    {/* Settings Summary */}
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>
                            Settings Summary
                        </Typography>
                        <Divider sx={{ mb: 2 }} />

                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Dark Mode"
                                    secondary={darkMode ? 'Enabled' : 'Disabled'}
                                />
                                <CheckCircle color={darkMode ? 'success' : 'disabled'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Notifications"
                                    secondary={settings.notifications ? 'On' : 'Off'}
                                />
                                <CheckCircle color={settings.notifications ? 'success' : 'disabled'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Sound"
                                    secondary={settings.sound ? 'On' : 'Off'}
                                />
                                <CheckCircle color={settings.sound ? 'success' : 'disabled'} />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Language"
                                    secondary={settings.language === 'en' ? 'English' : settings.language}
                                />
                                <CheckCircle color="success" />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Font Size"
                                    secondary={`${settings.fontSize}px`}
                                />
                                <CheckCircle color="success" />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Auto Save"
                                    secondary={settings.autoSave ? 'Enabled' : 'Disabled'}
                                />
                                <CheckCircle color={settings.autoSave ? 'success' : 'disabled'} />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Snackbar Notification */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Settings;