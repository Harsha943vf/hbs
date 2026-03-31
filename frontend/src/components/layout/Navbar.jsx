import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Hotel, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Building2, BookOpen, CalendarDays } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [adminDropdown, setAdminDropdown] = useState(false)
  const [userDropdown, setUserDropdown] = useState(false)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
    setAdminDropdown(false)
    setUserDropdown(false)
  }, [location])

  const handleLogout = () => {
    logout()
    toast.success('Signed out successfully')
    navigate('/')
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || mobileOpen ? 'bg-primary-600 shadow-lg' : 'bg-primary-600/95 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-white hover:text-gold-400 transition-colors">
            <Hotel className="h-7 w-7 text-gold-400" />
            <span className="text-xl font-bold tracking-tight">LuxeStay</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Home</Link>
            <Link to="/hotels" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Hotels</Link>
            {isAuthenticated && (
              <Link to="/bookings" className="text-white/80 hover:text-white text-sm font-medium transition-colors">My Bookings</Link>
            )}
            {isAdmin && (
              <div className="relative">
                <button
                  onClick={() => setAdminDropdown(!adminDropdown)}
                  className="flex items-center gap-1 text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Admin
                  <ChevronDown className={`h-3 w-3 transition-transform ${adminDropdown ? 'rotate-180' : ''}`} />
                </button>
                {adminDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-gray-100">
                    <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <LayoutDashboard className="h-4 w-4 text-primary-600" /> Dashboard
                    </Link>
                    <Link to="/admin/hotels" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <Building2 className="h-4 w-4 text-primary-600" /> Manage Hotels
                    </Link>
                    <Link to="/admin/bookings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <BookOpen className="h-4 w-4 text-primary-600" /> All Bookings
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdown(!userDropdown)}
                  className="flex items-center gap-2 text-white hover:text-gold-400 transition-colors"
                >
                  <div className="h-8 w-8 rounded-full bg-gold-500 flex items-center justify-center text-white text-sm font-bold">
                    {user?.firstName?.[0]?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user?.firstName}</span>
                  <ChevronDown className={`h-3 w-3 transition-transform ${userDropdown ? 'rotate-180' : ''}`} />
                </button>
                {userDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-1 border border-gray-100">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.firstName} {user?.lastName}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <Link to="/bookings" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <CalendarDays className="h-4 w-4 text-primary-600" /> My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="h-4 w-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="text-white/80 hover:text-white text-sm font-medium transition-colors">Sign In</Link>
                <Link to="/signup" className="btn-gold text-sm px-4 py-2">Sign Up</Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-white">
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-primary-700 border-t border-primary-500 px-4 py-4 space-y-3">
          <Link to="/" className="block text-white/80 hover:text-white text-sm font-medium py-2">Home</Link>
          <Link to="/hotels" className="block text-white/80 hover:text-white text-sm font-medium py-2">Hotels</Link>
          {isAuthenticated && (
            <Link to="/bookings" className="block text-white/80 hover:text-white text-sm font-medium py-2">My Bookings</Link>
          )}
          {isAdmin && (
            <>
              <Link to="/admin" className="block text-gold-400 hover:text-gold-300 text-sm font-medium py-2">Admin Dashboard</Link>
              <Link to="/admin/hotels" className="block text-gold-400 hover:text-gold-300 text-sm font-medium py-2">Manage Hotels</Link>
              <Link to="/admin/bookings" className="block text-gold-400 hover:text-gold-300 text-sm font-medium py-2">All Bookings</Link>
            </>
          )}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="block w-full text-left text-red-400 hover:text-red-300 text-sm font-medium py-2">
              Sign Out
            </button>
          ) : (
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 text-center">Sign In</Link>
              <Link to="/signup" className="btn-gold text-sm flex-1 text-center">Sign Up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
