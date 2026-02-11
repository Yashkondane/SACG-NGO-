import { NextResponse } from 'next/server'
import redis from '@/lib/redis'

export async function GET() {
    try {
        // Increment a visit counter
        const count = await redis.incr('test_counter')

        // Store last visit time
        await redis.set('last_visit', new Date().toISOString())

        const lastVisit = await redis.get('last_visit')

        return NextResponse.json({
            success: true,
            count,
            lastVisit,
            message: "Redis is connected! Each refresh increases the count."
        })
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}
