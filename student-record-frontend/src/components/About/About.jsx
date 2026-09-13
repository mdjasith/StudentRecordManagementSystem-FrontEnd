/**
 * About Component
 * About Us page with app description and developer info
 */

import React from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Avatar,
    Divider,
    Button,
    Chip,
    Stack,
    Link,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Container,
} from '@mui/material';
import {
    School,
    Person,
    Code,
    Storage,
    Language,
    LinkedIn,
    Email,
    GitHub,
    CheckCircle,
    Storage as StorageIcon,
    Speed,
    Security,
    Devices,
    People,
    Book,
    Assignment,
    EventNote,
    AttachMoney,
    Settings,
    Star,
    Favorite,
} from '@mui/icons-material';

const About = () => {
    // Feature list
    const features = [
        {
            icon: <People sx={{ fontSize: 30 }} />,
            title: 'Student Management',
            description: 'Complete CRUD operations for student records with personal details, contact info, and parent information.',
            color: '#1976D2',
        },
        {
            icon: <Book sx={{ fontSize: 30 }} />,
            title: 'Course Management',
            description: 'Create and manage courses with unique course codes, credits, and professor assignments.',
            color: '#2E7D32',
        },
        {
            icon: <Assignment sx={{ fontSize: 30 }} />,
            title: 'Enrollment System',
            description: 'Enroll students in courses with duplicate prevention and automatic fee generation.',
            color: '#ED6C02',
        },
        {
            icon: <EventNote sx={{ fontSize: 30 }} />,
            title: 'Attendance Tracking',
            description: 'Mark daily attendance, calculate percentages, and generate low attendance warnings.',
            color: '#9C27B0',
        },
        {
            icon: <AttachMoney sx={{ fontSize: 30 }} />,
            title: 'Fee Management',
            description: 'Track fee payments, partial payments, outstanding balances, and payment status.',
            color: '#D32F2F',
        },
        {
            icon: <Settings sx={{ fontSize: 30 }} />,
            title: 'Settings & Dark Mode',
            description: 'Customize your experience with dark mode, font size, language, and notification preferences.',
            color: '#0288D1',
        },
    ];

    // Tech stack
    const technologies = [
        {
            name: 'Spring Boot 4.1.1',
            description: 'Backend framework',
            color: '#6DB33F',
        },
        {
            name: 'Java 21',
            description: 'Programming language',
            color: '#007396',
        },
        {
            name: 'MySQL 9.7.0',
            description: 'Database',
            color: '#4479A1',
        },
        {
            name: 'Hibernate 7.4.5',
            description: 'ORM Framework',
            color: '#59666C',
        },
        {
            name: 'React 18.2.0',
            description: 'Frontend library',
            color: '#61DAFB',
        },
        {
            name: 'Material-UI 5.14.20',
            description: 'UI Component Library',
            color: '#007FFF',
        },
        {
            name: 'Axios',
            description: 'HTTP Client',
            color: '#5A29E4',
        },
        {
            name: 'React Router DOM',
            description: 'Routing',
            color: '#CA4245',
        },
    ];

    // Developer skills
    const skills = [
        'Java', 'Spring Boot', 'Spring Data JPA', 'Hibernate',
        'MySQL', 'REST APIs', 'React.js', 'Material-UI',
        'JavaScript', 'HTML/CSS', 'Git', 'Maven',
    ];

    return (
        <Box>
            {/* Hero Section */}
            <Paper
                sx={{
                    p: 4,
                    mb: 4,
                    background: 'linear-gradient(135deg, #1976D2 0%, #1565C0 50%, #0D47A1 100%)',
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar
                        sx={{
                            width: 100,
                            height: 100,
                            bgcolor: 'white',
                            color: 'primary.main',
                            fontSize: 50,
                        }}
                    >
                        <School sx={{ fontSize: 60 }} />
                    </Avatar>
                    <Box>
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            Student Record Management System
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.9 }}>
                            A Complete Spring Boot CRUD Application
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                            <Chip
                                label="Version 1.0.0"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                            <Chip
                                label="Full Stack"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                            <Chip
                                label="REST API"
                                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                            />
                        </Box>
                    </Box>
                </Box>
            </Paper>

            {/* Description Section */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            📌 About the Application
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" paragraph>
                            The <strong>Student Record Management System</strong> is a comprehensive 
                            full-stack web application designed to help educational institutions 
                            efficiently manage their student data, courses, enrollments, attendance, 
                            and fee payments.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Built with <strong>Spring Boot</strong> on the backend and 
                            <strong> React.js</strong> on the frontend, this application follows 
                            industry-standard architectural patterns including <strong>MVC</strong>, 
                            <strong> DTO pattern</strong>, and <strong>layered architecture</strong>. 
                            It demonstrates complete CRUD (Create, Read, Update, Delete) operations 
                            across multiple interconnected modules.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            The system uses <strong>Spring Data JPA</strong> with <strong>Hibernate</strong> 
                            for database operations, ensuring clean separation between business logic 
                            and data persistence. The REST APIs are consumed by a modern, responsive 
                            React frontend built with <strong>Material-UI</strong> components.
                        </Typography>
                        <Typography variant="body1">
                            Key highlights include automatic fee generation on enrollment, 
                            attendance percentage calculation, dark mode support, and comprehensive 
                            error handling — making it a production-ready educational management solution.
                        </Typography>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            🎯 Project Stats
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List dense>
                            <ListItem>
                                <ListItemIcon><People color="primary" /></ListItemIcon>
                                <ListItemText primary="5 Modules" secondary="Student, Course, Enrollment, Attendance, Fee" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Code color="primary" /></ListItemIcon>
                                <ListItemText primary="26+ REST APIs" secondary="Full CRUD operations" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><StorageIcon color="primary" /></ListItemIcon>
                                <ListItemText primary="5 Database Tables" secondary="With relationships" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Devices color="primary" /></ListItemIcon>
                                <ListItemText primary="Responsive Design" secondary="Mobile & Desktop" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Speed color="primary" /></ListItemIcon>
                                <ListItemText primary="Fast & Optimized" secondary="Reduced payload with DTOs" />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Security color="primary" /></ListItemIcon>
                                <ListItemText primary="Secure" secondary="Validation & Exception handling" />
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>
            </Grid>

            {/* Features Section */}
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                ✨ Key Features
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {features.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card
                            sx={{
                                height: '100%',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 6,
                                },
                            }}
                        >
                            <CardContent>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        width: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        bgcolor: feature.color + '20',
                                        color: feature.color,
                                        mb: 2,
                                    }}
                                >
                                    {feature.icon}
                                </Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tech Stack */}
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                🛠️ Technology Stack
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2} sx={{ mb: 4 }}>
                {technologies.map((tech, index) => (
                    <Grid item xs={6} sm={4} md={3} key={index}>
                        <Paper
                            sx={{
                                p: 2,
                                textAlign: 'center',
                                borderTop: `4px solid ${tech.color}`,
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'scale(1.05)' },
                            }}
                        >
                            <Typography variant="subtitle1" fontWeight="bold">
                                {tech.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {tech.description}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* ====== ABOUT ME SECTION ====== */}
            <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mt: 4 }}>
                👨‍💻 About the Developer
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <Paper
                sx={{
                    p: 4,
                    background: 'linear-gradient(135deg, #f5f5f5 0%, #e3f2fd 100%)',
                    borderRadius: 3,
                }}
            >
                <Grid container spacing={4} alignItems="center">
                    {/* Developer Avatar */}
                    <Grid item xs={12} md={3}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Avatar
                                sx={{
                                    width: 150,
                                    height: 150,
                                    mx: 'auto',
                                    bgcolor: 'primary.main',
                                    fontSize: 60,
                                    boxShadow: 4,
                                }}
                            >
                                MJ
                            </Avatar>
                            <Typography variant="h5" fontWeight="bold" sx={{ mt: 2 }}>
                                Mohamed Jasith
                            </Typography>
                            <Chip
                                label="B.Tech"
                                color="primary"
                                sx={{ mt: 1, fontWeight: 'bold' }}
                            />
                        </Box>
                    </Grid>

                    {/* Developer Info */}
                    <Grid item xs={12} md={9}>
                        <Typography variant="h5" fontWeight="bold" gutterBottom>
                            Hi, I'm Mohamed Jasith 👋
                        </Typography>
                        <Typography variant="body1" paragraph>
                            I am a <strong>B.Tech graduate</strong> and a passionate 
                            <strong> Full-Stack Developer</strong> with a strong foundation in 
                            Java, Spring Boot, and modern web technologies. I specialize in building 
                            scalable backend systems and intuitive user interfaces.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            This <strong>Student Record Management System</strong> is one of my 
                            portfolio projects where I implemented complete CRUD operations, 
                            REST APIs, database relationships, and a modern React frontend. 
                            It showcases my ability to design and build end-to-end applications 
                            using industry best practices.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            I am always eager to learn new technologies, solve real-world problems, 
                            and contribute to impactful projects. I'm currently looking for 
                            opportunities where I can apply my skills and grow as a developer.
                        </Typography>

                        {/* Skills */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                            💡 Skills
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                            {skills.map((skill, index) => (
                                <Chip
                                    key={index}
                                    label={skill}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{ mb: 1 }}
                                />
                            ))}
                        </Stack>

                        {/* Contact Links */}
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 3 }}>
                            📬 Connect With Me
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 1 }}>
                            {/* LinkedIn */}
                            <Button
                                variant="contained"
                                startIcon={<LinkedIn />}
                                href="https://www.linkedin.com/in/mohamed-jasith-j"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    bgcolor: '#0077B5',
                                    '&:hover': { bgcolor: '#005885' },
                                    textTransform: 'none',
                                }}
                            >
                                LinkedIn
                            </Button>

                            {/* Email */}
                            <Button
                                variant="contained"
                                startIcon={<Email />}
                                href="mailto:mohamedjasithoff@gmail.com"
                                sx={{
                                    bgcolor: '#EA4335',
                                    '&:hover': { bgcolor: '#C5221F' },
                                    textTransform: 'none',
                                }}
                            >
                                Email Me
                            </Button>

                            {/* GitHub (optional placeholder) */}
                            <Button
                                variant="outlined"
                                startIcon={<GitHub />}
                                href="https://github.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                sx={{
                                    textTransform: 'none',
                                    borderColor: '#333',
                                    color: '#333',
                                    '&:hover': { borderColor: '#000', bgcolor: '#f5f5f5' },
                                }}
                            >
                                GitHub
                            </Button>
                        </Box>

                        {/* Contact Details */}
                        <Box sx={{ mt: 3, p: 2, bgcolor: 'white', borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                <strong>📧 Email:</strong>{' '}
                                <Link href="mailto:mohamedjasithoff@gmail.com" underline="hover">
                                    mohamedjasithoff@gmail.com
                                </Link>
                            </Typography>
                            <Typography variant="body2">
                                <strong>🔗 LinkedIn:</strong>{' '}
                                <Link
                                    href="https://www.linkedin.com/in/mohamed-jasith-j"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    underline="hover"
                                >
                                    linkedin.com/in/mohamed-jasith-j
                                </Link>
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>

            {/* Footer Message */}
            <Paper
                sx={{
                    mt: 4,
                    p: 4,
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, #1976D2 0%, #0D47A1 100%)',
                    color: 'white',
                    borderRadius: 3,
                }}
            >
                <Favorite sx={{ fontSize: 40, mb: 1 }} />
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Built with Passion
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    This application was designed and developed by Mohamed Jasith as a 
                    demonstration of full-stack development skills using Spring Boot and React.
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, opacity: 0.7 }}>
                    © 2026 Mohamed Jasith. All rights reserved.
                </Typography>
            </Paper>
        </Box>
    );
};

export default About;