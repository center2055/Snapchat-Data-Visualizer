import type { Message } from '../types'
import { useMemo, useState } from 'react'
import { format } from 'date-fns'

interface ChatViewProps {
  messages: Message[]
  title: string
}

function highlight(text: string, query: string) {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'ig'))
  return parts.map((part, i) => (
    i % 2 === 1 ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>
  ))
}

export default function ChatView({ messages, title }: ChatViewProps) {
  const [query, setQuery] = useState('')
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return messages
    return messages.filter(m => (m.text || '').toLowerCase().includes(q))
  }, [messages, query])
  return (
    <div className="chat-view">
      <div className="chat-header">
        <div>{title}</div>
        <div style={{ marginTop: 8 }}>
          <input
            type="text"
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ width: '100%', maxWidth: 360, padding: 8, borderRadius: 8, border: '1px solid var(--input-border)', background: 'var(--input-bg)', color: 'var(--text)' }}
          />
        </div>
      </div>
      <div className="message-list">
        {filtered.map((m) => (
          <div key={m.id} className="message-item">
            <div className="message-meta">
              <span className="sender">{m.sender}</span>
              <span className="time">{format(m.timestamp, 'yyyy-MM-dd HH:mm')}</span>
              {m.saved && <span className="saved-tag">Saved</span>}
              <span className={"type-tag " + m.type.toLowerCase()}>{m.type}</span>
            </div>
            {m.text && <div className="message-text">{highlight(m.text, query)}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}


