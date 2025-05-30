// src/constants/fileTypes.ts

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico']
export const VIDEO_EXTENSIONS = ['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv', 'flv', 'm4v']
export const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma']
export const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt']
export const CODE_EXTENSIONS = ['js', 'ts', 'html', 'css', 'json', 'xml', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs', 'swift']

export const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB
export const ALLOWED_FILE_TYPES = [
  ...IMAGE_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
  ...AUDIO_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS,
  ...CODE_EXTENSIONS,
  'zip', 'rar', '7z', 'xlsx', 'xls', 'csv', 'ppt', 'pptx'
]