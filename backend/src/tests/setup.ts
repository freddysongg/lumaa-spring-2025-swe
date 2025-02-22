import { prisma } from '../lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import config from '../config/env'
import { server } from '../index'
import { Priority } from '@prisma/client'

type CreateTaskData = Partial<{
  title: string
  description: string
  dueDate: string | Date
  priority: Priority | null
  category: string
  completed: boolean
  starred: boolean
}>

beforeAll(async () => {
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$connect()
})

afterAll(async () => {
  await prisma.task.deleteMany()
  await prisma.user.deleteMany()
  await prisma.$disconnect()

  if (server) {
    await new Promise((resolve) => {
      server.close(resolve)
    })
  }
})

export const createTestUser = async (
  username: string = 'testuser',
  password: string = 'Test123!'
) => {
  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        password: true,
      },
    })

    return user
  } catch (error) {
    console.error('Error creating test user:', error)
    throw error
  }
}

export const getAuthToken = async (username: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    const token = jwt.sign({ id: user.id }, config.JWT_SECRET, {
      expiresIn: '1h',
    })

    return token
  } catch (error) {
    console.error('Error generating auth token:', error)
    throw error
  }
}

export const createTestTask = async (
  userId: string,
  taskData: CreateTaskData = {}
) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test Description',
    priority: 'Medium',
    completed: false,
    starred: false,
    ...taskData,
  }

  try {
    const task = await prisma.task.create({
      data: {
        ...defaultTask,
        priority: defaultTask.priority as Priority,
        userId,
      },
    })

    return task
  } catch (error) {
    console.error('Error creating test task:', error)
    throw error
  }
}

export const cleanup = async () => {
  try {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  } catch (error) {
    console.error('Error cleaning up test data:', error)
    throw error
  }
}

export const createTestUserWithTasks = async (taskCount: number = 3) => {
  const user = await createTestUser()
  const tasks = []

  for (let i = 0; i < taskCount; i++) {
    tasks.push(
      await createTestTask(user.id, {
        title: `Test Task ${i + 1}`,
        priority: ['High', 'Medium', 'Low'][i % 3] as Priority,
      })
    )
  }

  return { user, tasks }
}
