import { AlertCircle } from 'lucide-react'

export default function ErrorMessage({ message }) {
  if (!message) return null
  return (
    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      <AlertCircle className="h-5 w-5 flex-shrink-0" />
      <p className="text-sm">{message}</p>
    </div>
  )
}
