import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const SECRET = process.env.JWT_SECRET!

export function signToken(payload: { userId: string; email: string }) {
    return jwt.sign(payload, SECRET, { expiresIn: '12h' })
}

export function verifyToken(token: string) {
    return jwt.verify(token, SECRET) as { userId: string; email: string }
}
// Middleware: call this at top of any protected route
export function requireAuth(req: NextRequest) {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
        return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
    }
    try {
        const token = authHeader.slice(7)
        const payload = verifyToken(token)
        return { payload }
    } catch {
        return { error: NextResponse.json({ error: 'Invalid token' }, { status: 401 }) }
    }
}