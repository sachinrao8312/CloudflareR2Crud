// src/utils/fileTypes.ts

import { FileType } from '../types/fileManager'

export const FILE_TYPE_EXTENSIONS: Record<string, FileType> = {
  // Images
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', 
  webp: 'image', svg: 'image', bmp: 'image', ico: 'image',
  
  // Videos
  mp4: 'video', avi: 'video', mov: 'video', wmv: 'video',
  webm: 'video', mkv: 'video', flv: 'video', m4v: 'video',
  
  // Audio
  mp3: 'audio', wav: 'audio', ogg: 'audio', flac: 'audio',
  aac: 'audio', m4a: 'audio', wma: 'audio',
  
  // Documents
  pdf: 'document', doc: 'document', docx: 'document',
  txt: 'document', rtf: 'document', odt: 'document',
  
  // Code
  js: 'code', ts: 'code', html: 'code', css: 'code',
  json: 'code', xml: 'code', py: 'code', java: 'code',
  cpp: 'code', c: 'code', php: 'code', rb: 'code',
  go: 'code', rs: 'code', swift: 'code',
  
  // Archives
  zip: 'archive', rar: 'archive', '7z': 'archive',
  tar: 'archive', gz: 'archive', bz2: 'archive', xz: 'archive',
  
  // Spreadsheets
  xlsx: 'spreadsheet', xls: 'spreadsheet', csv: 'spreadsheet',
  
  // Presentations
  ppt: 'presentation', pptx: 'presentation'
}