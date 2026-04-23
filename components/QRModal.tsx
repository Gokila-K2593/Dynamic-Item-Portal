'use client'
import { QRCodeCanvas } from 'qrcode.react'
import { useRef } from 'react'

const BASE = process.env.NEXT_PUBLIC_SITE_URL || ''

export default function QRModal({ item, onClose }: any) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const url = `${BASE}/view/${item.customId}`

    function downloadQR() {
        const canvas = document.getElementById('qr-canvas') as HTMLCanvasElement
        const link = document.createElement('a')
        link.download = `qr-${item.customId}.png`
        link.href = canvas.toDataURL('image/png')
        link.click()
    }
    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={onClose}>
            <div className="bg-white rounded-xl p-8 text-center shadow-lg"
                onClick={e => e.stopPropagation()}>
                <p className="text-sm font-medium mb-4">{item.name}</p>
                <QRCodeCanvas id="qr-canvas" value={url} size={200} />
                <p className="text-xs text-gray-400 mt-3 mb-6 font-mono tracking-tight">{item.customId}</p>
                <div className="flex gap-2 justify-center">
                    <button 
                        onClick={downloadQR}
                        title="Download QR"
                        className="flex items-center justify-center w-12 h-12 bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-all shadow-sm active:scale-95"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                        </svg>
                    </button>
                    <button 
                        onClick={() => {
                            navigator.clipboard.writeText(url)
                            alert('Link copied to clipboard!')
                        }}
                        title="Copy Link"
                        className="flex items-center justify-center w-12 h-12 bg-gray-50 text-gray-900 rounded-lg hover:bg-gray-200 transition-all shadow-sm active:scale-95 border border-gray-200"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                        </svg>
                    </button>
                    <button 
                        onClick={onClose}
                        className="ml-2 border border-gray-100 text-gray-400 px-5 h-12 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    )
}