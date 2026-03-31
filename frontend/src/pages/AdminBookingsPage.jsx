import { useState, useEffect, useCallback } from 'react'
import {
  Search, Calendar, MapPin, Hash, Users, ChevronLeft,
  ChevronRight, RefreshCw, Filter, X, TrendingUp
} from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const STATUS_OPTIONS = ['ALL', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'PENDING']

const statusBadge = (status) => {
  const map = {
    CONFIRMED: 'badge-confirmed',
    CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed',
    PENDING: 'badge-pending',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [totalElements, setTotalElements] = useState(0)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [searchInput, setSearchInput] = useState('')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/bookings', { params: { page, size: 15 } })
      const data = res.data.data
      // API returns a list for admin
      const list = Array.isArray(data) ? data : data?.content || []
      setBookings(list)
      setTotalElements(data?.totalElements || list.length)
      setTotalPages(data?.totalPages || 1)
    } catch {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => { fetchBookings() }, [fetchBookings])

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(0)
  }

  const clearFilters = () => {
    setSearch('')
    setSearchInput('')
    setStatusFilter('ALL')
    setPage(0)
  }

  // Client-side filter (since backend returns all bookings)
  const filtered = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter
    const matchesSearch = !search || [
      b.bookingReference, b.userName, b.hotelName, b.userEmail
    ].some((f) => f?.toLowerCase().includes(search.toLowerCase()))
    return matchesStatus && matchesSearch
  })

  const totalRevenue = filtered
    .filter((b) => b.status !== 'CANCELLED')
    .reduce((sum, b) => sum + (b.totalAmount || 0), 0)

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">All Bookings</h1>
            <p className="text-gray-500 mt-1">
              {totalElements} total booking{totalElements !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-xl border border-gray-200 px-4 py-2 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary-600" />
              <span className="text-sm text-gray-600">Filtered Revenue:</span>
              <span className="font-bold text-primary-700">₹{totalRevenue.toLocaleString('en-IN')}</span>
            </div>
            <button
              onClick={fetchBookings}
              className="p-2.5 bg-white border border-gray-200 rounded-xl text-gray-500 hover:text-primary-600 hover:border-primary-300 transition-colors"
              title="Refresh"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-6 flex flex-col sm:flex-row gap-3">
          <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="input-field pl-9 pr-4 py-2 text-sm"
                placeholder="Search by reference, guest, hotel..."
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => { setSearchInput(''); setSearch(''); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <button type="submit" className="btn-primary px-4 py-2 text-sm whitespace-nowrap">
              Search
            </button>
          </form>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setStatusFilter(s); setPage(0) }}
                  className={`text-xs font-medium px-3 py-1.5 rounded-full transition-colors ${
                    statusFilter === s
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            {(search || statusFilter !== 'ALL') && (
              <button
                onClick={clearFilters}
                className="text-xs text-primary-600 hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <div className="card p-16 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No bookings found</h3>
            <p className="text-gray-400">
              {search || statusFilter !== 'ALL'
                ? 'Try adjusting your filters'
                : 'No bookings have been made yet'}
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="card overflow-hidden hidden md:block">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100 text-left">
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Reference</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Guest</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Hotel</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Room</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Dates</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Guests</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Amount</th>
                      <th className="px-4 py-3 font-semibold text-xs text-gray-500 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                            {b.bookingReference}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-900">{b.userName}</div>
                          {b.userEmail && (
                            <div className="text-xs text-gray-400">{b.userEmail}</div>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium text-gray-800 max-w-32 truncate">{b.hotelName}</div>
                          <div className="text-xs text-gray-400 flex items-center gap-1">
                            <MapPin className="h-2.5 w-2.5" /> {b.hotelLocation}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div>{b.roomTypeDisplay}</div>
                          <div className="text-xs text-gray-400">Room {b.roomNumber}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar className="h-3 w-3 text-primary-400" />
                            {b.checkInDate}
                          </div>
                          <div className="flex items-center gap-1 text-xs mt-0.5">
                            <Calendar className="h-3 w-3 text-gray-300" />
                            {b.checkOutDate}
                          </div>
                          <div className="text-xs text-gray-400 mt-0.5">{b.numberOfNights} night{b.numberOfNights !== 1 ? 's' : ''}</div>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          <span className="flex items-center gap-1">
                            <Users className="h-3.5 w-3.5 text-gray-400" />
                            {b.numberOfGuests}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="font-bold text-gray-900">
                            ₹{b.totalAmount?.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {statusBadge(b.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="space-y-3 md:hidden">
              {filtered.map((b) => (
                <div key={b.id} className="card p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span className="font-mono text-xs font-semibold text-primary-700 bg-primary-50 px-2 py-0.5 rounded">
                        {b.bookingReference}
                      </span>
                      <div className="font-semibold text-gray-900 mt-1">{b.hotelName}</div>
                    </div>
                    <div className="text-right">
                      {statusBadge(b.status)}
                      <div className="font-bold text-gray-900 mt-1">₹{b.totalAmount?.toLocaleString('en-IN')}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <Hash className="h-3 w-3" /> {b.userName}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {b.numberOfGuests} guest{b.numberOfGuests !== 1 ? 's' : ''}
                    </span>
                    <span className="flex items-center gap-1 col-span-2">
                      <Calendar className="h-3 w-3" /> {b.checkInDate} → {b.checkOutDate} · {b.numberOfNights} nights
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-9 w-9 rounded-lg text-sm font-medium transition-colors ${
                      page === i ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Summary row */}
            <div className="mt-4 text-center text-sm text-gray-500">
              Showing <span className="font-medium text-gray-700">{filtered.length}</span> booking{filtered.length !== 1 ? 's' : ''}
              {(search || statusFilter !== 'ALL') && ' (filtered)'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
