import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

// POST — Create a new item
export async function POST(req: NextRequest) {
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    const { name, customId, sections } = await req.json()

    // Validate required fields
    if (!name || !customId) {
        return NextResponse.json(
            { error: 'Validation failed. Item name and Custom ID are required.' },
            { status: 422 }
        )
    }

    // Final duplicate check (defensive)
    const existing = await prisma.item.findUnique({ where: { customId } })
    if (existing) {
        return NextResponse.json(
            { error: 'This ID is already in use. Please enter a unique ID.' },
            { status: 409 }
        )
    }

    // Save everything in one transaction
    const item = await prisma.$transaction(async (tx) => {
        const newItem = await tx.item.create({
            data: {
                name,
                customId,
                userId: auth.payload!.userId,
                sections: {
                    create: sections.map((section: any, sIdx: number) => ({
                        heading: section.heading,
                        displayOrder: sIdx,
                        fields: {
                            create: section.fields.map((field: any, fIdx: number) => ({
                                label: field.label,
                                value: field.value,
                                displayOrder: fIdx,
                            }))
                        }
                    }))
                }
            }
        })
        return newItem
    })
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || ''
    return NextResponse.json(
        {
            item: { id: item.id, customId: item.customId },
            qrCodeUrl: `${baseUrl}/view/${item.customId}`
        },
        { status: 201 }
    )
}

// GET — List all items for this admin
export async function GET(req: NextRequest) {
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    const items = await prisma.item.findMany({
        where: { userId: auth.payload!.userId },
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, customId: true, createdAt: true }
    })

    return NextResponse.json({ total: items.length, items })
}