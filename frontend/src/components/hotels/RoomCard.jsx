import { useNavigate } from 'react-router-dom'
import { Users, BedDouble, Wifi, Star } from 'lucide-react'

const roomTypeColors = {
  STANDARD: 'bg-blue-100 text-blue-800',
  DELUXE: 'bg-purple-100 text-purple-800',
  SUITE: 'bg-amber-100 text-amber-800',
  PRESIDENTIAL: 'bg-red-100 text-red-800',
}

export default function RoomCard({ room, hotelId, checkIn, checkOut }) {
  const navigate = useNavigate()

  const handleBook = () => {
    if (!checkIn || !checkOut) return
    const params = new URLSearchParams({
      roomId: room.id,
      hotelId,
      checkIn,
      checkOut,
    })
    navigate(`/booking?${params.toString()}`)
  }

  const canBook = checkIn && checkOut

  return (
    <div className="card p-5 flex flex-col sm:flex-row gap-4">
      <div className="sm:w-48 h-36 sm:h-auto rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={room.imageUrl || `https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400`}
          alt={room.roomTypeDisplay}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400' }}
        />
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${roomTypeColors[room.roomType] || 'bg-gray-100 text-gray-700'}`}>
              {room.roomTypeDisplay}
            </span>
            <h3 className="font-semibold text-gray-900 mt-1">Room {room.roomNumber}</h3>
          </div>
          <div className="text-right">
            <div className="text-primary-600 font-bold text-xl">₹{room.pricePerNight?.toLocaleString('en-IN')}</div>
            <div className="text-gray-400 text-xs">per night</div>
          </div>
        </div>

        {room.description && (
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{room.description}</p>
        )}

        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
          <span className="flex items-center gap-1">
            <Users className="h-4 w-4 text-gray-400" />
            Max {room.maxOccupancy} guests
          </span>
          <span className="flex items-center gap-1">
            <BedDouble className="h-4 w-4 text-gray-400" />
            {room.roomTypeDisplay}
          </span>
        </div>

        {room.amenities && room.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {[...room.amenities].slice(0, 5).map((a) => (
              <span key={a} className="text-xs bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                {a}
              </span>
            ))}
          </div>
        )}

        <button
          onClick={handleBook}
          disabled={!canBook}
          className={`w-full sm:w-auto btn-primary text-sm px-6 py-2 ${!canBook ? 'opacity-50 cursor-not-allowed' : ''}`}
          title={!canBook ? 'Please select check-in and check-out dates first' : ''}
        >
          {canBook ? 'Book Now' : 'Select Dates to Book'}
        </button>
      </div>
    </div>
  )
}
