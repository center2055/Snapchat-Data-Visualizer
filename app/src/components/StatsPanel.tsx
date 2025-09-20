import type { Message } from '../types'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts'
import { format } from 'date-fns'

function groupByDay(messages: Message[]) {
  const map = new Map<string, number>()
  for (const m of messages) {
    const key = format(m.timestamp, 'yyyy-MM-dd')
    map.set(key, (map.get(key) || 0) + 1)
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }))
}

function countBySender(messages: Message[]) {
  const map = new Map<string, number>()
  for (const m of messages) {
    map.set(m.sender, (map.get(m.sender) || 0) + 1)
  }
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([sender, count]) => ({ sender, count }))
}

interface StatsPanelProps {
  messages: Message[]
}

export default function StatsPanel({ messages }: StatsPanelProps) {
  const timeSeries = groupByDay(messages)
  const bySender = countBySender(messages)

  return (
    <div className="stats-panel">
      <div className="stats-section">
        <div className="section-title">Messages per day</div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <LineChart data={timeSeries} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} angle={-20} height={40} interval={Math.ceil(timeSeries.length / 10)} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#8884d8" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="stats-section">
        <div className="section-title">Messages by sender (top 10)</div>
        <div style={{ width: '100%', height: 240 }}>
          <ResponsiveContainer>
            <BarChart data={bySender} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sender" tick={{ fontSize: 12 }} interval={0} angle={-20} height={60} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}


