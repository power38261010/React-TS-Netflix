// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoutes';
import LoginForm from './components/Login/LoginForm';
import RegisterForm from './components/Register/RegisterForm';

import PageDashboardSuperAdmin from './pages/PageDashboardSuperAdmin';
import PageMainAdmin from './pages/PageMovieAdmin';
import MovieMainClientCompoment from './pages/MovieMainClientt';
import PaymentSubscriptionComponent from './components/Pay/Client/PaymentSubscriptionComponent';
import PreDashboard from './components/PreDashboard';
import PageUsersAdmin from './pages/PageUsersAdmin';
import Unauthorized from './components/Unauthorized';
import Landing from './components/Landing/Landing';
import NavBar from './components/NavBar/NavBar';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar />
        <div className="app-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<PrivateRoute roles={['admin','super_admin','client']} />}>
              <Route path="/pre-dashboard" element={<PreDashboard />} />
            </Route>
            <Route element={<PrivateRoute roles={['admin','super_admin']} />}>
              <Route path="/admin-content" element={<PageMainAdmin />} />
              <Route path="/users" element={<PageUsersAdmin />} />
            </Route>
            <Route element={<PrivateRoute roles={['super_admin']} />}>
              <Route path="/super-admin-dashboard" element={<PageDashboardSuperAdmin />} />
            </Route>
            <Route element={<PrivateRoute roles={['client']} />}>
            <Route path="/payment-create" element={<PaymentSubscriptionComponent />} />
              <Route path="/movies-netflix" element={<MovieMainClientCompoment />} />
            </Route>
            {/* Other routes */}
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
