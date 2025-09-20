import { useMemo, useState } from 'react'
import type { ChatThread } from '../types'

interface SidebarProps {
  threads: ChatThread[]
  selectedId: string | null
  onSelect: (thread: ChatThread) => void
}

export default function Sidebar({ threads, selectedId, onSelect }: SidebarProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return threads
    return threads.filter(t => t.title.toLowerCase().includes(q))
  }, [threads, query])

  return (
    <div className="sidebar">
      <div className="sidebar-header">Chats</div>
      <div className="sidebar-search">
        <input
          type="text"
          placeholder="Search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>
      <div className="sidebar-list">
        {filtered.map((t) => (
          <button
            key={t.id}
            className={"chat-item" + (selectedId === t.id ? ' active' : '')}
            onClick={() => onSelect(t)}
            title={t.title}
          >
            <span className="chat-title">{t.title}</span>
          </button>
        ))}
      </div>
    </div>
  )
}


