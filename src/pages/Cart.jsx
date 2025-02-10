import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Navbar from '../components/Navbar'
import api from '../utils/axios'
import toast from 'react-hot-toast'
import { useLoading } from '../context/LoadingContext'

function Cart() {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart, clearCart } = useCart()
  const { setLoading } = useLoading()

  const handlePlaceOrder = async () => {
    try {
      setLoading(true)
      const orderItems = cartItems.map((item) => ({
        menuItemId: item._id,
        quantity: item.quantity
      }))

      const response = await api.post('/orders', { items: orderItems })

      if (response.data.statusCode === 200) {
        toast.success('Order placed successfully')
        clearCart()
        navigate('/user-home')
      } else {
        toast.error(response.data.message || 'Failed to place order')
      }
    } catch (error) {
      toast.error('Failed to place order')
    } finally {
      setLoading(false)
    }
  }

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  )

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-50">
        <Navbar showCart={true} />
        <div className="flex items-center justify-center h-[calc(100vh-64px)]">
          <div className="text-center">
            <h1 className="text-2xl font-semibold mb-4">Your Cart</h1>
            <p className="text-gray-600">Your cart is empty</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={true} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
        <div className="bg-white rounded-xl shadow-sm p-6">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between items-center py-4 border-b last:border-b-0"
            >
              <div>
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">
                  ₹{item.price.toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => removeFromCart(item._id, 1)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="px-2 py-1 bg-gray-100 rounded"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="mt-6 pt-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold">Total Amount:</span>
              <span className="text-lg font-semibold">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 cursor-pointer"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
