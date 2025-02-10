import { useEffect, useState } from 'react'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useLoading } from '../context/LoadingContext'
import { useCart } from '../context/CartContext'

function Login() {
  const navigate = useNavigate()
  const { clearCart } = useCart()
  const { setLoading } = useLoading()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  useEffect(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('userRole')
    clearCart()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post('/auth/login', formData)
      const { access_token, role } = response.data.data
      localStorage.setItem('access_token', access_token)
      localStorage.setItem('userRole', role)
      toast.success('Successfully logged in')
      if (role === 'user') {
        navigate('/user-home')
      } else if (role === 'admin' || role === 'manager') {
        navigate('/admin-home')
      }
    } catch (err) {
      toast.error('Failed to login')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-6 sm:p-10 bg-white rounded-xl shadow-sm">
        <div>
          <h2 className="text-center text-xl sm:text-2xl font-semibold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="space-y-6 sm:space-y-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-gray-200 rounded-lg placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* {error && <p className="text-center text-sm text-red-600">{error}</p>} */}
          <div>
            <button
              type="submit"
              className="w-full py-2.5 sm:py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 cursor-pointer transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <a
                href="/signup"
                className="font-medium text-black hover:text-gray-800"
              >
                Sign up
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
