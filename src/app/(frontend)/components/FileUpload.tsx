'use client'
import { useState } from 'react'
import { useApp } from '../context/AppContext'

interface FileUploadProps {
  label?: string
  onUpload: (fileIds: string[]) => void
  multiple?: boolean
}

export default function FileUpload({
  label = 'Upload Images',
  onUpload,
  multiple = true,
}: FileUploadProps) {
  const { uploadMedia } = useApp()
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setProgress(0)

    try {
      const fileArray = Array.from(files)
      const newPreviews = fileArray.map((f) => URL.createObjectURL(f))
      setPreviews((prev) => [...prev, ...newPreviews])

      const uploadedIds = await uploadMedia(fileArray, {}, (p) => setProgress(p))
      onUpload(uploadedIds)
    } catch (err: any) {
      console.error(err)
      alert(err?.message || 'File upload failed')
    } finally {
      setUploading(false)
      setProgress(0)
    }
  }

  return (
    <div>
      {label && <label className="block text-gray-700 font-semibold mb-1">{label}</label>}
      <input
        type="file"
        multiple={multiple}
        accept="image/*"
        className="w-full p-2 border border-gray-300 rounded bg-gray-50"
        onChange={handleFileChange}
        disabled={uploading}
      />
      {uploading && <p className="text-sm text-gray-500 mt-1">Uploading... {progress}%</p>}
      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {previews.map((src, idx) => (
            <img key={idx} src={src} className="w-24 h-24 object-cover rounded" alt="Preview" />
          ))}
        </div>
      )}
    </div>
  )
}
