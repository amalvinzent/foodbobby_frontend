import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { LoadingProvider } from './context/LoadingContext'
import { CartProvider } from './context/CartContext'
import Loading from './components/Loading'
import Login from './pages/Login'
import Signup from './pages/Signup'
import UserHome from './pages/UserHome'
import AdminHome from './pages/AdminHome'
import Users from './components/Users'
import MenuItems from './components/MenuItems'
import Orders from './components/Orders'
import Cart from './pages/Cart'

function App() {
  return (
    <LoadingProvider>
      <CartProvider>
        <Router>
          <Loading />
          <Toaster position="top-right" />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/user-home" element={<UserHome />} />
            <Route path="/admin-home" element={<AdminHome />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/menu-items" element={<MenuItems />} />
            <Route path="/admin/orders" element={<Orders />} />
            <Route path="/" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </Router>
      </CartProvider>
    </LoadingProvider>
  )
}

export default App
