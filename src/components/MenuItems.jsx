import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaTrash, FaPlus } from 'react-icons/fa'
import Navbar from './Navbar'
import Modal from './Modal'
import api from '../utils/axios'
import { useLoading } from '../context/LoadingContext'

function MenuItems() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [menuItems, setMenuItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCreateMode, setIsCreateMode] = useState(false)
  const [role, setRole] = useState(null)
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: '',
    availability: true
  })

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin' && role !== 'manager') {
      navigate('/login')
    }
    setRole(role)

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

  const handleView = (itemId) => {
    const item = menuItems.find((i) => i._id === itemId)
    setSelectedItem(item)
    setIsCreateMode(false)
    setIsModalOpen(true)
  }

  const handleDelete = async (itemId) => {
    try {
      setLoading(true)
      const response = await api.delete(`/menu/${itemId}`)
      if (response.data.statusCode !== 200) {
        toast.error(response.data.message || 'Failed to delete menu item')
        return
      }
      setMenuItems(menuItems.filter((item) => item._id !== itemId))
      toast.success('Menu item deleted successfully')
    } catch (error) {
      toast.error('Failed to delete menu item')
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = () => {
    setIsCreateMode(true)
    setSelectedItem(null)
    setIsModalOpen(true)
  }

  const handleSubmit = async () => {
    try {
      if (!newItem.name || !newItem.price || !newItem.category) {
        toast.error('Please fill in all fields')
        return
      }
      setLoading(true)
      const response = await api.post('/menu', newItem)
      if (response.data.statusCode !== 200) {
        toast.error(response.data.message || 'Failed to create menu item')
        return
      }
      setMenuItems([...menuItems, response.data.data])
      setIsModalOpen(false)
      setNewItem({
        name: '',
        price: '',
        category: '',
        availability: true
      })
      toast.success('Menu item created successfully')
    } catch (error) {
      toast.error('Failed to create menu item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={false} />
      <div className="p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Menu Items</h1>
          {role == 'admin' && (
            <button
              onClick={handleCreate}
              className="bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
            >
              <FaPlus size={16} />
              Create Item
            </button>
          )}
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {menuItems?.map((item) => (
                <tr key={item._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.availability ? 'Available' : 'Unavailable'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(item._id)}
                        className="text-black hover:text-gray-500 cursor-pointer"
                      >
                        <FaEye size={16} />
                      </button>
                      {role == 'admin' && (
                        <button
                          onClick={() => handleDelete(item._id)}
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
          setIsCreateMode(false)
        }}
        title={isCreateMode ? 'Create Menu Item' : 'Menu Item Details'}
        createMode={isCreateMode}
        onSubmit={handleSubmit}
      >
        {isCreateMode ? (
          <div className="space-y-6 px-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Name</label>
              <input
                type="text"
                value={newItem.name}
                onChange={(e) =>
                  setNewItem({ ...newItem, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={newItem.price}
                onChange={(e) => {
                  const value = e.target.value
                  if (value >= 0 || value === '') {
                    setNewItem({
                      ...newItem,
                      price: value === '' ? '' : parseFloat(value)
                    })
                  }
                }}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500">
                Category
              </label>
              <input
                type="text"
                value={newItem.category}
                onChange={(e) =>
                  setNewItem({ ...newItem, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-2"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                Availability
              </label>
              <input
                type="checkbox"
                checked={newItem.availability}
                onChange={(e) =>
                  setNewItem({ ...newItem, availability: e.target.checked })
                }
                className="ml-2"
              />
            </div>
          </div>
        ) : (
          selectedItem && (
            <div className="space-y-6 px-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-gray-900">{selectedItem.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Category
                </label>
                <p className="mt-1 text-gray-900">{selectedItem.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Price
                </label>
                <p className="mt-1 text-gray-900">
                  ₹{selectedItem.price.toFixed(2)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Availability
                </label>
                <p className="mt-1 text-gray-900">
                  {selectedItem.availability ? 'Available' : 'Unavailable'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">
                  Item ID
                </label>
                <p className="mt-1 text-gray-900">{selectedItem._id}</p>
              </div>
            </div>
          )
        )}
      </Modal>
    </div>
  )
}

export default MenuItems
