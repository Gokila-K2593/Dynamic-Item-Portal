export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <p className="text-4xl mb-4">404</p>
                <p className="text-gray-500">Item not found</p>
                <p className="text-sm text-gray-400 mt-2">This QR code may be invalid or the item was removed.</p>
            </div>
        </div>
    )
}