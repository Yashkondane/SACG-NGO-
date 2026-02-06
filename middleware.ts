import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    // Create the Supabase client
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    response = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Get User (Securely)
    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // 1. Handle Login Page specially
        if (request.nextUrl.pathname === '/admin/login') {
            if (user) {
                // If user is logged in, check if they are an admin
                const { data: adminData } = await supabase
                    .from('admins')
                    .select('email')
                    .eq('email', user.email)
                    .single()

                if (adminData) {
                    // Already an admin, go to dashboard
                    return NextResponse.redirect(new URL('/admin', request.url))
                }
            }
            // Allow access to login page
            return response
        }

        // 2. Protect Dashboard & other admin routes
        if (!user) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        // 3. Verify Whitelist for logged-in users
        const { data: adminData } = await supabase
            .from('admins')
            .select('email')
            .eq('email', user.email)
            .single()

        if (!adminData) {
            // Not authorized
            await supabase.auth.signOut()
            return NextResponse.redirect(new URL('/admin/login?error=unauthorized', request.url))
        }
    }

    return response
}

export const config = {
    matcher: ['/admin/:path*'],
}
