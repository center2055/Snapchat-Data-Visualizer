import type { Message, MessageType } from '../types'

function parseTimestampToDate(text: string): Date {
  const trimmed = text.trim()
  // Expected like: 2025-03-24 12:35:28 UTC
  const isoLike = trimmed.replace(' UTC', 'Z').replace(' ', 'T')
  const d = new Date(isoLike)
  if (!isNaN(d.getTime())) return d
  const fallback = new Date(trimmed)
  return isNaN(fallback.getTime()) ? new Date() : fallback
}

export function parseChatSubpageHtml(html: string): Message[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const containers = Array.from(doc.querySelectorAll('div')).filter((div) => {
    const style = div.getAttribute('style') || ''
    return style.includes('background: #f2f2f2')
  })

  const messages: Message[] = []
  let idCounter = 1

  for (const container of containers) {
    const saved = !!container.querySelector('button.saved')
    const senderEl = container.querySelector('h4')
    const sender = (senderEl?.textContent || '').trim()

    let type: MessageType = 'UNKNOWN'
    const labelSpan = Array.from(container.querySelectorAll('span')).find((s) => {
      const t = (s.textContent || '').trim().toUpperCase()
      return t === 'TEXT' || t === 'MEDIA'
    })
    const label = (labelSpan?.textContent || '').trim().toUpperCase()
    if (label === 'TEXT') type = 'TEXT'
    if (label === 'MEDIA') type = 'MEDIA'

    const textEl = container.querySelector('p')
    const text = textEl ? (textEl.textContent || '').trim() : null

    const tsEl = container.querySelector('h6')
    const tsText = (tsEl?.textContent || '').trim()
    if (!sender || !tsText) continue

    const timestamp = parseTimestampToDate(tsText)

    messages.push({
      id: idCounter++,
      sender,
      type,
      text,
      saved,
      timestamp,
    })
  }

  return messages
}


