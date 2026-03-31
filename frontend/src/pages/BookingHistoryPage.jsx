import { useState, useEffect } from 'react'
import api from '../api/axios'
import LoadingSpinner from '../components/common/LoadingSpinner'
import BookingCard from '../components/booking/BookingCard'
import CancelBookingModal from '../components/booking/CancelBookingModal'
import toast from 'react-hot-toast'

export default function BookingHistoryPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState(null)
  const [confirmCancel, setConfirmCancel] = useState(null)

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/my-bookings')
      setBookings(res.data.data || [])
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings() }, [])

  const handleCancel = async (bookingId) => {
    setCancelling(bookingId)
    try {
      await api.put(`/bookings/${bookingId}/cancel`)
      toast.success('Booking cancelled successfully')
      setConfirmCancel(null)
      fetchBookings()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel booking')
    } finally {
      setCancelling(null)
    }
  }

  if (loading) return <div className="pt-16"><LoadingSpinner fullPage /></div>

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-500 mb-8">View and manage your hotel reservations</p>

        {bookings.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">🏨</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No bookings yet</h3>
            <p className="text-gray-500 mb-6">Start exploring and book your dream stay!</p>
            <a href="/hotels" className="btn-primary px-8 inline-block">Browse Hotels</a>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                canCancel={true}
                isLoading={cancelling === booking.id}
                onViewDetails={() => {
                  // Navigate to booking details if needed
                  toast.info('View details functionality can be added here')
                }}
                onCancel={() => setConfirmCancel(booking)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Cancel confirmation modal */}
      {confirmCancel && (
        <CancelBookingModal
          booking={confirmCancel}
          isLoading={cancelling === confirmCancel.id}
          onCancel={() => setConfirmCancel(null)}
          onConfirm={() => handleCancel(confirmCancel.id)}
        />
      )}
    </div>
  )
}
