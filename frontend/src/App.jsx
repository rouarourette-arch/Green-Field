import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import { AuthProvider, useAuth } from './context/AuthContext.jsx';

import { Navbar } from './components/Navbar.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { RoleProtectedRoute } from './components/RoleProtectedRoute.jsx';

import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Profile } from './pages/Profile.jsx';

import Home from './components/Home.jsx';
import AddProduct from './components/AddProduct.jsx';
import ProductDetails from './components/ProductDetails.jsx';
import Cart from './components/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import SellerProducts from './pages/SellerProducts.jsx';
import SellerDashboard from './pages/SellerDashboard.jsx';
import EditProduct from './pages/EditProduct.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminUsers from './pages/AdminUsers.jsx';
import AdminCategories from './pages/AdminCategories.jsx';
import AdminProducts from './pages/AdminProducts.jsx';
import AdminOrders from './pages/AdminOrders.jsx';
import OrderDetails from './pages/OrderDetails.jsx';
import SellerOrders from './pages/SellerOrders.jsx';
import AdminUserDetails from './pages/AdminUserDetails.jsx';
import AdminSellerDetails from './pages/AdminSellerDetails.jsx';
import Orders from './components/Orders.jsx';

import api from './api/axios.js';
import './App.css';


function AppContent() {
  const [products, setProducts] = useState([]);
  const { loading } = useAuth();

  const fetchProducts = async () => {
    try {
      const response = await api.get('/product');

      /*
       * Depending on your backend response:
       * response.data
       * OR response.data.products
       */

      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else if (Array.isArray(response.data.products)) {
        setProducts(response.data.products);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    }
  };


  useEffect(() => {
    /*
     * Wait until AuthContext finishes checking /auth/me.
     */
    if (!loading) {
      fetchProducts();
    }
  }, [loading]);


  if (loading) {
    return (
      <div className="loading-state">
        Loading...
      </div>
    );
  }


  return (
    <>
      <Navbar />

      <main>
        <Routes>

          {/* ================= PUBLIC ================= */}

          <Route
            path="/"
            element={
              <Home products={products} />
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProductDetails />
            }
          />

          <Route
            path="/login"
            element={
              <Login />
            }
          />

          <Route
            path="/register"
            element={
              <Register />
            }
          />


          {/* ================= AUTHENTICATED ================= */}

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <RoleProtectedRoute allowedRoles={['client']}>
                <Cart />
              </RoleProtectedRoute>
            }
          />


          <Route path="/checkout" element={<RoleProtectedRoute allowedRoles={['client']}><Checkout /></RoleProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />

          <Route path="/seller" element={<RoleProtectedRoute allowedRoles={['seller']}><SellerDashboard /></RoleProtectedRoute>} />
          <Route path="/seller/orders" element={<RoleProtectedRoute allowedRoles={['seller']}><SellerOrders /></RoleProtectedRoute>} />
          <Route path="/seller/products" element={<RoleProtectedRoute allowedRoles={['seller']}><SellerProducts /></RoleProtectedRoute>} />
          <Route path="/seller/products/add" element={<RoleProtectedRoute allowedRoles={['seller']}><AddProduct fetchProducts={fetchProducts} /></RoleProtectedRoute>} />
          <Route path="/seller/products/:id/edit" element={<RoleProtectedRoute allowedRoles={['seller']}><EditProduct /></RoleProtectedRoute>} />

          <Route path="/admin" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminDashboard /></RoleProtectedRoute>} />
          <Route path="/admin/users" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminUsers /></RoleProtectedRoute>} />
          <Route path="/admin/users/:id" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminUserDetails /></RoleProtectedRoute>} />
          <Route path="/admin/sellers/:id" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminSellerDetails /></RoleProtectedRoute>} />
          <Route path="/admin/categories" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminCategories /></RoleProtectedRoute>} />
          <Route path="/admin/products" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminProducts /></RoleProtectedRoute>} />
          <Route path="/admin/orders" element={<RoleProtectedRoute allowedRoles={['admin']}><AdminOrders /></RoleProtectedRoute>} />
          <Route path="/orders" element={<RoleProtectedRoute allowedRoles={['client']}><Orders /></RoleProtectedRoute>} />

          {/* ================= UNKNOWN ROUTE ================= */}

          <Route
            path="*"
            element={
              <Navigate to="/" replace />
            }
          />

        </Routes>
      </main>
    </>
  );
}


export function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}


export default App;