import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const customId = searchParams.get('id')

    if (!customId) {
        return NextResponse.json(
            { error: 'ID parameter is required' },
            { status: 400 }
        )
    }

    try {
        const item = await prisma.item.findUnique({
            where: { customId },
            select: { name: true, customId: true }
        })

        if (!item) {
            return NextResponse.json(
                { found: false, message: 'No item found with this ID' },
                { status: 200 }
            )
        }

        return NextResponse.json({
            found: true,
            itemName: item.name,
            customId: item.customId
        })
    } catch (error) {
        console.error('Search API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
