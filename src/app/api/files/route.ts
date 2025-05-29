// src/app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { listFiles, getSignedUrlForDownload, deleteFile } from '@/utils/r2'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const prefix = searchParams.get('prefix') || ''
    
    const files = await listFiles(prefix)
    return NextResponse.json(files)
  } catch (error) {
    console.error('Error listing files:', error)
    return NextResponse.json({ error: 'Error listing files' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, action } = body

    if (action === 'download') {
      const signedUrl = await getSignedUrlForDownload(key)
      return NextResponse.json({ signedUrl })
    }

    // Default action is still to get download URL for backwards compatibility
    const signedUrl = await getSignedUrlForDownload(key)
    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error('Error processing request:', error)
    return NextResponse.json(
      { error: 'Error generating download URL' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, keys } = body

    if (keys && Array.isArray(keys)) {
      // Bulk delete
      const deletePromises = keys.map(async (k: string) => {
        try {
          await deleteFile(k)
          return { key: k, success: true }
        } catch (error) {
          console.error(`Error deleting ${k}:`, error)
          return { key: k, success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        }
      })

      const results = await Promise.all(deletePromises)
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length

      return NextResponse.json({ 
        message: `Bulk delete completed: ${successful} successful, ${failed} failed`,
        results,
        successful,
        failed
      })
    } else if (key) {
      // Single delete
      await deleteFile(key)
      return NextResponse.json({ message: 'File deleted successfully' })
    } else {
      return NextResponse.json({ error: 'No key or keys provided' }, { status: 400 })
    }
  } catch (error) {
    console.error('Error deleting:', error)
    return NextResponse.json({ error: 'Error deleting file(s)' }, { status: 500 })
  }
}