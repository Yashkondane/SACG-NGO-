import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params
  const id = params.id

  if (!id) {
    return new NextResponse('Missing QR code ID', { status: 400 })
  }

  // 1. Increment the scan count using the RPC we created
  const { error: rpcError } = await supabase.rpc('increment_qr_scan', { qr_id: id })
  if (rpcError) {
    console.error('Error incrementing QR scan count:', rpcError)
    // We log it but continue so the user still gets redirected even if tracking fails momentarily
  }

  // 2. Fetch the destination URL
  const { data, error } = await supabase
    .from('dynamic_qrs')
    .select('destination_url')
    .eq('id', id)
    .single()

  if (error || !data) {
    console.error('Error fetching QR code destination:', error)
    // Redirect to home if not found
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. Redirect the user to the destination URL
  // Ensure the destination is an absolute URL or a relative path correctly handled
  let destination = data.destination_url
  if (destination.startsWith('/')) {
    destination = new URL(destination, request.url).toString()
  } else if (!destination.startsWith('http://') && !destination.startsWith('https://')) {
    destination = `https://${destination}`
  }

  return NextResponse.redirect(destination)
}
