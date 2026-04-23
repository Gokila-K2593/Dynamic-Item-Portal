'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { saveAuth } from '@/lib/clientAuth'

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleLogin() {
        setError('')
        setLoading(true)
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()
            if (!res.ok) { setError(data.error || 'Invalid credentials'); return }
            saveAuth(data.token, data.user.email)
            router.push('/admin/dashboard')
        } catch {
            setError('Network error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#f0f2f5] flex flex-col">
            {/* Top bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
                <span className="text-xs font-semibold tracking-widest text-gray-800 uppercase">
                    Dynamic Item Portal
                </span>
                <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                        System Online
                    </span>
                </div>
            </div>

            {/* Center card */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl p-10">

                    {/* Shield icon */}
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-100 shadow-md">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                    </div>

                    <h1 className="text-center text-xl font-bold tracking-widest text-gray-900 uppercase mb-1">
                        Administrator Access
                    </h1>
                    <p className="text-center text-xs tracking-widest text-gray-400 uppercase mb-8">
                        Secure Verification Required
                    </p>

                    {/* Error banner */}
                    {error && (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-5 text-xs font-semibold tracking-wider uppercase">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                            {error}
                        </div>
                    )}

                    {/* Email */}
                    <label className="block text-xs font-semibold tracking-widest text-gray-500 uppercase mb-1.5">
                        Administrator Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="admin@portal.system"
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-800 mb-5 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* Password */}
                    <div className="flex justify-between items-center mb-1.5">
                        <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                            Security Token
                        </label>
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="text-xs text-gray-400 hover:text-gray-600 font-semibold tracking-wider uppercase"
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full border border-gray-200 bg-gray-50 rounded-lg px-4 py-3 text-sm text-gray-800 mb-8 focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* Submit */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold tracking-widest uppercase text-xs py-4 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Authorize Login'}
                    </button>
                </div>
            </div>
        </div>
    )
}