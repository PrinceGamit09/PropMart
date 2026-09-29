import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AuthProvider from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>

      <BrowserRouter>

        <Navbar />

        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <h1>Protected Page</h1>
              </ProtectedRoute>
            }
          />

          <Route
            path="/buyer"
            element={
              <RoleRoute allowedRoles={['Buyer']}>
                <h1>Buyer Page</h1>
              </RoleRoute>
            }
          />

          <Route
            path="/seller"
            element={
              <RoleRoute allowedRoles={['Seller']}>
                <h1>Seller Page</h1>
              </RoleRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <h1>Admin Page</h1>
              </RoleRoute>
            }
          />

        </Routes>

      </BrowserRouter>

    </AuthProvider>
  );
}

export default App;