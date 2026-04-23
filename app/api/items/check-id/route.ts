import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/auth'

export async function GET(req: NextRequest) {
    // Protect this route — only logged-in admins can check
    const auth = requireAuth(req)
    if (auth.error) return auth.error

    const customId = req.nextUrl.searchParams.get('customId')
    if (!customId) {
        return NextResponse.json({ error: 'customId is required' }, { status: 400 })
    }

    const existing = await prisma.item.findUnique({
        where: { customId },
        select: { id: true }  // only fetch id — we don't need the full item
    })
    if (existing) {
        return NextResponse.json({
            available: false,
            message: 'This ID is already in use. Please enter a unique ID.'
        })
    }

    return NextResponse.json({ available: true })
}