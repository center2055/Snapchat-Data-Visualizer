import { useEffect, useRef } from 'react'

interface DirectoryImportProps {
  onFilesLoaded: (files: Map<string, File>) => void
}

export default function DirectoryImport({ onFilesLoaded }: DirectoryImportProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (inputRef.current) {
      // Enable directory selection for Chromium-based browsers
      ;(inputRef.current as any).webkitdirectory = true
      ;(inputRef.current as any).directory = true
      ;(inputRef.current as any).mozdirectory = true
      ;(inputRef.current as any).msdirectory = true
      ;(inputRef.current as any).odirectory = true
    }
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const list = e.target.files
    if (!list || list.length === 0) return
    const map = new Map<string, File>()
    for (const file of Array.from(list)) {
      const relRaw: string = (file as any).webkitRelativePath || file.name
      const rel = relRaw.replace(/\\/g, '/').replace(/\/+/g, '/')

      // Store the full relative path as-is
      map.set(rel, file)

      // Also store a version with the first path segment (top folder) removed,
      // so lookups like 'html/chat_history.html' work regardless of selection root name
      const firstSlash = rel.indexOf('/')
      if (firstSlash > 0) {
        const withoutTop = rel.slice(firstSlash + 1)
        map.set(withoutTop, file)
      }
    }
    onFilesLoaded(map)
  }

  return (
    <div style={{ padding: 16 }}>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: 8 }}>Select your Snapchat export root folder</label>
      <input ref={inputRef} type="file" multiple onChange={handleChange} />
      <div style={{ color: '#666', marginTop: 8 }}>
        Tip: Choose the top-level folder that contains the <code>html/</code> and <code>chat_media/</code> subfolders.
      </div>
    </div>
  )
}


