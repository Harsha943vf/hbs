import { AlertTriangle, XCircle } from 'lucide-react'

export default function CancelBookingModal({ booking, onConfirm, onCancel, isLoading }) {
  if (!booking) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6 sm:p-8">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">Cancel Booking?</h2>
        <p className="text-gray-600 text-center mb-6">
          You are about to cancel your booking for <strong>{booking.hotelName}</strong>
        </p>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Important</p>
              <p className="text-xs">Please review your cancellation policy. Refund availability depends on hotel terms and booking date.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500 text-xs">BOOKING REFERENCE</p>
              <p className="font-mono font-semibold text-gray-900 mt-1">{booking.bookingReference}</p>
            </div>
            <div>
              <p className="text-gray-500 text-xs">STATUS</p>
              <p className="font-semibold text-gray-900 mt-1">{booking.status}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 btn-secondary py-2.5"
          >
            Keep Booking
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Cancelling...
              </>
            ) : (
              <>
                <XCircle className="h-4 w-4" />
                Cancel Booking
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
