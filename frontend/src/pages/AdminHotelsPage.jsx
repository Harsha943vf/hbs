import { useState, useEffect } from 'react'
import {
  Plus, Pencil, Trash2, BedDouble, ChevronDown, ChevronUp,
  Building2, MapPin, Star, X, Save, Loader2, ImageIcon, AlertTriangle
} from 'lucide-react'
import api from '../api/axios'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'

const ROOM_TYPES = ['STANDARD', 'DELUXE', 'SUITE', 'PRESIDENTIAL']
const ROOM_TYPE_LABELS = {
  STANDARD: 'Standard',
  DELUXE: 'Deluxe',
  SUITE: 'Suite',
  PRESIDENTIAL: 'Presidential Suite',
}
const AMENITY_OPTIONS = ['Free WiFi', 'Swimming Pool', 'Gym', 'Restaurant', 'Parking', 'Spa', 'Room Service', 'Bar', 'Laundry', 'Airport Shuttle']

const defaultHotelForm = {
  name: '', description: '', location: '', address: '',
  starRating: 3, imageUrl: '', phoneNumber: '', email: '',
  checkInTime: '14:00', checkOutTime: '12:00', amenities: []
}

const defaultRoomForm = {
  roomNumber: '', roomType: 'SINGLE', pricePerNight: '',
  maxOccupancy: 1, description: '', imageUrl: '', isAvailable: true, amenities: []
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

function AmenitiesSelect({ selected, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((a) => (
        <label key={a} className="flex items-center gap-1.5 cursor-pointer">
          <input
            type="checkbox"
            checked={selected.includes(a)}
            onChange={(e) => {
              if (e.target.checked) onChange([...selected, a])
              else onChange(selected.filter((x) => x !== a))
            }}
            className="rounded text-primary-600"
          />
          <span className="text-sm text-gray-700">{a}</span>
        </label>
      ))}
    </div>
  )
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedHotel, setExpandedHotel] = useState(null)

  // Hotel modal state
  const [hotelModal, setHotelModal] = useState(false)
  const [hotelForm, setHotelForm] = useState(defaultHotelForm)
  const [editingHotel, setEditingHotel] = useState(null)
  const [savingHotel, setSavingHotel] = useState(false)

  // Room modal state
  const [roomModal, setRoomModal] = useState(false)
  const [roomForm, setRoomForm] = useState(defaultRoomForm)
  const [editingRoom, setEditingRoom] = useState(null)
  const [targetHotelId, setTargetHotelId] = useState(null)
  const [savingRoom, setSavingRoom] = useState(false)

  // Delete confirm
  const [deleteConfirm, setDeleteConfirm] = useState(null) // { type: 'hotel'|'room', id, name }
  const [deleting, setDeleting] = useState(false)

  const fetchHotels = async () => {
    try {
      const res = await api.get('/hotels?page=0&size=100')
      setHotels(res.data.data?.content || [])
    } catch {
      toast.error('Failed to load hotels')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHotels() }, [])

  // Hotel CRUD
  const openAddHotel = () => {
    setEditingHotel(null)
    setHotelForm(defaultHotelForm)
    setHotelModal(true)
  }

  const openEditHotel = (hotel) => {
    setEditingHotel(hotel)
    setHotelForm({
      name: hotel.name || '',
      description: hotel.description || '',
      location: hotel.location || '',
      address: hotel.address || '',
      starRating: hotel.starRating || 3,
      imageUrl: hotel.imageUrl || '',
      phoneNumber: hotel.phoneNumber || '',
      email: hotel.email || '',
      checkInTime: hotel.checkInTime || '14:00',
      checkOutTime: hotel.checkOutTime || '12:00',
      amenities: hotel.amenities ? Array.from(hotel.amenities) : [],
    })
    setHotelModal(true)
  }

  const handleSaveHotel = async () => {
    if (!hotelForm.name.trim() || !hotelForm.location.trim() || !hotelForm.address.trim()) {
      toast.error('Name, location and address are required')
      return
    }
    setSavingHotel(true)
    try {
      const payload = { ...hotelForm, amenities: hotelForm.amenities }
      if (editingHotel) {
        await api.put(`/hotels/${editingHotel.id}`, payload)
        toast.success('Hotel updated successfully')
      } else {
        await api.post('/hotels', payload)
        toast.success('Hotel created successfully')
      }
      setHotelModal(false)
      fetchHotels()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save hotel')
    } finally {
      setSavingHotel(false)
    }
  }

  const handleDeleteHotel = async () => {
    setDeleting(true)
    try {
      await api.delete(`/hotels/${deleteConfirm.id}`)
      toast.success('Hotel deleted')
      setDeleteConfirm(null)
      fetchHotels()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete hotel')
    } finally {
      setDeleting(false)
    }
  }

  // Room CRUD
  const openAddRoom = (hotelId) => {
    setEditingRoom(null)
    setTargetHotelId(hotelId)
    setRoomForm(defaultRoomForm)
    setRoomModal(true)
  }

  const openEditRoom = (room, hotelId) => {
    setEditingRoom(room)
    setTargetHotelId(hotelId)
    setRoomForm({
      roomNumber: room.roomNumber || '',
      roomType: room.roomType || 'SINGLE',
      pricePerNight: room.pricePerNight?.toString() || '',
      maxOccupancy: room.maxOccupancy || 1,
      description: room.description || '',
      imageUrl: room.imageUrl || '',
      isAvailable: room.available !== undefined ? room.available : true,
      amenities: room.amenities ? Array.from(room.amenities) : [],
    })
    setRoomModal(true)
  }

  const handleSaveRoom = async () => {
    if (!roomForm.roomNumber.trim() || !roomForm.pricePerNight) {
      toast.error('Room number and price are required')
      return
    }
    setSavingRoom(true)
    try {
      const payload = {
        ...roomForm,
        pricePerNight: parseFloat(roomForm.pricePerNight),
        maxOccupancy: parseInt(roomForm.maxOccupancy),
      }
      if (editingRoom) {
        await api.put(`/hotels/rooms/${editingRoom.id}`, payload)
        toast.success('Room updated successfully')
      } else {
        await api.post(`/hotels/${targetHotelId}/rooms`, payload)
        toast.success('Room added successfully')
      }
      setRoomModal(false)
      fetchHotels()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save room')
    } finally {
      setSavingRoom(false)
    }
  }

  const handleDeleteRoom = async () => {
    setDeleting(true)
    try {
      await api.delete(`/hotels/rooms/${deleteConfirm.id}`)
      toast.success('Room deleted')
      setDeleteConfirm(null)
      fetchHotels()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete room')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <div className="pt-16"><LoadingSpinner fullPage /></div>

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Hotels</h1>
            <p className="text-gray-500 mt-1">{hotels.length} hotel{hotels.length !== 1 ? 's' : ''} listed</p>
          </div>
          <button onClick={openAddHotel} className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Hotel
          </button>
        </div>

        {/* Hotels list */}
        {hotels.length === 0 ? (
          <div className="card p-16 text-center">
            <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hotels yet</h3>
            <p className="text-gray-400 mb-6">Start by adding your first hotel</p>
            <button onClick={openAddHotel} className="btn-primary px-8 inline-flex items-center gap-2">
              <Plus className="h-4 w-4" /> Add Hotel
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div key={hotel.id} className="card overflow-hidden">
                {/* Hotel row */}
                <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="h-16 w-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={hotel.imageUrl || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200'}
                      alt={hotel.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200' }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                      <span className="flex items-center gap-0.5 text-xs text-amber-500 font-medium">
                        {hotel.starRating}
                        <Star className="h-3 w-3 fill-current" />
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="h-3.5 w-3.5" /> {hotel.location}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {hotel.totalRooms || 0} rooms
                      {hotel.startingPrice && ` · From ₹${hotel.startingPrice.toLocaleString('en-IN')}/night`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => openAddRoom(hotel.id)}
                      className="flex items-center gap-1.5 text-sm text-primary-600 border border-primary-200 hover:border-primary-400 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Room
                    </button>
                    <button
                      onClick={() => openEditHotel(hotel)}
                      className="p-2 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'hotel', id: hotel.id, name: hotel.name })}
                      className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setExpandedHotel(expandedHotel === hotel.id ? null : hotel.id)}
                      className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {expandedHotel === hotel.id
                        ? <ChevronUp className="h-4 w-4" />
                        : <ChevronDown className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {/* Rooms panel */}
                {expandedHotel === hotel.id && (
                  <div className="border-t border-gray-100 bg-gray-50 p-5">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-gray-800 flex items-center gap-2">
                        <BedDouble className="h-4 w-4 text-primary-600" /> Rooms
                      </h4>
                      <button
                        onClick={() => openAddRoom(hotel.id)}
                        className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700"
                      >
                        <Plus className="h-3.5 w-3.5" /> Add Room
                      </button>
                    </div>

                    {!hotel.rooms || hotel.rooms.length === 0 ? (
                      <div className="text-center py-6 text-gray-400 text-sm">
                        No rooms added yet. Click "Add Room" to get started.
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-left text-xs text-gray-500 uppercase tracking-wide border-b border-gray-200">
                              <th className="pb-2 font-medium">Room #</th>
                              <th className="pb-2 font-medium">Type</th>
                              <th className="pb-2 font-medium">Price/Night</th>
                              <th className="pb-2 font-medium">Max Guests</th>
                              <th className="pb-2 font-medium">Status</th>
                              <th className="pb-2 font-medium text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {hotel.rooms.map((room) => (
                              <tr key={room.id} className="hover:bg-white">
                                <td className="py-2.5 font-medium text-gray-900">{room.roomNumber}</td>
                                <td className="py-2.5 text-gray-600">{room.roomTypeDisplay || room.roomType}</td>
                                <td className="py-2.5 font-semibold text-primary-700">
                                  ₹{room.pricePerNight?.toLocaleString('en-IN')}
                                </td>
                                <td className="py-2.5 text-gray-600">{room.maxOccupancy}</td>
                                <td className="py-2.5">
                                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${room.available
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'}`}>
                                    {room.available ? 'Available' : 'Unavailable'}
                                  </span>
                                </td>
                                <td className="py-2.5 text-right">
                                  <div className="flex items-center justify-end gap-1">
                                    <button
                                      onClick={() => openEditRoom(room, hotel.id)}
                                      className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded transition-colors"
                                    >
                                      <Pencil className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                      onClick={() => setDeleteConfirm({ type: 'room', id: room.id, name: `Room ${room.roomNumber}` })}
                                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                      <Trash2 className="h-3.5 w-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hotel Modal */}
      {hotelModal && (
        <Modal title={editingHotel ? 'Edit Hotel' : 'Add New Hotel'} onClose={() => setHotelModal(false)}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Hotel Name *</label>
                <input
                  value={hotelForm.name}
                  onChange={(e) => setHotelForm({ ...hotelForm, name: e.target.value })}
                  className="input-field"
                  placeholder="e.g. The Taj Mahal Palace"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                <input
                  value={hotelForm.location}
                  onChange={(e) => setHotelForm({ ...hotelForm, location: e.target.value })}
                  className="input-field"
                  placeholder="e.g. Mumbai"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Star Rating *</label>
                <select
                  value={hotelForm.starRating}
                  onChange={(e) => setHotelForm({ ...hotelForm, starRating: parseInt(e.target.value) })}
                  className="input-field"
                >
                  {[1, 2, 3, 4, 5].map((s) => (
                    <option key={s} value={s}>{s} Star{s > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                <input
                  value={hotelForm.address}
                  onChange={(e) => setHotelForm({ ...hotelForm, address: e.target.value })}
                  className="input-field"
                  placeholder="Full address"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={hotelForm.description}
                  onChange={(e) => setHotelForm({ ...hotelForm, description: e.target.value })}
                  className="input-field resize-none"
                  rows={3}
                  placeholder="Describe the hotel..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Image URL
                </label>
                <input
                  value={hotelForm.imageUrl}
                  onChange={(e) => setHotelForm({ ...hotelForm, imageUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  value={hotelForm.phoneNumber}
                  onChange={(e) => setHotelForm({ ...hotelForm, phoneNumber: e.target.value })}
                  className="input-field"
                  placeholder="+91 ..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={hotelForm.email}
                  onChange={(e) => setHotelForm({ ...hotelForm, email: e.target.value })}
                  className="input-field"
                  placeholder="info@hotel.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Time</label>
                <input
                  type="time"
                  value={hotelForm.checkInTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkInTime: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Time</label>
                <input
                  type="time"
                  value={hotelForm.checkOutTime}
                  onChange={(e) => setHotelForm({ ...hotelForm, checkOutTime: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
                <AmenitiesSelect
                  selected={hotelForm.amenities}
                  onChange={(a) => setHotelForm({ ...hotelForm, amenities: a })}
                  options={AMENITY_OPTIONS}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setHotelModal(false)} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSaveHotel}
              disabled={savingHotel}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {savingHotel
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                : <><Save className="h-4 w-4" /> {editingHotel ? 'Update Hotel' : 'Create Hotel'}</>
              }
            </button>
          </div>
        </Modal>
      )}

      {/* Room Modal */}
      {roomModal && (
        <Modal title={editingRoom ? 'Edit Room' : 'Add New Room'} onClose={() => setRoomModal(false)}>
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Number *</label>
                <input
                  value={roomForm.roomNumber}
                  onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 101"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Room Type *</label>
                <select
                  value={roomForm.roomType}
                  onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                  className="input-field"
                >
                  {ROOM_TYPES.map((t) => (
                    <option key={t} value={t}>{ROOM_TYPE_LABELS[t]}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Per Night (₹) *</label>
                <input
                  type="number"
                  min="0"
                  value={roomForm.pricePerNight}
                  onChange={(e) => setRoomForm({ ...roomForm, pricePerNight: e.target.value })}
                  className="input-field"
                  placeholder="e.g. 5000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Occupancy</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={roomForm.maxOccupancy}
                  onChange={(e) => setRoomForm({ ...roomForm, maxOccupancy: parseInt(e.target.value) })}
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  className="input-field resize-none"
                  rows={2}
                  placeholder="Room description..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <ImageIcon className="h-3.5 w-3.5" /> Image URL
                </label>
                <input
                  value={roomForm.imageUrl}
                  onChange={(e) => setRoomForm({ ...roomForm, imageUrl: e.target.value })}
                  className="input-field"
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                <select
                  value={roomForm.isAvailable ? 'true' : 'false'}
                  onChange={(e) => setRoomForm({ ...roomForm, isAvailable: e.target.value === 'true' })}
                  className="input-field"
                >
                  <option value="true">Available</option>
                  <option value="false">Unavailable</option>
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Amenities</label>
                <AmenitiesSelect
                  selected={roomForm.amenities}
                  onChange={(a) => setRoomForm({ ...roomForm, amenities: a })}
                  options={['Free WiFi', 'Air Conditioning', 'Mini Bar', 'TV', 'Safe', 'Balcony', 'Bathtub', 'Ocean View']}
                />
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
            <button onClick={() => setRoomModal(false)} className="flex-1 btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleSaveRoom}
              disabled={savingRoom}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              {savingRoom
                ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                : <><Save className="h-4 w-4" /> {editingRoom ? 'Update Room' : 'Add Room'}</>
              }
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-100 p-3 rounded-xl">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="font-semibold text-gray-900 text-lg">
                Delete {deleteConfirm.type === 'hotel' ? 'Hotel' : 'Room'}?
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.
              {deleteConfirm.type === 'hotel' && ' All associated rooms will also be deleted.'}
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary">
                Cancel
              </button>
              <button
                onClick={deleteConfirm.type === 'hotel' ? handleDeleteHotel : handleDeleteRoom}
                disabled={deleting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Deleting...</>
                  : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
