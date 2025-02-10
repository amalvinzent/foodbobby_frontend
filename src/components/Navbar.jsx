import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

function Navbar({ showCart }) {
  const navigate = useNavigate()
  const { cartItems } = useCart()

  const handleLogout = () => {
    navigate('/login')
  }

  const handleHomeNavigation = () => {
    const role = localStorage.getItem('userRole')
    if (role === 'user') {
      navigate('/user-home')
    } else if (role === 'admin' || role === 'manager') {
      navigate('/admin-home')
    }
  }

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto px-2 sm:px-4 lg:px-6">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center cursor-pointer"
            onClick={handleHomeNavigation}
          >
            <img
              src="https://i.ibb.co/gLKgq506/logo.png"
              alt="FoodBobby Logo"
              className="h-14 w-auto"
            />
            <span className="text-xl font-semibold text-gray-900 ml-2">
              FoodBobby
            </span>
          </div>
          <div className="flex items-center gap-4">
            {showCart && (
              <Link
                to="/cart"
                className="text-gray-600 hover:text-gray-900 relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItems.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-900 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
