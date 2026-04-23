import { NextResponse, NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    const item = await prisma.item.findUnique({
        where: { id },
        include: {
            sections: {
                include: { fields: { orderBy: { displayOrder: 'asc' } } },
                orderBy: { displayOrder: 'asc' }
            }
        }
    })

    if (!item) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(item)
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    const body = await req.json()
    const { name, customId, sections } = body

    try {
        const item = await prisma.$transaction(async (tx) => {
            // Delete existing sections (and fields due to cascade)
            await tx.section.deleteMany({ where: { itemId: id } })

            // Update item name and create new sections/fields
            return tx.item.update({
                where: { id },
                data: {
                    name,
                    customId,
                    sections: {
                        create: sections.map((s: any, si: number) => ({
                            heading: s.heading,
                            displayOrder: si,
                            fields: {
                                create: s.fields.map((f: any, fi: number) => ({
                                    label: f.label,
                                    value: f.value,
                                    displayOrder: fi
                                }))
                            }
                        }))
                    }
                }
            })
        })
        return NextResponse.json(item)
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    try {
        await prisma.item.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 })
    }
}
