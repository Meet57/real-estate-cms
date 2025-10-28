'use client'
import { useState } from 'react'
import { api } from '../utils/api'

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
  const [uploading, setUploading] = useState(false)
  const [previews, setPreviews] = useState<string[]>([])
  const [progress, setProgress] = useState<number>(0)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setUploading(true)
    setProgress(0)
    try {
      const uploadedIds: string[] = []
      const token = localStorage.getItem('token')
      if (!token) throw new Error('User not authenticated')

      const newPreviews: string[] = []
      const totalFiles = files.length
      let uploadedCount = 0

      for (const file of Array.from(files)) {
        // Preview
        newPreviews.push(URL.createObjectURL(file))

        const formData = new FormData()
        formData.append('file', file)

        // Payload requires fields inside "data" JSON
        const data = { alt: file.name }
        formData.append('_payload', JSON.stringify(data))

        const res = await api.post('/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
              // Calculate overall progress considering multiple files
              const overallProgress = Math.round(((uploadedCount + percentCompleted / 100) / totalFiles) * 100)
              setProgress(overallProgress)
            }
          },
        })

        uploadedIds.push(res.data.doc.id)
        uploadedCount++
        setProgress(Math.round((uploadedCount / totalFiles) * 100))
      }

      setPreviews((prev) => [...prev, ...newPreviews])
      onUpload(uploadedIds)
    } catch (err: any) {
      console.error(err)
      alert(err?.response?.data?.message || err.message || 'File upload failed')
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
      {uploading && (
        <p className="text-sm text-gray-500 mt-1">
          Uploading... {progress}%
        </p>
      )}

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
