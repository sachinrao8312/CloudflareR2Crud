// src/utils/r2.ts
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  ListObjectsV2Command,
  ListObjectsV2CommandOutput,
  DeleteObjectCommand,
  DeleteObjectsCommand
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export interface FileObject {
  Key?: string
  LastModified?: Date
  ETag?: string
  Size?: number
  StorageClass?: string
}

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID!
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID!
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY!
const R2_BUCKET = process.env.R2_BUCKET!

const S3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY
  }
})

export async function uploadFile(file: Buffer, key: string, contentType?: string) {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    Body: file,
    ContentType: contentType
  })

  try {
    const response = await S3.send(command)
    return response
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export async function getSignedUrlForUpload(
  key: string,
  contentType: string
): Promise<string> {
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType
  })

  try {
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }
}

export async function getSignedUrlForDownload(key: string, p0?: boolean): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: R2_BUCKET,
    Key: key
  })

  try {
    const signedUrl = await getSignedUrl(S3, command, { expiresIn: 3600 })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw error
  }
}

export async function listFiles(prefix: string = ''): Promise<FileObject[]> {
  const command = new ListObjectsV2Command({
    Bucket: R2_BUCKET,
    Prefix: prefix,
    MaxKeys: 1000 // Increase for better performance with large directories
  })

  try {
    const response = await S3.send(command)
    return response.Contents || []
  } catch (error) {
    console.error('Error listing files:', error)
    throw error
  }
}

export async function listAllFiles(prefix: string = ''): Promise<FileObject[]> {
  const allFiles: FileObject[] = []
  let continuationToken: string | undefined = undefined

  do {
    try {
      const command = new ListObjectsV2Command({
        Bucket: R2_BUCKET,
        Prefix: prefix,
        MaxKeys: 1000,
        ContinuationToken: continuationToken
      })

      const response: ListObjectsV2CommandOutput = await S3.send(command)
      
      if (response.Contents) {
        allFiles.push(...response.Contents)
      }
      
      continuationToken = response.NextContinuationToken
    } catch (error) {
      console.error('Error listing files:', error)
      throw error
    }
  } while (continuationToken)

  return allFiles
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: R2_BUCKET,
    Key: key
  })

  try {
    const response = await S3.send(command)
    return response
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

export async function deleteFiles(keys: string[]) {
  if (keys.length === 0) return []

  // AWS S3 supports batch delete of up to 1000 objects at once
  const batches: string[][] = []
  for (let i = 0; i < keys.length; i += 1000) {
    batches.push(keys.slice(i, i + 1000))
  }

  const results = []
  for (const batch of batches) {
    const command = new DeleteObjectsCommand({
      Bucket: R2_BUCKET,
      Delete: {
        Objects: batch.map(key => ({ Key: key })),
        Quiet: false
      }
    })

    try {
      const response = await S3.send(command)
      results.push(response)
    } catch (error) {
      console.error('Error deleting batch:', error)
      throw error
    }
  }

  return results
}

export async function deleteFolder(folderPrefix: string) {
  try {
    // Ensure the prefix ends with '/' to match folder contents
    const prefix = folderPrefix.endsWith('/') ? folderPrefix : folderPrefix + '/'
    
    // List all files in the folder
    const files = await listAllFiles(prefix)
    
    if (files.length === 0) {
      return { deleted: 0, message: 'Folder is empty or does not exist' }
    }

    // Extract keys and delete all files
    const keys = files.map(file => file.Key!).filter(key => key)
    await deleteFiles(keys)

    return { 
      deleted: keys.length, 
      message: `Deleted ${keys.length} files from folder ${folderPrefix}` 
    }
  } catch (error) {
    console.error('Error deleting folder:', error)
    throw error
  }
}

export async function createFolder(folderPath: string) {
  try {
    // Ensure the folder path ends with '/' and add a .keep file
    const normalizedPath = folderPath.endsWith('/') ? folderPath : folderPath + '/'
    const keepFilePath = normalizedPath + '.keep'
    
    // Create an empty .keep file to represent the folder
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: keepFilePath,
      Body: '',
      ContentType: 'text/plain'
    })

    const response = await S3.send(command)
    return response
  } catch (error) {
    console.error('Error creating folder:', error)
    throw error
  }
}

export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key
    })
    
    await S3.send(command)
    return true
  } catch (error) {
    return false
  }
}

export async function getFileMetadata(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key
    })
    
    const response = await S3.send(command)
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      etag: response.ETag
    }
  } catch (error) {
    console.error('Error getting file metadata:', error)
    throw error
  }
}