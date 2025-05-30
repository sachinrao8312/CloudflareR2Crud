import FileManager from '@/components/file-manager/FileManager'
import { ToastProvider } from '@/components/toast/ToastProvider'

export default function Home() {
  return (
    <ToastProvider>
      <FileManager />
    </ToastProvider>
  )
}