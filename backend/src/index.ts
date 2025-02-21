import 'module-alias/register'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import env from './config/env'
import authRoutes from './routes/auth.routes'
import taskRoutes from './routes/task.routes'

const app = express()

const allowedOrigins = ['http://localhost:5173', 'http://localhost:8080']

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true)

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          'The CORS policy for this site does not allow access from the specified Origin.'
        return callback(new Error(msg), false)
      }
      return callback(null, true)
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

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack)
    res.status(500).json({ message: 'Something broke!' })
  }
)

const PORT = env.PORT

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
