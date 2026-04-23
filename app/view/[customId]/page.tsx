import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

type Props = { params: Promise<{ customId: string }> }

async function getItem(customId: string) {
    const item = await prisma.item.findUnique({
        where: { customId },
        include: {
            sections: {
                include: {
                    fields: {
                        orderBy: { displayOrder: 'asc' }
                    }
                },
                orderBy: { displayOrder: 'asc' }
            }
        }
    })
    return item
}

export async function generateMetadata({ params }: Props) {
    const { customId } = await params
    const item = await getItem(customId)
    return { title: item?.name || 'Item Not Found' }
}

export default async function PublicViewPage({ params }: Props) {
    const { customId } = await params
    const item = await getItem(customId)

    if (!item) return notFound()

    return (
        <div className="min-h-screen bg-[#f1f5f9] pb-24">
            {/* Professional Light Header */}
            <div className="bg-white px-6 pt-12 pb-16 border-b border-slate-200 shadow-[0_1px_3px_0_rgba(0,0,0,0.02),0_1px_2px_0_rgba(0,0,0,0.06)] relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                
                <div className="max-w-md mx-auto text-left">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-slate-100 shadow-sm">
                            <img src="/logo.png" alt="Logo" className="w-full h-full object-contain p-1" />
                        </div>
                        <p className="text-[11px] font-bold tracking-[0.2em] text-slate-500 uppercase">
                            Digital Product Verification
                        </p>
                    </div>
                    
                    <h1 className="text-4xl font-bold tracking-tight text-slate-900 mb-6 font-display">
                        {item.name}
                    </h1>
                    
                    <div className="flex flex-col gap-1.5">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-0.5">CUSTOM ID</p>
                        <div className="inline-flex items-center self-start px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                            <span className="text-sm font-mono font-600 tracking-wider text-slate-700">
                                {item.customId}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4 mt-10 relative z-20">
                {item.sections.map((section: any, i: number) => (
                    <div key={i} className="mb-10">
                        {/* Section Divider */}
                        <div className="flex items-center gap-4 mb-6">
                            <div className="h-[1px] flex-1 bg-gray-200"></div>
                            <h2 className="text-[11px] font-black tracking-[0.25em] text-gray-400 uppercase">
                                {section.heading || 'SECTIONS'}
                            </h2>
                            <div className="h-[1px] flex-1 bg-gray-200"></div>
                        </div>

                        {/* Fields Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {section.fields.map((field: any, j: number) => (
                                <div 
                                    key={j} 
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            {field.label}
                                        </p>
                                        <div className="text-gray-300">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                                <line x1="12" y1="22.08" x2="12" y2="12"></line>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold text-gray-900 break-words leading-tight">
                                        {field.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Footer simple branding */}
                <div className="text-center mt-12 text-gray-300">
                    <p className="text-[10px] font-bold tracking-widest uppercase">
                        Dynamic Item Portal
                    </p>
                </div>
            </div>
        </div>
    )
}