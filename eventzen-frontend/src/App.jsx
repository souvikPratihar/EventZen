import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastProvider';

import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MyProfile from './pages/MyProfile';
import EventDetails from './pages/EventDetails';
import CreateEvent from './pages/CreateEvent';
import AdminDashboard from './pages/AdminDashboard';
import MyEventDetails from './pages/MyEventDetails';
import AdminEventDetails from './pages/AdminEventDetails';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="app-shell">
          <Navbar />

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <MyProfile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/create-event"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <CreateEvent />
                </ProtectedRoute>
              }
            />

            <Route
              path="/my-event/:id"
              element={
                <ProtectedRoute allowedRoles={['CUSTOMER']}>
                  <MyEventDetails />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin-event/:id"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminEventDetails />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;