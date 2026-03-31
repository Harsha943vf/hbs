import React from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * DEBUG COMPONENT
 * 
 * This component helps diagnose authentication issues.
 * Add it to your app temporarily to see token and auth status.
 * 
 * Usage:
 * 1. Import this component: import AuthDebugger from './components/common/AuthDebugger'
 * 2. Add to App.jsx temporarily: {process.env.NODE_ENV === 'development' && <AuthDebugger />}
 * 3. Open browser and check bottom-right corner
 * 4. Remove when done debugging
 */

export default function AuthDebugger() {
  const { user, token, isAuthenticated, isAdmin, loading } = useAuth()
  const [showDebug, setShowDebug] = React.useState(false)

  if (loading) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Toggle Button */}
      <button
        onClick={() => setShowDebug(!showDebug)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg text-sm font-semibold transition-colors"
      >
        {showDebug ? '🔒 Hide Debug' : '🔓 Show Debug'}
      </button>

      {/* Debug Panel */}
      {showDebug && (
        <div className="absolute bottom-12 right-0 bg-white border-2 border-blue-500 rounded-lg shadow-2xl p-4 w-80 text-xs font-mono">
          <div className="space-y-3">
            {/* Authentication Status */}
            <div className="border-b pb-2">
              <h3 className="font-bold text-blue-600 mb-2">🔐 Authentication Status</h3>
              <div className="space-y-1">
                <div>
                  <span className="text-gray-600">Authenticated:</span>
                  <span className={`ml-2 font-bold ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {isAuthenticated ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Admin:</span>
                  <span className={`ml-2 font-bold ${isAdmin ? 'text-green-600' : 'text-gray-600'}`}>
                    {isAdmin ? '✅ Yes' : '❌ No'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Loading:</span>
                  <span className={`ml-2 font-bold ${loading ? 'text-yellow-600' : 'text-green-600'}`}>
                    {loading ? '⏳ Yes' : '✅ No'}
                  </span>
                </div>
              </div>
            </div>

            {/* User Data */}
            {user && (
              <div className="border-b pb-2">
                <h3 className="font-bold text-blue-600 mb-2">👤 User Data</h3>
                <div className="space-y-1 bg-gray-100 p-2 rounded">
                  <div>
                    <span className="text-gray-600">ID:</span>
                    <span className="ml-2 text-gray-900">{user.id}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900 break-all">{user.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">{user.firstName} {user.lastName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <span className="ml-2 text-gray-900 font-bold">{user.role}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Token Info */}
            <div className="border-b pb-2">
              <h3 className="font-bold text-blue-600 mb-2">🔑 JWT Token</h3>
              {token ? (
                <div className="space-y-1">
                  <div className="text-green-600 font-bold">✅ Token Present</div>
                  <div className="bg-gray-100 p-2 rounded break-all text-xs max-h-24 overflow-y-auto">
                    {token.substring(0, 50)}...
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(token)
                      alert('Token copied to clipboard!')
                    }}
                    className="text-blue-600 hover:underline text-xs mt-1"
                  >
                    📋 Copy Token
                  </button>
                </div>
              ) : (
                <div className="text-red-600 font-bold">❌ No Token</div>
              )}
            </div>

            {/* LocalStorage Info */}
            <div className="border-b pb-2">
              <h3 className="font-bold text-blue-600 mb-2">💾 LocalStorage</h3>
              <div className="space-y-1 bg-gray-100 p-2 rounded text-xs">
                <div>
                  <span className="text-gray-600">token:</span>
                  <span className={localStorage.getItem('token') ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {localStorage.getItem('token') ? '✅ Stored' : '❌ Missing'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">user:</span>
                  <span className={localStorage.getItem('user') ? 'text-green-600 ml-2' : 'text-red-600 ml-2'}>
                    {localStorage.getItem('user') ? '✅ Stored' : '❌ Missing'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2">
              <h3 className="font-bold text-blue-600 mb-2">🔧 Quick Actions</h3>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    console.log('Token:', token)
                    console.log('User:', user)
                    console.log('Auth:', { isAuthenticated, isAdmin })
                    alert('Check console for debug data!')
                  }}
                  className="block w-full bg-blue-100 hover:bg-blue-200 text-blue-800 p-1 rounded text-xs font-semibold"
                >
                  📊 Log to Console
                </button>
                <button
                  onClick={() => {
                    localStorage.clear()
                    window.location.reload()
                  }}
                  className="block w-full bg-red-100 hover:bg-red-200 text-red-800 p-1 rounded text-xs font-semibold"
                >
                  🗑️ Clear Storage & Reload
                </button>
                <button
                  onClick={() => setShowDebug(false)}
                  className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-800 p-1 rounded text-xs font-semibold"
                >
                  ✖️ Close Debug
                </button>
              </div>
            </div>

            {/* Troubleshooting Tips */}
            <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs">
              <span className="font-bold text-yellow-800">💡 Tips:</span>
              <ul className="mt-1 space-y-0.5 text-yellow-700">
                <li>• Not authenticated? Go to /login</li>
                <li>• Token missing? Clear storage & login again</li>
                <li>• Check backend logs for JWT errors</li>
                <li>• Verify token is sent in API request headers</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * HOW TO USE THIS DEBUG COMPONENT:
 * 
 * 1. Place this file at: frontend/src/components/common/AuthDebugger.jsx
 * 
 * 2. Add to frontend/src/App.jsx:
 * 
 *    import AuthDebugger from './components/common/AuthDebugger'
 *    
 *    export default function App() {
 *      return (
 *        <div>
 *          <Navbar />
 *          <Routes>
 *            ...routes...
 *          </Routes>
 *          {process.env.NODE_ENV === 'development' && <AuthDebugger />}
 *        </div>
 *      )
 *    }
 * 
 * 3. Now you'll see a "Show Debug" button in bottom-right corner
 * 
 * 4. Click it to see:
 *    - Authentication status
 *    - User data (email, name, role)
 *    - JWT token
 *    - LocalStorage contents
 *    - Quick action buttons
 * 
 * 5. Remove after debugging!
 */
