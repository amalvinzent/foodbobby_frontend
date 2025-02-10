import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaTrash } from 'react-icons/fa'
import Navbar from './Navbar'
import Modal from './Modal'
import api from '../utils/axios'
import { useLoading } from '../context/LoadingContext'

function Orders() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [orders, setOrders] = useState([])
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [role, setRole] = useState(null)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin' && role !== 'manager') {
      navigate('/login')
    }
    setRole(role)

    const fetchOrders = async () => {
      try {
        setLoading(true)
        const response = await api.get('/orders')
        if (response.data.statusCode !== 200) {
          toast.error(response.data.message || 'Failed to fetch orders')
          return
        }
        setOrders(response.data.data)
      } catch (error) {
        toast.error('Failed to fetch orders')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const handleView = (orderId) => {
    const order = orders.find((o) => o._id === orderId)
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const handleDelete = async (orderId) => {
    try {
      setLoading(true)
      const response = await api.delete(`/orders/${orderId}`)
      if (response.data.statusCode !== 200) {
        toast.error(response.data.message || 'Failed to delete order')
        return
      }
      setOrders(orders.filter((order) => order._id !== orderId))
      toast.success('Order deleted successfully')
    } catch (error) {
      toast.error('Failed to delete order')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={false} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Orders</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders?.map((order) => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.userId.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(order._id)}
                        className="text-black hover:text-gray-500 cursor-pointer"
                      >
                        <FaEye size={16} />
                      </button>
                      {role == 'admin' && (
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="text-black hover:text-gray-500 cursor-pointer"
                        >
                          <FaTrash size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        title="Order Details"
        createMode={false}
      >
        {selectedOrder && (
          <div className="space-y-6 px-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">
                Order ID
              </label>
              <p className="mt-1 text-gray-900">{selectedOrder._id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Customer Name
              </label>
              <p className="mt-1 text-gray-900">
                {selectedOrder.userId.username}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Total Amount
              </label>
              <p className="mt-1 text-gray-900">
                ₹{selectedOrder.totalAmount.toFixed(2)}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Status
              </label>
              <p className="mt-1 text-gray-900">{selectedOrder.status}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Order Items
              </label>
              <div className="mt-2 space-y-2">
                {selectedOrder.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <span className="font-medium">{item.menuItem.name}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        ({item.menuItem.category})
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-500">
                        ₹{item.menuItem.price} each
                      </span>
                      <span>x{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Orders
