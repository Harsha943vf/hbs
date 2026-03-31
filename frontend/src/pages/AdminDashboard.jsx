import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Building2, BedDouble, Users, BookOpen, DollarSign, TrendingUp, XCircle, CheckCircle, Plus, ExternalLink } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../api/axios'
import StatsCard from '../components/admin/StatsCard'
import LoadingSpinner from '../components/common/LoadingSpinner'

const statusBadge = (status) => {
  const map = {
    CONFIRMED: 'badge-confirmed', CANCELLED: 'badge-cancelled',
    COMPLETED: 'badge-completed', PENDING: 'badge-pending',
  }
  return <span className={map[status] || 'badge-pending'}>{status}</span>
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(res => setStats(res.data.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="pt-16"><LoadingSpinner fullPage /></div>

  const chartData = stats?.bookingsByMonth
    ? Object.entries(stats.bookingsByMonth).map(([month, count]) => ({ month: month.slice(5), bookings: count }))
    : []

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 mt-1">Overview of your hotel platform</p>
          </div>
          <Link to="/admin/hotels" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Hotel
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <StatsCard label="Hotels" value={stats?.totalHotels || 0} icon={Building2} color="primary" />
          <StatsCard label="Rooms" value={stats?.totalRooms || 0} icon={BedDouble} color="blue" />
          <StatsCard label="Users" value={stats?.totalUsers || 0} icon={Users} color="purple" />
          <StatsCard label="Bookings" value={stats?.totalBookings || 0} icon={BookOpen} color="gold" />
          <StatsCard label="Confirmed" value={stats?.confirmedBookings || 0} icon={CheckCircle} color="green" />
          <StatsCard label="Cancelled" value={stats?.cancelledBookings || 0} icon={XCircle} color="red" />
        </div>

        {/* Revenue */}
        <div className="card p-6 mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-3xl font-bold text-primary-600">
              ₹{stats?.totalRevenue?.toLocaleString('en-IN') || '0'}
            </p>
          </div>
          <div className="bg-gold-50 p-4 rounded-xl">
            <TrendingUp className="h-8 w-8 text-gold-500" />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Bookings chart */}
          <div className="card p-6 lg:col-span-2">
            <h2 className="font-semibold text-gray-900 mb-4">Bookings by Month</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => [value, 'Bookings']} />
                  <Bar dataKey="bookings" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">No booking data yet</div>
            )}
          </div>

          {/* Top hotels */}
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Top Hotels</h2>
            {stats?.topHotels?.length > 0 ? (
              <div className="space-y-3">
                {stats.topHotels.map((h, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{h.hotelName}</p>
                      <p className="text-xs text-gray-500">{h.bookingCount} bookings · ₹{h.revenue?.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-sm text-center py-8">No data yet</div>
            )}
          </div>
        </div>

        {/* Recent bookings */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Recent Bookings</h2>
            <Link to="/admin/bookings" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View all <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
          {stats?.recentBookings?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b border-gray-100">
                    <th className="pb-3 font-medium">Reference</th>
                    <th className="pb-3 font-medium">Guest</th>
                    <th className="pb-3 font-medium">Hotel</th>
                    <th className="pb-3 font-medium">Dates</th>
                    <th className="pb-3 font-medium">Amount</th>
                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {stats.recentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="py-3 font-mono text-xs font-semibold text-primary-600">{b.bookingReference}</td>
                      <td className="py-3">{b.userName}</td>
                      <td className="py-3 max-w-32 truncate">{b.hotelName}</td>
                      <td className="py-3 text-gray-500">{b.checkInDate} → {b.checkOutDate}</td>
                      <td className="py-3 font-semibold">₹{b.totalAmount?.toLocaleString('en-IN')}</td>
                      <td className="py-3">{statusBadge(b.status)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">No bookings yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
