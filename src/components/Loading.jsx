import { useLoading } from '../context/LoadingContext'

function Loading() {
  const { loading } = useLoading()
  if (!loading) return null

  return (
    <div className="fixed inset-0 bg-gray-200 bg-opacity-70 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-gray-800"></div>
    </div>
  )
}

export default Loading
