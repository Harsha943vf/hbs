export default function StatsCard({ label, value, icon: Icon, color = 'primary', trend }) {
  const colors = {
    primary: 'bg-primary-50 text-primary-600',
    gold: 'bg-amber-50 text-amber-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    blue: 'bg-blue-50 text-blue-600',
    purple: 'bg-purple-50 text-purple-600',
  }
  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colors[color]}`}>
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        {trend !== undefined && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {trend >= 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  )
}
