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
        <div className="min-h-screen bg-[#f8fafc] pb-24">
            {/* Premium Header */}
            <header className="bg-white border-b border-slate-200 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-600"></div>
                <div className="max-w-6xl mx-auto px-6 py-10 md:py-14">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center bg-blue-50 border border-blue-100 shadow-sm">
                                    <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                                </div>
                                <p className="text-[10px] font-bold tracking-[0.2em] text-blue-600/70 uppercase">
                                    Digital Product Verification
                                </p>
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 leading-none">
                                {item.name}
                            </h1>
                            
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] pl-0.5">Custom ID</p>
                                <div className="inline-flex items-center self-start px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl shadow-sm">
                                    <span className="text-sm font-mono font-semibold tracking-wider text-slate-700">
                                        {item.customId}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="hidden md:block">
                            <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-blue-600">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-blue-900 uppercase tracking-wider">Verified Authenticity</p>
                                    <p className="text-xs text-blue-600/80">Secured via Dynamic Portal</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 mt-12">
                {item.sections.map((section: any, i: number) => (
                    <section key={i} className="mb-16">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-8">
                            <h2 className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase whitespace-nowrap">
                                {section.heading || 'Specifications'}
                            </h2>
                            <div className="h-px w-full bg-slate-200/60"></div>
                        </div>

                        {/* Responsive Grid: 1 col mobile, 2 col tablet, 3-4 col desktop */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {section.fields.map((field: any, j: number) => (
                                <div 
                                    key={j} 
                                    className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                                            {field.label}
                                        </p>
                                        <div className="p-1.5 bg-slate-50 rounded-lg text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-50 transition-all">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                                                <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 break-words line-clamp-2">
                                        {field.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </section>
                ))}

                {/* Footer simple branding */}
                <footer className="mt-20 pt-10 border-t border-slate-100 text-center">
                    <p className="text-[10px] font-bold tracking-[0.4em] text-slate-300 uppercase">
                        Dynamic Item Portal &copy; {new Date().getFullYear()}
                    </p>
                </footer>
            </main>
        </div>
    )
}