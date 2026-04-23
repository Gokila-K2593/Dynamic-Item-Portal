'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authHeaders, clearAuth, getEmail, isLoggedIn } from '@/lib/clientAuth'
import QRModal from '@/components/QRModal'

export default function DashboardPage() {
    const router = useRouter()
    const [items, setItems] = useState<any[]>([])
    const [qrItem, setQrItem] = useState<any>(null)
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!isLoggedIn()) { router.push('/login'); return }
        setUserEmail(getEmail())
        fetchItems()
    }, [])

    async function fetchItems() {
        const res = await fetch('/api/items', { headers: authHeaders() })
        if (res.status === 401) { router.push('/login'); return }
        const data = await res.json()
        setItems(data.items || [])
    }

    async function handleDelete(id: string, name: string) {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return
        const res = await fetch(`/api/items/${id}`, {
            method: 'DELETE',
            headers: authHeaders()
        })
        if (res.ok) fetchItems()
    }

    function handleLogout() {
        clearAuth()
        router.push('/login')
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex">

            {/* Left sidebar */}
            <aside className="w-48 bg-white border-r border-gray-200 flex flex-col py-6 px-4 shrink-0">
                <div className="flex items-center gap-3 mb-10 px-1">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-sm">
                        <img src="/logo.png" alt="Logo" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-xs font-bold tracking-wider text-gray-800 uppercase">DIT Portal</span>
                </div>
                <nav className="flex-1">
                    <button className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 text-xs font-semibold text-gray-800 tracking-wider uppercase">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                        Dashboard
                    </button>
                </nav>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-gray-400 hover:text-gray-700 tracking-wider uppercase font-semibold"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                    Log out
                </button>
            </aside>

            {/* Main content */}
            <main className="flex-1 flex flex-col">

                {/* Top bar */}
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-gray-800 uppercase">Dynamic Item Portal</p>
                        <p className="text-xs text-gray-400 tracking-wider uppercase mt-0.5">Admin View</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        {mounted ? (userEmail || 'admin@portal.com') : 'admin@portal.com'}
                    </div>
                </div>

                {/* Page content */}
                <div className="px-8 py-8">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">All Items</h1>
                            <p className="text-sm text-gray-400 mt-1">Manage all created items from your secure vault.</p>
                        </div>
                        <button
                            onClick={() => router.push('/admin/items/new')}
                            className="flex items-center gap-2 bg-gray-900 text-white text-xs font-semibold tracking-wider uppercase px-5 py-3 rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            + Create New Item
                        </button>
                    </div>

                    {/* Overview stat */}
                    <div className="mb-6">
                        <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-1">Overview</p>
                        <p className="text-base font-bold text-gray-800">
                            Total Items: <span>{items.length}</span>
                        </p>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                        {items.length === 0 ? (
                            <div className="text-center py-20 text-gray-300 text-sm">
                                No items yet. Create your first item above.
                            </div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-100">
                                        <th className="text-left text-xs font-semibold tracking-widest text-gray-400 uppercase px-6 py-4">Item Name</th>
                                        <th className="text-left text-xs font-semibold tracking-widest text-gray-400 uppercase px-6 py-4">Custom ID</th>
                                        <th className="text-left text-xs font-semibold tracking-widest text-gray-400 uppercase px-6 py-4">Created Date</th>
                                        <th className="text-right text-xs font-semibold tracking-widest text-gray-400 uppercase px-6 py-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {items.map((item: any) => (
                                        <tr key={item.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                                                    </div>
                                                    <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-mono bg-blue-50 text-blue-700 px-2.5 py-1 rounded font-semibold tracking-wider">
                                                    {item.customId}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {new Date(item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end items-center gap-3">
                                                    {/* Edit icon */}
                                                    <button 
                                                        onClick={() => router.push(`/admin/items/edit/${item.id}`)}
                                                        className="text-gray-300 hover:text-gray-600 transition-colors" title="Edit Item"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                                                    </button>
                                                    {/* QR icon */}
                                                    <button
                                                        onClick={() => setQrItem(item)}
                                                        className="text-gray-300 hover:text-gray-600 transition-colors" title="View QR Code"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="3" height="3" /></svg>
                                                    </button>
                                                    {/* Delete icon */}
                                                    <button 
                                                        onClick={() => handleDelete(item.id, item.name)}
                                                        className="text-gray-300 hover:text-red-400 transition-colors" title="Delete Item"
                                                    >
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </main>

            {qrItem && <QRModal item={qrItem} onClose={() => setQrItem(null)} />}
        </div>
    )
}