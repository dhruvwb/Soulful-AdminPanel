import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/DashBoard';
import Blogs from './pages/Blogs';
import News from './pages/News';
import Gallery from './pages/Gallery';
import IndiaTours from './pages/IndiaTours';
import Destinations from './pages/Destinations';
import Packages from './pages/Packages';
import CustomizedTourPackage from './pages/CustomizedTourPackage';
import AboutUs from './pages/AboutUs';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="india-tours" element={<IndiaTours />} />
              <Route path="destinations" element={<Destinations />} />
              <Route path="packages" element={<Packages />} />
              <Route path="customized-tour-package" element={<CustomizedTourPackage />} />
              <Route path="news" element={<News />} />
              <Route path="blogs" element={<Blogs />} />
              <Route path="gallery" element={<Gallery />} />
              <Route path="about-us" element={<AboutUs />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
