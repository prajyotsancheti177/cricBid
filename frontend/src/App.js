import React, { useEffect, useState } from 'react'

function App() {
  const [status, setStatus] = useState('Checking...')

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setStatus(data.message))
      .catch(() => setStatus('Backend not reachable'))
  }, [])

  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '80px' }}>
      <h1>CricBid</h1>
      <p>Cricket Bidding Platform</p>
      <hr style={{ width: '200px' }} />
      <p>Backend status: <strong>{status}</strong></p>
    </div>
  )
}

export default App
