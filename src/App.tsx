// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoutes';
import LoginForm from './components/Login/LoginForm';
import PageMainAdmin from './pages/PageMainAdmin';
import MovieMainClientCompoment from './pages/MovieMainClientt';
import PayComponent from './components/Pay/PayComponent';
import PaymentSubscriptionComponent from './components/Pay/PaymentSubscriptionComponent';
import PreDashboard from './components/PreDashboard';
import UserComponent from './components/User/UserComponent';
import SubscriptionComponent from './components/Subscription/SubscriptionComponent';
import Unauthorized from './components/Unauthorized';
import Landing from './components/Landing/Landing';
import NavBar from './components/NavBar/NavBar';
const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <NavBar /> {/* Include NavBar here to make it always visible */}
        <div className="app-content"> {/* Add a container for the main content */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route element={<PrivateRoute roles={['admin','super_admin','client']} />}>
              <Route path="/pre-dashboard" element={<PreDashboard />} />
              <Route path="/payment-create" element={<PaymentSubscriptionComponent />} />
              <Route path="/movies-netflix" element={<MovieMainClientCompoment />} />
            </Route>
            <Route element={<PrivateRoute roles={['super_admin']} />}>
              <Route path="/pays" element={<PayComponent />} />
              <Route path="/subscriptions" element={<SubscriptionComponent />} />
            </Route>
            <Route element={<PrivateRoute roles={['admin','super_admin']} />}>
              <Route path="/admin-content" element={<PageMainAdmin />} />
              {/* <Route path="/users" element={<UserComponent />} /> */}
            </Route>
            <Route element={<PrivateRoute roles={['client']} />}>
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
