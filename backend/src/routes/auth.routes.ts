import { Router } from 'express'
import { register, login } from '@/controllers/auth.controller'
import { rateLimit } from 'express-rate-limit'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: 'Too many login attempts, please try again later',
})

router.post('/register', register)
router.post('/login', authLimiter, login)

export default router 