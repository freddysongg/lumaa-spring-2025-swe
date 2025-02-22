import request from 'supertest'
import { app } from '../index'
import { prisma } from '../lib/prisma'
import { createTestUser, getAuthToken } from './setup'

describe('Tasks Endpoints', () => {
  let authToken: string
  let userId: string

  beforeAll(async () => {
    const user = await createTestUser()
    userId = user.id
    authToken = await getAuthToken(user.username)
  })

  beforeEach(async () => {
    await prisma.task.deleteMany()
  })

  afterAll(async () => {
    await prisma.task.deleteMany()
    await prisma.user.deleteMany()
  })

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        priority: 'High',
        dueDate: new Date().toISOString(),
      }

      const res = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)
        .send(taskData)

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('title', taskData.title)
      expect(res.body).toHaveProperty('priority', taskData.priority)
    })
  })

  describe('GET /api/tasks', () => {
    it('should return all tasks for user', async () => {
      await prisma.task.create({
        data: {
          title: 'Existing Task',
          userId,
          category: 'General',
        },
      })

      const res = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${authToken}`)

      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.tasks)).toBeTruthy()
      expect(res.body.tasks.length).toBeGreaterThan(0)
    })
  })
})
