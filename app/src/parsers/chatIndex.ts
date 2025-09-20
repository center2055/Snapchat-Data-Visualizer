import type { ChatThread } from '../types'

function extractSubpagePathFromOnclick(onclickValue: string): string | null {
  const match = onclickValue.match(/'([^']+subpage[^']+\.html)'/)
  if (match && match[1]) return match[1]
  return null
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function parseChatIndexHtml(html: string): ChatThread[] {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const buttons = Array.from(doc.querySelectorAll('button.single_chat'))
  const threads: ChatThread[] = []

  for (const btn of buttons) {
    const onclickValue = btn.getAttribute('onclick') || ''
    const relative = extractSubpagePathFromOnclick(onclickValue)
    if (!relative) continue

    const titleText = (btn.textContent || '').trim()
    const name = titleText.replace(/^Chat History with\s*/i, '').trim()
    const subpagePath = `html/${relative}`.replace(/\\/g, '/').replace(/\/+/, '/')

    threads.push({
      id: slugify(subpagePath),
      title: name,
      subpagePath,
    })
  }

  return threads
}


