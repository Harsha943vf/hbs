import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { MapPin, Phone, Mail, Clock, Calendar, Search, Wifi, Waves, Dumbbell, Utensils, Car, Sparkles } from 'lucide-react'
import api from '../api/axios'
import StarRating from '../components/hotels/StarRating'
import RoomCard from '../components/hotels/RoomCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

const amenityIconMap = {
  'Free WiFi': Wifi, 'WiFi': Wifi, 'Swimming Pool': Waves, 'Pool': Waves,
  'Gym': Dumbbell, 'Restaurant': Utensils, 'Parking': Car, 'Spa': Sparkles,
}

const today = new Date().toISOString().split('T')[0]

export default function HotelDetailPage() {
  const { id } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [dateForm, setDateForm] = useState({
    checkIn: searchParams.get('checkIn') || '',
    checkOut: searchParams.get('checkOut') || '',
  })
  const [dateErrors, setDateErrors] = useState({})

  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true)
      try {
        const params = {}
        if (checkIn) params.checkIn = checkIn
        if (checkOut) params.checkOut = checkOut
        const res = await api.get(`/hotels/${id}`, { params })
        setHotel(res.data.data)
      } catch {
        setError('Hotel not found')
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [id, checkIn, checkOut])

  const handleDateSearch = (e) => {
    e.preventDefault()
    const errs = {}
    if (!dateForm.checkIn) errs.checkIn = 'Required'
    if (!dateForm.checkOut) errs.checkOut = 'Required'
    else if (dateForm.checkOut <= dateForm.checkIn) errs.checkOut = 'Must be after check-in'
    setDateErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSearchParams({ checkIn: dateForm.checkIn, checkOut: dateForm.checkOut })
  }

  if (loading) return <div className="pt-16"><LoadingSpinner fullPage /></div>
  if (error) return (
    <div className="pt-16 min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🏨</div>
        <h2 className="text-2xl font-bold text-gray-800">{error}</h2>
      </div>
    </div>
  )

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      {/* Hero image */}
      <div className="h-72 md:h-96 overflow-hidden bg-gray-200 relative">
        <img
          src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200'}
          alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <div className="max-w-7xl mx-auto">
            <StarRating rating={hotel.starRating} size="md" />
            <h1 className="text-3xl md:text-4xl font-bold mt-2">{hotel.name}</h1>
            <div className="flex items-center gap-1 mt-1 text-white/80">
              <MapPin className="h-4 w-4" />
              <span>{hotel.address}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3">About the Hotel</h2>
              <p className="text-gray-600 leading-relaxed">{hotel.description}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <span>Check-in: <strong>{hotel.checkInTime}</strong></span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-primary-600" />
                  <span>Check-out: <strong>{hotel.checkOutTime}</strong></span>
                </div>
                {hotel.phoneNumber && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4 text-primary-600" />
                    <span>{hotel.phoneNumber}</span>
                  </div>
                )}
                {hotel.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4 text-primary-600" />
                    <span className="truncate">{hotel.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Amenities */}
            {hotel.amenities && hotel.amenities.length > 0 && (
              <div className="card p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[...hotel.amenities].map((amenity) => {
                    const Icon = amenityIconMap[amenity] || Sparkles
                    return (
                      <div key={amenity} className="flex items-center gap-2 text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2">
                        <Icon className="h-4 w-4 text-primary-600 flex-shrink-0" />
                        {amenity}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Rooms */}
            <div className="card p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {checkIn && checkOut ? 'Available Rooms' : 'Room Types'}
              </h2>
              {checkIn && checkOut ? (
                <p className="text-sm text-gray-500 mb-4">
                  Showing availability for <strong>{checkIn}</strong> → <strong>{checkOut}</strong>
                </p>
              ) : (
                <p className="text-sm text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mb-4">
                  Select check-in & check-out dates to see real-time availability and book.
                </p>
              )}

              {hotel.rooms && hotel.rooms.length > 0 ? (
                <div className="space-y-4">
                  {hotel.rooms.map((room) => (
                    <RoomCard key={room.id} room={room} hotelId={hotel.id} checkIn={checkIn} checkOut={checkOut} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">😔</div>
                  <p>{checkIn && checkOut ? 'No rooms available for these dates.' : 'No rooms found.'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="card p-5 sticky top-24">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary-600" />
                {checkIn && checkOut ? 'Change Dates' : 'Select Dates'}
              </h3>
              <form onSubmit={handleDateSearch} className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Check-In</label>
                  <input
                    type="date" value={dateForm.checkIn} min={today}
                    onChange={(e) => setDateForm({ ...dateForm, checkIn: e.target.value })}
                    className={`input-field mt-1 ${dateErrors.checkIn ? 'border-red-400' : ''}`}
                  />
                  {dateErrors.checkIn && <p className="text-red-500 text-xs mt-1">{dateErrors.checkIn}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">Check-Out</label>
                  <input
                    type="date" value={dateForm.checkOut} min={dateForm.checkIn || today}
                    onChange={(e) => setDateForm({ ...dateForm, checkOut: e.target.value })}
                    className={`input-field mt-1 ${dateErrors.checkOut ? 'border-red-400' : ''}`}
                  />
                  {dateErrors.checkOut && <p className="text-red-500 text-xs mt-1">{dateErrors.checkOut}</p>}
                </div>
                <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
                  <Search className="h-4 w-4" /> Check Availability
                </button>
              </form>

              {checkIn && checkOut && hotel.startingPrice && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-sm text-gray-500">Starting from</div>
                  <div className="text-2xl font-bold text-primary-600">
                    ₹{hotel.startingPrice?.toLocaleString('en-IN')}
                    <span className="text-sm font-normal text-gray-400">/night</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
