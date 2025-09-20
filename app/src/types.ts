export type MessageType = 'TEXT' | 'MEDIA' | 'UNKNOWN'

export interface ChatThread {
  id: string
  title: string
  subpagePath: string
}

export interface Message {
  id: number
  sender: string
  type: MessageType
  text: string | null
  saved: boolean
  timestamp: Date
}

export interface ParsedIndex {
  threads: ChatThread[]
}



