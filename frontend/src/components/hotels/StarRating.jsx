import { Star } from 'lucide-react'

export default function StarRating({ rating, max = 5, size = 'sm' }) {
  const sizes = { sm: 'h-4 w-4', md: 'h-5 w-5', lg: 'h-6 w-6' }
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={`${sizes[size]} ${i < rating ? 'fill-gold-500 text-gold-500' : 'fill-gray-200 text-gray-200'}`}
        />
      ))}
    </div>
  )
}
