import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [light, setLight] = useState(false)

  useEffect(() => {
    const cls = 'theme-light'
    if (light) document.documentElement.classList.add(cls)
    else document.documentElement.classList.remove(cls)
  }, [light])

  return (
    <label style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
      <input type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} />
      Light mode
    </label>
  )
}


