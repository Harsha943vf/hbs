export default function LoadingSpinner({ size = 'md', fullPage = false }) {
  const sizes = { sm: 'h-5 w-5', md: 'h-10 w-10', lg: 'h-16 w-16' }

  const spinner = (
    <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-primary-600 ${sizes[size]}`} />
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {spinner}
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      {spinner}
    </div>
  )
}
