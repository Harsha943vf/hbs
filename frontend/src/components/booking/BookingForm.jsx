import { Users, FileText, AlertCircle } from 'lucide-react'

export default function BookingForm({ 
  guests, 
  setGuests, 
  specialRequests, 
  setSpecialRequests, 
  maxOccupancy, 
  isSubmitting,
  onSubmit 
}) {
  const guestOptions = Array.from({ length: maxOccupancy || 1 }, (_, i) => i + 1)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Guest Details */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary-600" /> Guest Details
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Number of Guests
          </label>
          <select
            value={guests}
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="input-field"
          >
            {guestOptions.map((n) => (
              <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">Maximum {maxOccupancy} guests allowed</p>
        </div>
      </div>

      {/* Special Requests */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary-600" /> Special Requests
        </h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Any special requirements? (Optional)
          </label>
          <textarea
            value={specialRequests}
            onChange={(e) => setSpecialRequests(e.target.value)}
            placeholder="e.g., High floor, early check-in, celebration, etc."
            className="input-field resize-none"
            rows="4"
            maxLength="500"
          />
          <p className="text-xs text-gray-500 mt-1">
            {specialRequests.length}/500 characters
          </p>
        </div>
      </div>

      {/* Terms & Conditions */}
      <div className="card p-4 bg-yellow-50 border border-yellow-200">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Important Information</p>
            <ul className="space-y-1 text-xs">
              <li>• Check-in and check-out times are set by the hotel</li>
              <li>• Cancellation policy applies as per hotel terms</li>
              <li>• A confirmation email will be sent to your registered email</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full btn-primary py-3 font-semibold text-lg"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Processing...
          </span>
        ) : (
          'Confirm Booking'
        )}
      </button>
    </form>
  )
}
