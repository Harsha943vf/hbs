import { Link } from 'react-router-dom'
import { Hotel, Mail, Phone, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Hotel className="h-6 w-6 text-gold-400" />
              <span className="text-xl font-bold">LuxeStay</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed mb-4">
              Your trusted partner for luxury hotel bookings across India. Experience world-class hospitality at the best prices.
            </p>
            <div className="space-y-2 text-sm text-white/70">
              <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-gold-400" /> support@luxestay.com</div>
              <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-gold-400" /> +91-1800-LUXE-STAY</div>
              <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold-400" /> Mumbai, India</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gold-400 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/hotels" className="hover:text-white transition-colors">Browse Hotels</Link></li>
              <li><Link to="/bookings" className="hover:text-white transition-colors">My Bookings</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gold-400 mb-4">Popular Destinations</h4>
            <ul className="space-y-2 text-sm text-white/70">
              {['Mumbai', 'Delhi', 'Goa', 'Jaipur', 'Udaipur', 'Hyderabad'].map((city) => (
                <li key={city}>
                  <Link to={`/hotels?location=${city}`} className="hover:text-white transition-colors">{city}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-500 mt-8 pt-8 text-center text-sm text-white/50">
          © {new Date().getFullYear()} LuxeStay. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
