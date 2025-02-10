import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import api from '../utils/axios'
import { useLoading } from '../context/LoadingContext'
import { useCart } from '../context/CartContext'

function UserHome() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [menuItems, setMenuItems] = useState([])

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'user') {
      navigate('/login')
    }

    const fetchMenuItems = async () => {
      try {
        setLoading(true)
        const response = await api.get('/menu')
        if (response.data.statusCode !== 200) {
          toast.error(response.data.message || 'Failed to fetch menu items')
          return
        }
        setMenuItems(response.data.data)
      } catch (error) {
        toast.error('Failed to fetch menu items')
      } finally {
        setLoading(false)
      }
    }
    fetchMenuItems()
  }, [])

  const { addToCart } = useCart()

  const handleAddToCart = (item) => {
    addToCart(item)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={true} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Menu Items</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow-sm p-6 flex flex-col"
            >
              <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
              <p className="text-gray-600 mb-2">{item.category}</p>
              <p className="text-lg font-medium mb-4">
                ₹{item.price.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {item.availability ? 'Available' : 'Unavailable'}
              </p>
              <button
                onClick={() => handleAddToCart(item)}
                disabled={!item.availability}
                className={`mt-auto py-2 px-4 rounded-lg ${
                  item.availability
                    ? 'bg-black text-white hover:bg-gray-800 cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserHome
