import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'
import env from '@/config/env'
import { z } from 'zod'
import { SignOptions } from 'jsonwebtoken'

const userSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(6),
})

const createToken = (userId: string) => {
  const signOptions: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as number,
  }

  return jwt.sign({ id: userId }, env.JWT_SECRET, signOptions)
}

export const register = async (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body)
    
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (existingUser) {
      return res.status(400).json({ message: 'Username already taken' })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const user = await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    })

    const token = createToken(user.id)

    res.status(201).json({ user, token })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors })
    }
    res.status(500).json({ message: 'Error creating user' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const data = userSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { username: data.username },
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isValidPassword = await bcrypt.compare(data.password, user.password)

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = createToken(user.id)

    res.json({
      user: {
        id: user.id,
        username: user.username,
      },
      token,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors })
    }
    res.status(500).json({ message: 'Error logging in' })
  }
} 