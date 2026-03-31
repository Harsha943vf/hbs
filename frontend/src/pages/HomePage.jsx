import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, MapPin, Calendar, Shield, Tag, Headphones, Star, ChevronRight } from 'lucide-react'
import { useEffect } from 'react'
import api from '../api/axios'
import HotelCard from '../components/hotels/HotelCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const today = new Date().toISOString().split('T')[0]
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0]

export default function HomePage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState({ location: '', checkIn: '', checkOut: '' })
  const [errors, setErrors] = useState({})
  const [featuredHotels, setFeaturedHotels] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/hotels?page=0&size=6')
      .then(res => setFeaturedHotels(res.data.data?.content || []))
      .catch(() => toast.error('Failed to load featured hotels'))
      .finally(() => setLoading(false))
  }, [])

  const validate = () => {
    const e = {}
    if (!search.location.trim()) e.location = 'Please enter a location'
    if (!search.checkIn) e.checkIn = 'Select check-in date'
    if (!search.checkOut) e.checkOut = 'Select check-out date'
    else if (search.checkIn && search.checkOut <= search.checkIn) e.checkOut = 'Check-out must be after check-in'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!validate()) return
    const params = new URLSearchParams(search)
    navigate(`/hotels?${params.toString()}`)
  }

  const destinations = ['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Udaipur', 'Hyderabad']

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-[85vh] flex items-center justify-center bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600")', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="absolute inset-0 bg-primary-800/70" />

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="h-px w-16 bg-gold-500" />
            <span className="text-gold-400 text-sm font-medium tracking-widest uppercase">Premium Hotel Booking</span>
            <div className="h-px w-16 bg-gold-500" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your <span className="text-gold-400">Perfect Stay</span>
          </h1>
          <p className="text-white/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Discover luxury hotels, boutique stays, and palace resorts across India's most beautiful destinations.
          </p>

          {/* Search form */}
          <div className="bg-white rounded-2xl p-4 md:p-6 shadow-2xl">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 text-left">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      value={search.location}
                      onChange={(e) => setSearch({ ...search, location: e.target.value })}
                      className={`input-field pl-9 ${errors.location ? 'border-red-400' : ''}`}
                      placeholder="Mumbai, Goa, Delhi..."
                    />
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-1 text-left">{errors.location}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 text-left">Check-In</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={search.checkIn}
                      min={today}
                      onChange={(e) => setSearch({ ...search, checkIn: e.target.value, checkOut: '' })}
                      className={`input-field pl-9 ${errors.checkIn ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.checkIn && <p className="text-red-500 text-xs mt-1 text-left">{errors.checkIn}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 text-left">Check-Out</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      value={search.checkOut}
                      min={search.checkIn || today}
                      onChange={(e) => setSearch({ ...search, checkOut: e.target.value })}
                      className={`input-field pl-9 ${errors.checkOut ? 'border-red-400' : ''}`}
                    />
                  </div>
                  {errors.checkOut && <p className="text-red-500 text-xs mt-1 text-left">{errors.checkOut}</p>}
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
                <Search className="h-5 w-5" />
                Search Hotels
              </button>
            </form>
          </div>

          {/* Quick destinations */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {destinations.map((d) => (
              <button
                key={d}
                onClick={() => navigate(`/hotels?location=${d}`)}
                className="bg-white/10 hover:bg-white/20 text-white text-sm px-4 py-1.5 rounded-full border border-white/20 transition-colors"
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Why LuxeStay */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose LuxeStay?</h2>
            <p className="text-gray-500 mt-2">The trusted platform for premium hotel bookings</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Verified Hotels', desc: 'Every hotel is personally verified for quality and authenticity before listing.', color: 'text-primary-600', bg: 'bg-primary-50' },
              { icon: Tag, title: 'Best Price Guarantee', desc: "Find a better price? We'll match it. Always get the best deal with us.", color: 'text-gold-500', bg: 'bg-amber-50' },
              { icon: Headphones, title: '24/7 Support', desc: 'Our dedicated team is available round the clock to assist you anytime.', color: 'text-green-600', bg: 'bg-green-50' },
            ].map(({ icon: Icon, title, desc, color, bg }) => (
              <div key={title} className="text-center p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-4 rounded-2xl ${bg} mb-4`}>
                  <Icon className={`h-8 w-8 ${color}`} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Hotels</h2>
              <p className="text-gray-500 mt-1">Handpicked luxury stays across India</p>
            </div>
            <button
              onClick={() => navigate('/hotels')}
              className="flex items-center gap-1 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              View all <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
