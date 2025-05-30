// src/app/api/preview/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrlForDownload } from '@/utils/r2'

export async function POST(request: NextRequest) {
  try {
    const { key } = await request.json()

    if (!key) {
      return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    // Never force download for preview - allow inline viewing
    const signedUrl = await getSignedUrlForDownload(key, false)
    
    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error('Error generating preview URL:', error)
    return NextResponse.json(
      { error: 'Error generating preview URL' },
      { status: 500 }
    )
  }
}