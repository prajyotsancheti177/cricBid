import React, { useEffect, useState } from 'react'

const VERSION = '0.1.0'

function App() {
  const [health, setHealth] = useState({ message: 'Checking...', env: '', version: '' })

  useEffect(() => {
    fetch('/api/status')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(() => setHealth({ message: 'Backend not reachable', env: '', version: '' }))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '80px' }}>
      <h1>🏏 CricBid</h1>
      <p>Cricket Auction Platform</p>
      <hr style={{ width: '200px' }} />
      <p>Backend: <strong>{health.message}</strong></p>
      <p>Environment: <strong>{health.env || '—'}</strong></p>
      <p>API version: <strong>{health.version || '—'}</strong></p>
      <p style={{ color: '#888', fontSize: '12px' }}>Frontend v{VERSION}</p>
    </div>
  )
}

export default App
