'use client'
import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react'
import { authHeaders, getEmail, isLoggedIn } from '@/lib/clientAuth'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || ''

type Field = { label: string; value: string }
type Section = { heading: string; fields: Field[] }

export default function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params)
    const router = useRouter()
    const [name, setName] = useState('')
    const [customId, setCustomId] = useState('')
    const [originalId, setOriginalId] = useState('')
    const [idStatus, setIdStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
    const [sections, setSections] = useState<Section[]>([
        { heading: '', fields: [{ label: '', value: '' }] }
    ])
    const [saving, setSaving] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [userEmail, setUserEmail] = useState<string | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        if (!isLoggedIn()) { router.push('/login'); return }
        setUserEmail(getEmail())

        // Fetch item data
        async function fetchItem() {
            try {
                const res = await fetch(`/api/items/${id}`, { headers: authHeaders() })
                if (!res.ok) { router.push('/admin/dashboard'); return }
                const data = await res.json()
                setName(data.name)
                setCustomId(data.customId)
                setOriginalId(data.customId)
                setSections(data.sections.map((s: any) => ({
                    heading: s.heading,
                    fields: s.fields.map((f: any) => ({ label: f.label, value: f.value }))
                })))
                setIdStatus('available')
            } catch (err) {
                setError('Failed to load item')
            } finally {
                setLoading(false)
            }
        }
        fetchItem()
    }, [id])

    useEffect(() => {
        if (!customId || loading) return
        if (customId === originalId) { setIdStatus('available'); return }
        
        setIdStatus('checking')
        const t = setTimeout(async () => {
            const res = await fetch(`/api/items/check-id?customId=${encodeURIComponent(customId)}`, { headers: authHeaders() })
            const data = await res.json()
            setIdStatus(data.available ? 'available' : 'taken')
        }, 500)
        return () => clearTimeout(t)
    }, [customId, originalId, loading])

    function addSection() {
        setSections([...sections, { heading: '', fields: [{ label: '', value: '' }] }])
    }
    function removeSection(i: number) {
        setSections(sections.filter((_, idx) => idx !== i))
    }
    function addField(si: number) {
        const s = [...sections]
        s[si].fields.push({ label: '', value: '' })
        setSections(s)
    }
    function removeField(si: number, fi: number) {
        const s = [...sections]
        s[si].fields = s[si].fields.filter((_, idx) => idx !== fi)
        setSections(s)
    }
    function updateSection(si: number, val: string) {
        const s = [...sections]; s[si].heading = val; setSections(s)
    }
    function updateField(si: number, fi: number, key: 'label' | 'value', val: string) {
        const s = [...sections]; s[si].fields[fi][key] = val; setSections(s)
    }

    async function handleSave() {
        if (!name || !customId || idStatus !== 'available') return
        setSaving(true); setError('')
        const res = await fetch(`/api/items/${id}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify({ name, customId, sections })
        })
        const data = await res.json()
        if (!res.ok) { setError(data.error); setSaving(false); return }
        router.push('/admin/dashboard')
    }

    function downloadQR() {
        const canvas = document.getElementById('qr-dl-canvas') as HTMLCanvasElement
        if (!canvas) return
        const link = document.createElement('a')
        link.download = `qr-${customId}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }
    function copyQRUrl() {
        if (!customId) return
        navigator.clipboard.writeText(`${BASE}/view/${customId}`)
    }

    if (loading) return <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center font-bold tracking-widest uppercase text-gray-400">Loading Configuration...</div>

    const qrUrl = customId ? `${BASE}/view/${customId}` : ''
    const canSave = !!name && idStatus === 'available' && !saving

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
                    <button
                        onClick={() => router.push('/admin/dashboard')}
                        className="w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-400 tracking-wider uppercase hover:bg-gray-50"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
                        Dashboard
                    </button>
                </nav>
            </aside>

            {/* Main */}
            <main className="flex-1 flex flex-col">
                <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                    <div>
                        <p className="text-xs font-bold tracking-widest text-gray-800 uppercase">Dynamic Item Portal</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                        {mounted ? (userEmail || 'admin@portal.com') : 'admin@portal.com'}
                    </div>
                </div>

                <div className="px-8 py-8 flex gap-8 items-start">
                    {/* Left: form */}
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-900">Edit Item Configuration</h1>
                            <button
                                onClick={() => router.push('/admin/dashboard')}
                                className="text-xs text-gray-400 hover:text-gray-600 tracking-wider"
                            >
                                Discard Changes
                            </button>
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 text-sm mb-6">
                                {error}
                            </div>
                        )}

                        {/* Name + ID row */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Item Name</label>
                                    <input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="e.g. Prototype Omega-7"
                                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-200 bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-2">Custom ID</label>
                                    <input
                                        value={customId}
                                        onChange={e => setCustomId(e.target.value)}
                                        placeholder="ID-4829-X"
                                        className={`w-full border rounded-lg px-3 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 bg-gray-50 ${idStatus === 'taken' ? 'border-red-300 focus:ring-red-100' : idStatus === 'available' ? 'border-green-300 focus:ring-green-100' : 'border-gray-200 focus:ring-gray-200'}`}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sections */}
                        <div className="flex justify-between items-center mb-3">
                            <label className="text-xs font-semibold tracking-widest text-gray-400 uppercase">Sections</label>
                            <button onClick={addSection} className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 tracking-wider">+ Add Section</button>
                        </div>

                        {sections.map((section, si) => (
                            <div key={si} className="bg-white border border-gray-200 rounded-xl p-5 mb-3 shadow-sm">
                                <div className="flex justify-between items-center mb-4">
                                    <input
                                        value={section.heading}
                                        onChange={e => updateSection(si, e.target.value)}
                                        placeholder="Section heading..."
                                        className="text-base font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-0 flex-1 placeholder-gray-300"
                                    />
                                    {sections.length > 1 && (
                                        <button onClick={() => removeSection(si)} className="text-gray-300 hover:text-red-400 transition-colors">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /></svg>
                                        </button>
                                    )}
                                </div>
                                {section.fields.map((field, fi) => (
                                    <div key={fi} className="flex gap-3 items-center mb-2">
                                        <input
                                            value={field.label}
                                            onChange={e => updateField(si, fi, 'label', e.target.value)}
                                            placeholder="Label"
                                            className="w-2/5 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 italic placeholder-gray-300"
                                        />
                                        <input
                                            value={field.value}
                                            onChange={e => updateField(si, fi, 'value', e.target.value)}
                                            placeholder="Value"
                                            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 font-medium placeholder-gray-300"
                                        />
                                        <button onClick={() => removeField(si, fi)} className="text-gray-200 hover:text-red-400 transition-colors shrink-0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addField(si)} className="mt-2 w-full border border-dashed border-gray-200 rounded-lg py-2 text-xs text-gray-400 hover:text-gray-600 hover:border-gray-300 transition-colors tracking-wider">+ Add Field</button>
                            </div>
                        ))}
                    </div>

                    {/* Right: QR panel */}
                    <div className="w-56 shrink-0 sticky top-8">
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-lg">
                            <p className="text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4 text-center">Live Preview</p>
                            <div className="bg-gray-900 rounded-lg p-4 flex items-center justify-center min-h-[160px] mb-4">
                                {qrUrl ? <QRCodeSVG value={qrUrl} size={140} bgColor="#111827" fgColor="#ffffff" /> : null}
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={!canSave}
                                className="w-full flex items-center justify-center gap-2 bg-gray-900 text-white text-xs font-bold tracking-widest uppercase py-4 rounded-lg hover:bg-gray-700 disabled:opacity-30 transition-all mb-4"
                            >
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>
                                {saving ? 'Applying...' : 'Apply Updates'}
                            </button>
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={downloadQR} className="flex items-center justify-center border border-gray-200 text-gray-400 h-12 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                </button>
                                <button onClick={copyQRUrl} className="flex items-center justify-center border border-gray-200 text-gray-400 h-12 rounded-lg hover:bg-gray-50 transition-colors">
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
