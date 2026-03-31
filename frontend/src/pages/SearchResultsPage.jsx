import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Search, SlidersHorizontal, MapPin, Calendar } from 'lucide-react'
import api from '../api/axios'
import HotelCard from '../components/hotels/HotelCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

const today = new Date().toISOString().split('T')[0]

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()

  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalElements, setTotalElements] = useState(0)
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [starFilter, setStarFilter] = useState(0)

  const location = searchParams.get('location') || ''
  const checkIn = searchParams.get('checkIn') || ''
  const checkOut = searchParams.get('checkOut') || ''

  const [searchForm, setSearchForm] = useState({ location, checkIn, checkOut })

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      try {
        const params = { page, size: 9 }
        if (location) params.location = location
        if (checkIn) params.checkIn = checkIn
        if (checkOut) params.checkOut = checkOut

        const endpoint = location || checkIn ? '/hotels/search' : '/hotels'
        const res = await api.get(endpoint, { params })
        const data = res.data.data
        setHotels(data.content || [])
        setTotalElements(data.totalElements || 0)
        setTotalPages(data.totalPages || 0)
      } catch {
        setHotels([])
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [location, checkIn, checkOut, page])

  const handleSearch = (e) => {
    e.preventDefault()
    setPage(0)
    const params = {}
    if (searchForm.location) params.location = searchForm.location
    if (searchForm.checkIn) params.checkIn = searchForm.checkIn
    if (searchForm.checkOut) params.checkOut = searchForm.checkOut
    setSearchParams(params)
  }

  const filteredHotels = starFilter > 0
    ? hotels.filter(h => h.starRating >= starFilter)
    : hotels

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Search bar */}
      <div className="bg-primary-600 py-6 px-4">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSearch} className="bg-white rounded-xl p-3 flex flex-col md:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-3">
              <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                value={searchForm.location}
                onChange={(e) => setSearchForm({ ...searchForm, location: e.target.value })}
                className="w-full text-sm focus:outline-none"
                placeholder="Destination"
              />
            </div>
            <div className="flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-3 md:pb-0 md:pr-3">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="date" value={searchForm.checkIn} min={today}
                onChange={(e) => setSearchForm({ ...searchForm, checkIn: e.target.value })}
                className="text-sm focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2 md:pr-3">
              <Calendar className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <input
                type="date" value={searchForm.checkOut} min={searchForm.checkIn || today}
                onChange={(e) => setSearchForm({ ...searchForm, checkOut: e.target.value })}
                className="text-sm focus:outline-none"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-2 flex items-center gap-2 text-sm whitespace-nowrap">
              <Search className="h-4 w-4" /> Search
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar filter */}
          <aside className="lg:w-60 flex-shrink-0">
            <div className="card p-5">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary-600" />
                <span className="font-semibold text-gray-800">Filters</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Minimum Star Rating</p>
                <div className="space-y-2">
                  {[0, 3, 4, 5].map((star) => (
                    <label key={star} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="star"
                        checked={starFilter === star}
                        onChange={() => setStarFilter(star)}
                        className="text-primary-600"
                      />
                      <span className="text-sm text-gray-700">
                        {star === 0 ? 'All' : `${star}+ Stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-gray-700 text-sm">
                {loading ? 'Searching...' : (
                  <>
                    <span className="font-semibold text-gray-900">{totalElements}</span> hotels found
                    {location && <> in <span className="font-semibold text-gray-900">{location}</span></>}
                  </>
                )}
              </p>
            </div>

            {loading ? (
              <LoadingSpinner />
            ) : filteredHotels.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🏨</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No hotels found</h3>
                <p className="text-gray-500 mb-6">Try a different location or adjust your filters</p>
                <button onClick={() => { setStarFilter(0); setSearchParams({}) }}
                  className="btn-primary px-6">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredHotels.map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} checkIn={checkIn} checkOut={checkOut} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-8">
                    <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button key={i} onClick={() => setPage(i)}
                        className={`px-4 py-2 rounded-lg text-sm ${page === i ? 'bg-primary-600 text-white' : 'border border-gray-300 hover:bg-gray-50'}`}>
                        {i + 1}
                      </button>
                    ))}
                    <button disabled={page === totalPages - 1} onClick={() => setPage(p => p + 1)}
                      className="px-4 py-2 rounded-lg border border-gray-300 text-sm disabled:opacity-40 hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
