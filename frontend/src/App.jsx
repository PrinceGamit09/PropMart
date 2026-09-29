import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import AuthProvider from './context/AuthContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/Properties';
import PropertyDetails from './pages/PropertyDetails';
import Wishlist from './pages/Wishlist';
import SellerBookings from './pages/SellerBookings';
import AddProperty from './pages/AddProperty';
import EditProperty from './pages/EditProperty';
import AdminDashboard from './pages/AdminDashboard';
import AdminProperties from './pages/AdminProperties';
import AdminUsers from './pages/AdminUsers';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>

        <Navbar />

        <Routes>

          {/* ================================
              PUBLIC ROUTES
          ================================= */}

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
            path="/properties"
            element={<Properties />}
          />

          <Route
            path="/properties/:id"
            element={<PropertyDetails />}
          />

          {/* ================================
              BUYER ROUTES
          ================================= */}

          <Route
            path="/wishlist"
            element={
              <RoleRoute allowedRoles={['Buyer']}>
                <Wishlist />
              </RoleRoute>
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

          {/* ================================
              SELLER ROUTES
          ================================= */}

          <Route
            path="/seller"
            element={
              <RoleRoute allowedRoles={['Seller']}>
                <SellerBookings />
              </RoleRoute>
            }
          />

          <Route
            path="/seller/add-property"
            element={
              <RoleRoute allowedRoles={['Seller']}>
                <AddProperty />
              </RoleRoute>
            }
          />

          <Route
            path="/seller/edit-property/:id"
            element={
              <RoleRoute allowedRoles={['Seller']}>
                <EditProperty />
              </RoleRoute>
            }
          />

          {/* ================================
              ADMIN ROUTES
          ================================= */}

          <Route
            path="/admin"
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <AdminDashboard />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/properties"
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <AdminProperties />
              </RoleRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <RoleRoute allowedRoles={['Admin']}>
                <AdminUsers />
              </RoleRoute>
            }
          />

          {/* ================================
              GENERAL PROTECTED ROUTE
          ================================= */}

          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <h1>Protected Page</h1>
              </ProtectedRoute>
            }
          />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;