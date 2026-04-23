import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'

const pool = new Pool({ connectionString: process.env.DATABASE_URL as string })
const adapter = new PrismaPg(pool)

const prisma = new PrismaClient({ adapter }) as PrismaClient

async function main() {
    const passwordHash = await bcrypt.hash('Admin@123', 12)

    const admin = await prisma.user.upsert({
        where: { email: 'admin@example.com' },
        update: {},
        create: {
            email: 'admin@example.com',
            passwordHash,
        },
    })

    console.log('Admin created:', admin.email)
}
main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())