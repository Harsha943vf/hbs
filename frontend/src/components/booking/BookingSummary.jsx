import { MapPin, DollarSign, Calendar, Users, Hotel } from 'lucide-react'
import { differenceInDays, format } from 'date-fns'

export default function BookingSummary({ room, hotel, checkIn, checkOut, guests }) {
  const nights = checkIn && checkOut ? differenceInDays(new Date(checkOut), new Date(checkIn)) : 0
  const pricePerNight = room?.pricePerNight || 0
  const totalAmount = pricePerNight * nights

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return format(date, 'dd MMM yyyy')
  }

  return (
    <div className="space-y-4">
      {/* Hotel Info */}
      {hotel && (
        <div className="card p-4 border-l-4 border-primary-600">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Hotel className="h-5 w-5 text-primary-600" /> {hotel.name}
          </h3>
          <p className="text-sm text-gray-600 flex items-center gap-1">
            <MapPin className="h-4 w-4 text-gray-400" /> {hotel.address}
          </p>
        </div>
      )}

      {/* Room Info */}
      {room && (
        <div className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-3 text-lg">Room Details</h3>
          <div className="space-y-2 text-sm">
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Room:</span> {room.roomNumber} ({room.roomTypeDisplay})
            </p>
            <p className="text-gray-700">
              <span className="font-medium text-gray-900">Capacity:</span> Up to {room.maxOccupancy} guests
            </p>
            {room.description && (
              <p className="text-gray-700">
                <span className="font-medium text-gray-900">Description:</span> {room.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Booking Dates */}
      <div className="card p-4">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary-600" /> Dates
        </h3>
        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-xs font-medium">CHECK-IN</p>
            <p className="font-semibold text-gray-900 mt-1">{formatDate(checkIn)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-gray-500 text-xs font-medium">CHECK-OUT</p>
            <p className="font-semibold text-gray-900 mt-1">{formatDate(checkOut)}</p>
          </div>
        </div>
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-900">{nights}</span> night{nights !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Guests */}
      {guests && (
        <div className="card p-4 bg-blue-50 border border-blue-100">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm text-gray-700">
              <span className="font-semibold text-gray-900">{guests}</span> Guest{guests !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="card p-4 bg-gradient-to-br from-primary-50 to-primary-100 border-2 border-primary-200">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary-600" /> Price Breakdown
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center pb-2 border-b border-primary-200">
            <span className="text-gray-700">
              ₹{pricePerNight.toLocaleString('en-IN')} × {nights} night{nights !== 1 ? 's' : ''}
            </span>
            <span className="font-semibold text-gray-900">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between items-center pt-2">
            <span className="text-lg font-bold text-gray-900">Total Amount</span>
            <span className="text-2xl font-bold text-primary-600">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
