import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import config from './config/env'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'
import { errorHandler } from './middleware/error'
import { Server } from 'http'

const app = express()

const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080']
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  })
)

app.use(express.json())
app.use(morgan('dev'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
})
app.use(limiter)

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use(errorHandler)

let server: Server
if (process.env.NODE_ENV !== 'test') {
  const port = parseInt(config.PORT) || 3000
  server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
  })
}

process.on('SIGTERM', () => {
  if (server) {
    server.close(() => {
      console.log('Server terminated')
      process.exit(0)
    })
  }
})

export { app, server }
