const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 4000
const API_VERSION = '0.1.0'

app.use(cors())
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({
    message: 'Backend is up and running',
    env: process.env.NODE_ENV || 'development',
    port: PORT,
    version: API_VERSION,
  })
})

app.get('/api/status', (req, res) => {
  res.json({
    message: 'Backend is up and running',
    env: process.env.NODE_ENV || 'development',
    version: API_VERSION,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`)
})
