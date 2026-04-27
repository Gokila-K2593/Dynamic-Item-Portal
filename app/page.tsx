'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Html5Qrcode } from 'html5-qrcode'
import { Search, QrCode, X, AlertCircle, Loader2 } from 'lucide-react'

export default function ScanPage() {
  const router = useRouter()
  const [searchId, setSearchId] = useState('')
  const [error, setError] = useState('')
  const [isScanning, setIsScanning] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    setError('')

    if (!searchId.trim()) {
      setError('Please enter an ID')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`/api/items/search?id=${encodeURIComponent(searchId)}`)
      const data = await res.json()

      if (data.found) {
        router.push(`/view/${data.customId}`)
      } else {
        setError(data.message || 'No item found with this ID')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const startScanner = async () => {
    setIsScanning(true)
    setError('')
    
    setTimeout(async () => {
      try {
        const html5QrCode = new Html5Qrcode("reader")
        scannerRef.current = html5QrCode
        
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        // Try to get explicit list of cameras
        const cameras = await Html5Qrcode.getCameras();
        
        if (cameras && cameras.length > 0) {
          // Use back camera if possible, otherwise use the first one
          const backCamera = cameras.find(c => c.label.toLowerCase().includes('back') || c.label.toLowerCase().includes('environment'));
          const cameraId = backCamera ? backCamera.id : cameras[0].id;
          await html5QrCode.start(cameraId, config, onScanSuccess, () => {});
        } else {
          // Fallback for devices that don't support listing
          await html5QrCode.start({ facingMode: "environment" }, config, onScanSuccess, () => {});
        }
      } catch (err: any) {
        console.error("Camera Error:", err);
        const errorMessage = err?.toString() || "";
        
        if (errorMessage.includes("NotAllowedError") || errorMessage.includes("Permission denied")) {
          setError("Camera access denied. Please click the lock icon in your address bar and Allow camera.");
        } else {
          setError("No camera detected. Please ensure your webcam is plugged in and enabled in Windows settings.");
        }
        setIsScanning(false);
      }
    }, 300);
  };

  const onScanSuccess = (decodedText: string) => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch(() => {});
    }
    setIsScanning(false);
    if (decodedText.startsWith('http')) {
      window.location.href = decodedText;
    } else {
      router.push(`/view/${decodedText}`);
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop()
      } catch (e) {
        console.error(e)
      }
      scannerRef.current = null
    }
    setIsScanning(false)
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(#1e40af 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      <div className="w-full max-w-md z-10">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-inner">
              <QrCode size={24} />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#1e3a8a] tracking-tight mb-1">SCAN PRODUCT</h1>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-blue-900/10 border border-slate-100 p-8 animate-in fade-in zoom-in-95 duration-500 delay-100">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="searchId" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                Enter User ID
              </label>
              <div className="relative group">
                <input
                  id="searchId"
                  type="text"
                  placeholder="e.g. ID-8829-001"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  className="w-full h-14 pl-5 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-700 font-medium"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Search size={20} />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-[#0047ab] hover:bg-[#003d96] text-white font-bold rounded-2xl shadow-lg shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={20} className="animate-spin" /> : 'Search'}
            </button>

            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-sm font-medium">— or —</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {!isScanning ? (
              <button
                type="button"
                onClick={startScanner}
                className="w-full h-14 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 group"
              >
                <QrCode size={20} className="group-hover:rotate-12 transition-transform" />
                Scan QR Code
              </button>
            ) : (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="relative overflow-hidden rounded-2xl border-2 border-blue-100 bg-slate-900 aspect-square shadow-inner">
                  <div id="reader" className="w-full h-full"></div>
                  <button
                    type="button"
                    onClick={stopScanner}
                    className="absolute top-3 right-3 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors z-20"
                  >
                    <X size={20} />
                  </button>
                  <div className="absolute inset-0 border-[40px] border-black/30 pointer-events-none z-10"></div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-400 rounded-lg pointer-events-none z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                    {/* Scanning line animation */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-blue-400/50 blur-[1px] animate-scan"></div>
                  </div>
                </div>
                <p className="text-center text-sm text-slate-500 font-medium">
                  Align QR code within the frame
                </p>
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>

        <div className="mt-12 text-center animate-in fade-in duration-1000 delay-300">
          <p className="text-slate-400 text-sm">
            Admin access? <button onClick={() => router.push('/login')} className="text-blue-600 font-semibold hover:underline">Log in here</button>
          </p>
        </div>
      </div>
    </main>
  )
}
