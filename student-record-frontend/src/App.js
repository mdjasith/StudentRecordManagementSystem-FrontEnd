// /**
//  * Main App Component
//  * Handles routing and layout for the entire application
//  */

// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { CustomThemeProvider } from './context/ThemeContext';
// import Layout from './components/Layout/Layout';
// import Dashboard from './components/Dashboard/Dashboard';
// import StudentList from './components/Students/StudentList';
// import CourseList from './components/Courses/CourseList';
// import EnrollmentList from './components/Enrollments/EnrollmentList';
// import AttendanceManager from './components/Attendance/AttendanceManager';
// import FeeList from './components/Fees/FeeList';
// import Settings from './components/Settings/Settings';
// import './App.css';

// function App() {
//   return (
//     <CustomThemeProvider>
//       <Router>
//         <Layout>
//           <Routes>
//             <Route path="/" element={<Dashboard />} />
//             <Route path="/students" element={<StudentList />} />
//             <Route path="/courses" element={<CourseList />} />
//             <Route path="/enrollments" element={<EnrollmentList />} />
//             <Route path="/attendance" element={<AttendanceManager />} />
//             <Route path="/fees" element={<FeeList />} />
//             <Route path="/settings" element={<Settings />} />
//           </Routes>
//         </Layout>
//       </Router>
//     </CustomThemeProvider>
//   );
// }

// export default App;










import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CustomThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import Dashboard from './components/Dashboard/Dashboard';
import StudentList from './components/Students/StudentList';
import CourseList from './components/Courses/CourseList';
import EnrollmentList from './components/Enrollments/EnrollmentList';
import AttendanceManager from './components/Attendance/AttendanceManager';
import FeeList from './components/Fees/FeeList';
import Settings from './components/Settings/Settings';
import About from './components/About/About';
import './App.css';

function App() {
  return (
    <CustomThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/students" element={<StudentList />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/enrollments" element={<EnrollmentList />} />
            <Route path="/attendance" element={<AttendanceManager />} />
            <Route path="/fees" element={<FeeList />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Layout>
      </Router>
    </CustomThemeProvider>
  );
}

export default App;