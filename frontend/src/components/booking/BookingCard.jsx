import { Hotel, MapPin, Calendar, Users, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

const statusConfig = {
  CONFIRMED: { icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Confirmed' },
  CANCELLED: { icon: XCircle, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Cancelled' },
  COMPLETED: { icon: CheckCircle, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Completed' },
  PENDING: { icon: AlertCircle, color: 'text-yellow-600', bgColor: 'bg-yellow-50', label: 'Pending' },
}

export default function BookingCard({ booking, onCancel, onViewDetails, canCancel = false, isLoading = false }) {
  const status = statusConfig[booking.status] || statusConfig.PENDING
  const StatusIcon = status.icon

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return format(new Date(dateStr), 'dd MMM yyyy')
  }

  const nights = differenceInDays(new Date(booking.checkOutDate), new Date(booking.checkInDate))

  return (
    <div className="card p-5 sm:p-6 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        {/* Hotel Image */}
        <div className="sm:w-48 h-36 sm:h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <img
            src={booking.hotelImageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300'}
            alt={booking.hotelName}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300' }}
          />
        </div>

        {/* Booking Info */}
        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 text-lg">{booking.hotelName}</h3>
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                {booking.hotelLocation}
              </div>
            </div>
            <div className={`${status.bgColor} ${status.color} px-3 py-1 rounded-full flex items-center gap-1 w-fit`}>
              <StatusIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{status.label}</span>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500 font-medium">REFERENCE</p>
              <p className="font-mono font-semibold text-gray-900 mt-0.5">{booking.bookingReference}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500 font-medium">ROOM</p>
              <p className="font-semibold text-gray-900 mt-0.5">{booking.roomNumber}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500 font-medium">NIGHTS</p>
              <p className="font-semibold text-gray-900 mt-0.5">{nights}</p>
            </div>
            <div className="bg-gray-50 p-2 rounded">
              <p className="text-xs text-gray-500 font-medium">TOTAL</p>
              <p className="font-semibold text-gray-900 mt-0.5">₹{booking.totalAmount?.toLocaleString('en-IN')}</p>
            </div>
          </div>

          {/* Dates and Guests */}
          <div className="flex flex-wrap gap-3 text-sm text-gray-600 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-primary-600" />
              <span>
                <strong>{formatDate(booking.checkInDate)}</strong> → <strong>{formatDate(booking.checkOutDate)}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 text-primary-600" />
              <span>{booking.numberOfGuests} Guest{booking.numberOfGuests !== 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            <button
              onClick={onViewDetails}
              className="btn-secondary text-sm px-4 py-1.5"
            >
              View Details
            </button>
            {canCancel && booking.status === 'CONFIRMED' && (
              <button
                onClick={onCancel}
                disabled={isLoading}
                className="text-sm px-4 py-1.5 bg-red-50 text-red-700 border border-red-300 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
