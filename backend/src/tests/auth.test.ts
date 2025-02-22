import request from 'supertest'
import { app } from '../index'
import { prisma } from '../lib/prisma'

describe('Auth Endpoints', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.user.deleteMany()
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('should create a new user', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser',
        password: 'Test123!',
      })

      expect(res.status).toBe(201)
      expect(res.body).toHaveProperty('token')
      expect(res.body.user).toHaveProperty('username', 'testuser')
    })

    it('should reject invalid password', async () => {
      const res = await request(app).post('/api/auth/register').send({
        username: 'testuser2',
        password: '123',
      })

      expect(res.status).toBe(400)
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/auth/register').send({
        username: 'testuser',
        password: 'Test123!',
      })
    })

    it('should login existing user', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'Test123!',
      })

      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('token')
    })

    it('should reject invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({
        username: 'testuser',
        password: 'wrongpassword',
      })

      expect(res.status).toBe(401)
    })
  })
})
