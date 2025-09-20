import { useMemo, useState } from 'react'
import './App.css'
import DirectoryImport from './components/DirectoryImport'
import Sidebar from './components/Sidebar'
import ChatView from './components/ChatView'
import StatsPanel from './components/StatsPanel'
import ThemeToggle from './components/ThemeToggle'
import { parseChatIndexHtml } from './parsers/chatIndex'
import { parseChatSubpageHtml } from './parsers/chatSubpage'
import type { ChatThread, Message } from './types'

function App() {
  const [files, setFiles] = useState<Map<string, File> | null>(null)
  const [threads, setThreads] = useState<ChatThread[]>([])
  const [selected, setSelected] = useState<ChatThread | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [hideEmptyText, setHideEmptyText] = useState(true)
  const [hideUnknown, setHideUnknown] = useState(true)

  const hasLoaded = !!files

  async function handleFilesLoaded(map: Map<string, File>) {
    setFiles(map)
    // Try multiple candidate paths to be resilient to how browsers report relative paths
    const candidates = [
      'html/chat_history.html',
      '/html/chat_history.html',
      'chat_history.html',
    ]
    let chatIndexFile: File | undefined
    for (const c of candidates) {
      const hit = map.get(c)
      if (hit) { chatIndexFile = hit; break }
    }
    if (!chatIndexFile) {
      // Last resort: search keys case-insensitively
      for (const [k, f] of map.entries()) {
        if (k.toLowerCase().endsWith('/html/chat_history.html') || k.toLowerCase().endsWith('chat_history.html')) {
          chatIndexFile = f
          break
        }
      }
    }
    if (!chatIndexFile) {
      alert('Could not find html/chat_history.html in the selected folder.')
      return
    }
    const indexHtml = await chatIndexFile.text()
    const parsedThreads = parseChatIndexHtml(indexHtml)
    setThreads(parsedThreads)
    if (parsedThreads.length > 0) {
      handleSelectThread(parsedThreads[0], map)
    }
  }

  async function handleSelectThread(thread: ChatThread, mapOverride?: Map<string, File> | null) {
    const source = mapOverride ?? files
    if (!source) return
    setSelected(thread)
    let subFile = source.get(thread.subpagePath)
    if (!subFile) {
      // Try forgiving matches (remove potential top folder and try unix/absolute variants)
      const variants = [
        thread.subpagePath,
        thread.subpagePath.replace(/^\/?/, ''),
      ]
      for (const [k, f] of source.entries()) {
        for (const v of variants) {
          if (k.endsWith(v)) { subFile = f; break }
        }
        if (subFile) break
      }
    }
    if (!subFile) {
      setMessages([])
      return
    }
    const subHtml = await subFile.text()
    const msgs = parseChatSubpageHtml(subHtml)
    setMessages(msgs)
  }

  const allLoadedMessages = useMemo(() => {
    return messages.filter(m => {
      if (showSavedOnly && !m.saved) return false
      if (hideUnknown && m.type === 'UNKNOWN') return false
      if (hideEmptyText && m.type === 'TEXT' && (!m.text || m.text.trim() === '')) return false
      return true
    })
  }, [messages, showSavedOnly, hideEmptyText, hideUnknown])

  return (
    <div className="app-root">
      <div className="app-header">
        <div style={{ fontWeight: 800 }}>Snapchat Data Visualizer</div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <ThemeToggle />
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={showSavedOnly} onChange={(e) => setShowSavedOnly(e.target.checked)} />
            Saved only
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={hideEmptyText} onChange={(e) => setHideEmptyText(e.target.checked)} />
            Hide empty text
          </label>
          <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <input type="checkbox" checked={hideUnknown} onChange={(e) => setHideUnknown(e.target.checked)} />
            Hide unknown
          </label>
          {!hasLoaded && <div>Select your export to begin</div>}
        </div>
      </div>

      {!hasLoaded ? (
        <div style={{ gridArea: 'sidebar', padding: 8 }}>
          <DirectoryImport onFilesLoaded={handleFilesLoaded} />
        </div>
      ) : (
        <Sidebar
          threads={threads}
          selectedId={selected?.id ?? null}
          onSelect={(t) => handleSelectThread(t)}
        />
      )}

      <div className="main">
        {selected ? (
          <ChatView messages={allLoadedMessages} title={selected.title} />
        ) : (
          <div style={{ padding: 16 }}>Choose a chat to view messages.</div>
        )}
      </div>

      <StatsPanel messages={allLoadedMessages} />
    </div>
  )
}

export default App
