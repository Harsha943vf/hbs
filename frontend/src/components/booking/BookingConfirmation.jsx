import { CheckCircle, Copy, Mail, Phone, MapPin, Info } from 'lucide-react'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

export default function BookingConfirmation({ booking }) {
  if (!booking) return null

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return format(new Date(dateStr), 'dd MMM yyyy')
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50 py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-green-100 rounded-full blur-lg" />
              <CheckCircle className="h-20 w-20 text-green-600 relative" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
          <p className="text-gray-600">Your reservation has been successfully completed</p>
        </div>

        {/* Booking Details Card */}
        <div className="card p-6 sm:p-8 mb-6">
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">BOOKING REFERENCE</p>
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-primary-600 font-mono">{booking.bookingReference}</p>
              <button
                onClick={() => copyToClipboard(booking.bookingReference)}
                className="btn-secondary p-2 inline-flex"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Hotel & Room Info */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">{booking.hotelName}</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900">{booking.hotelLocation}</p>
                </div>
              </div>
              {booking.hotelPhone && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Contact</p>
                    <p className="text-gray-900">{booking.hotelPhone}</p>
                  </div>
                </div>
              )}
              {booking.hotelEmail && (
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900">{booking.hotelEmail}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">CHECK-IN</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(booking.checkInDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">CHECK-OUT</p>
              <p className="text-lg font-semibold text-gray-900">{formatDate(booking.checkOutDate)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">ROOM</p>
              <p className="text-lg font-semibold text-gray-900">{booking.roomNumber} ({booking.roomTypeDisplay})</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">GUESTS</p>
              <p className="text-lg font-semibold text-gray-900">{booking.numberOfGuests} {booking.numberOfGuests === 1 ? 'Guest' : 'Guests'}</p>
            </div>
          </div>

          {/* Status */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-2">STATUS</p>
            <span className={`inline-block px-3 py-1 rounded-full font-medium text-sm ${
              booking.status === 'CONFIRMED' 
                ? 'bg-green-100 text-green-800'
                : booking.status === 'PENDING'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}>
              {booking.status}
            </span>
          </div>

          {/* Amount */}
          <div className="text-right">
            <p className="text-sm text-gray-500 mb-1">TOTAL AMOUNT PAID</p>
            <p className="text-3xl font-bold text-primary-600">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="card p-4 bg-blue-50 border border-blue-200 mb-6">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">What's Next?</p>
              <ul className="space-y-1 text-xs">
                <li>• A confirmation email has been sent to your registered email address</li>
                <li>• Keep your booking reference for check-in</li>
                <li>• Contact the hotel directly for any special requests or changes</li>
                <li>• Review the cancellation policy from your confirmation email</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <a href="/bookings" className="btn-primary flex-1 text-center py-2.5">
            View All Bookings
          </a>
          <a href="/" className="btn-secondary flex-1 text-center py-2.5">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
