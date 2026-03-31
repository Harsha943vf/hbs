import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Hotel } from 'lucide-react'
import { differenceInDays } from 'date-fns'
import api from '../api/axios'
import LoadingSpinner from '../components/common/LoadingSpinner'
import BookingForm from '../components/booking/BookingForm'
import BookingSummary from '../components/booking/BookingSummary'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const roomId = searchParams.get('roomId')
  const hotelId = searchParams.get('hotelId')
  const checkIn = searchParams.get('checkIn')
  const checkOut = searchParams.get('checkOut')

  const [room, setRoom] = useState(null)
  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    if (!roomId || !hotelId || !checkIn || !checkOut) {
      toast.error('Invalid booking parameters')
      navigate('/')
      return
    }
    Promise.all([
      api.get(`/hotels/${hotelId}`, { params: { checkIn, checkOut } }),
    ]).then(([hotelRes]) => {
      const hotelData = hotelRes.data.data
      setHotel(hotelData)
      const foundRoom = hotelData.rooms?.find(r => r.id === parseInt(roomId))
      if (!foundRoom) {
        toast.error('Room not found or not available')
        navigate(`/hotels/${hotelId}`)
        return
      }
      setRoom(foundRoom)
    }).catch(() => {
      toast.error('Failed to load booking details')
      navigate('/')
    }).finally(() => setLoading(false))
  }, [roomId, hotelId, checkIn, checkOut, navigate])

  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0
  const totalAmount = room ? (room.pricePerNight * nights) : 0

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await api.post('/bookings', {
        roomId: parseInt(roomId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
        numberOfGuests: guests,
        specialRequests,
      })
      toast.success(`Booking confirmed! Ref: ${res.data.data.bookingReference}`)
      navigate('/bookings')
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="pt-16"><LoadingSpinner fullPage /></div>

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
          <Hotel className="h-6 w-6 text-primary-600" /> Confirm Your Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Booking form */}
          <div className="lg:col-span-3">
            <BookingForm 
              guests={guests}
              setGuests={setGuests}
              specialRequests={specialRequests}
              setSpecialRequests={setSpecialRequests}
              maxOccupancy={room?.maxOccupancy}
              isSubmitting={submitting}
              onSubmit={handleSubmit}
            />
          </div>

          {/* Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-24">
              <BookingSummary 
                room={room}
                hotel={hotel}
                checkIn={checkIn}
                checkOut={checkOut}
                guests={guests}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
