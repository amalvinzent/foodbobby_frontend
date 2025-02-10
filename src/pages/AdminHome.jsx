import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'

function AdminHome() {
  const navigate = useNavigate()
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const role = localStorage.getItem('userRole')
    setUserRole(role)
    if (role !== 'admin' && role !== 'manager') {
      navigate('/login')
    }
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar showCart={false} />
      <div className="p-8">
        <h1 className="text-2xl font-semibold mb-6">
          Welcome,{' '}
          {userRole == 'admin'
            ? 'Admin'
            : userRole == 'manager'
            ? 'Manager'
            : ''}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {userRole === 'admin' && (
            <div
              onClick={() => handleNavigation('/admin/users')}
              className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <h2 className="text-xl font-semibold mb-2">Users</h2>
              <p className="text-gray-600">Manage users</p>
            </div>
          )}
          <div
            onClick={() => handleNavigation('/admin/menu-items')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Menu Items</h2>
            <p className="text-gray-600">Add, edit, or remove menu items</p>
          </div>
          <div
            onClick={() => handleNavigation('/admin/orders')}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
          >
            <h2 className="text-xl font-semibold mb-2">Orders</h2>
            <p className="text-gray-600">View and manage customer orders</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminHome
