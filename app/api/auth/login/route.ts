import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    const { email, password } = await req.json()

    // 1. Validate inputs are present
    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    // 2. Find admin in database by email
    const user = await prisma.user.findUnique({ where: { email } })

    // 3. If no user found, or password doesn't match → same error
    //    (Don't say "wrong email" vs "wrong password" — security risk)
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    // 4. Create and return JWT token
    const token = signToken({ userId: user.id, email: user.email })
    return NextResponse.json({ token, user: { id: user.id, email: user.email } })
}