import { useNavigate } from 'react-router-dom'
import { MapPin, Wifi, Car, Dumbbell, Waves, UtensilsCrossed, Sparkles } from 'lucide-react'
import StarRating from './StarRating'

const amenityIcons = {
  'Free WiFi': Wifi,
  'Parking': Car,
  'Gym': Dumbbell,
  'Swimming Pool': Waves,
  'Restaurant': UtensilsCrossed,
  'Spa': Sparkles,
}

export default function HotelCard({ hotel, checkIn, checkOut }) {
  const navigate = useNavigate()

  const handleViewDetails = () => {
    const params = new URLSearchParams()
    if (checkIn) params.set('checkIn', checkIn)
    if (checkOut) params.set('checkOut', checkOut)
    navigate(`/hotels/${hotel.id}?${params.toString()}`)
  }

  const displayAmenities = hotel.amenities ? [...hotel.amenities].slice(0, 4) : []

  return (
    <div className="card overflow-hidden group cursor-pointer" onClick={handleViewDetails}>
      <div className="relative h-52 overflow-hidden bg-gray-200">
        <img
          src={hotel.imageUrl || `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600`}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'
          }}
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
          <StarRating rating={hotel.starRating} />
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1 line-clamp-1">{hotel.name}</h3>
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{hotel.location}</span>
        </div>

        {displayAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {displayAmenities.map((amenity) => {
              const Icon = amenityIcons[amenity]
              return (
                <span key={amenity} className="flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">
                  {Icon && <Icon className="h-3 w-3" />}
                  {amenity}
                </span>
              )
            })}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
          <div>
            <span className="text-xs text-gray-500">Starting from</span>
            <div className="text-primary-600 font-bold text-lg">
              ₹{hotel.startingPrice?.toLocaleString('en-IN') || 'N/A'}
              <span className="text-gray-400 text-sm font-normal">/night</span>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); handleViewDetails() }}
            className="btn-primary text-sm px-4 py-2"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  )
}
