import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { FaEye, FaTrash } from 'react-icons/fa'
import Navbar from './Navbar'
import Modal from './Modal'
import api from '../utils/axios'
import { useLoading } from '../context/LoadingContext'

function Users() {
  const navigate = useNavigate()
  const { setLoading } = useLoading()
  const [users, setUsers] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    if (role !== 'admin') {
      navigate('/login')
    }

    const fetchUsers = async () => {
      try {
        setLoading(true)
        const response = await api.get('/auth/users')
        setUsers(response.data.data)
      } catch (error) {
        toast.error('Failed to fetch users')
      } finally {
        setLoading(false)
      }
    }
    fetchUsers()
  }, [])

  const handleView = (userId) => {
    const user = users.find((u) => u._id === userId)
    setSelectedUser(user)
    setIsModalOpen(true)
  }

  const handleDelete = async (userId) => {
    try {
      await api.delete(`/auth/users/${userId}`)
      setUsers(users.filter((user) => user._id !== userId))
      toast.success('User deleted successfully')
    } catch (error) {
      toast.error('Failed to delete user')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={false} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">Users</h1>
        <div className="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user._id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleView(user._id)}
                        className="text-black hover:text-gray-500 cursor-pointer"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="text-black hover:text-gray-500 cursor-pointer"
                      >
                        <FaTrash size={16} />
                      </button>
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
        onClose={() => setIsModalOpen(false)}
        title="User Details"
      >
        {selectedUser && (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">
                Username
              </label>
              <p className="mt-1 text-gray-900">{selectedUser.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Role</label>
              <p className="mt-1 text-gray-900">{selectedUser.role}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">
                User ID
              </label>
              <p className="mt-1 text-gray-900">{selectedUser._id}</p>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default Users
