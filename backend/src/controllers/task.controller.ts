import { Request, Response } from 'express'
import { prisma } from '../lib/prisma'
import { AuthRequest } from '../middleware/auth'
import { z } from 'zod'
import { Prisma, Priority } from '@prisma/client'

const taskSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  dueDate: z
    .string()
    .transform((date) => (date ? new Date(date).toISOString() : null))
    .nullish(),
  priority: z.enum(['High', 'Medium', 'Low']).nullish(),
  category: z.string().nullish(),
  completed: z.boolean().default(false),
  starred: z.boolean().default(false),
})

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Received task data:', req.body)

    const data = taskSchema.parse(req.body)

    const taskData = {
      title: data.title,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
      priority: data.priority || undefined,
      category: data.category || undefined,
      completed: data.completed,
      starred: data.starred,
      userId: req.user!.id,
    }

    const task = await prisma.task.create({
      data: taskData,
    })

    console.log('Created task:', task)
    res.status(201).json(task)
  } catch (error) {
    console.error('Task creation error:', error)
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: 'Invalid task data',
        errors: error.errors,
      })
    }
    res.status(500).json({ message: 'Error creating task' })
  }
}

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        userId: req.user!.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    console.log('Fetched tasks:', tasks)

    res.json({ tasks })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    res.status(500).json({ message: 'Error fetching tasks' })
  }
}

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params
    const data = taskSchema.partial().parse(req.body)

    const updateData = {
      title: data.title || undefined,
      description: data.description || undefined,
      dueDate: data.dueDate || undefined,
      priority: data.priority || undefined,
      category: data.category || undefined,
      completed: data.completed,
      starred: data.starred,
    }

    const task = await prisma.task.findUnique({ where: { id } })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    if (task.archived) {
      return res.status(400).json({ message: 'Cannot update archived task' })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: updateData,
    })

    res.json(updatedTask)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors })
    }
    res.status(500).json({ message: 'Error updating task' })
  }
}

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.task.delete({
      where: { id },
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' })
  }
}

export const toggleTaskComplete = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        completed: !task.completed,
        archived: !task.completed,
      },
    })

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' })
  }
}

export const toggleTaskStarred = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        starred: !task.starred,
      },
    })

    res.json(updatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Error updating task' })
  }
}

export const duplicateTask = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params

    const task = await prisma.task.findUnique({
      where: { id },
    })

    if (!task) {
      return res.status(404).json({ message: 'Task not found' })
    }

    if (task.userId !== req.user!.id) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    const duplicatedTask = await prisma.task.create({
      data: {
        title: `${task.title} (copy)`,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        category: task.category,
        userId: req.user!.id,
        completed: false,
        starred: false,
        archived: false,
      },
    })

    res.status(201).json(duplicatedTask)
  } catch (error) {
    res.status(500).json({ message: 'Error duplicating task' })
  }
}

export const deleteTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { ids } = req.body as { ids: string[] }

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ message: 'Invalid task ids' })
    }

    const tasks = await prisma.task.findMany({
      where: {
        id: { in: ids },
      },
    })

    const unauthorized = tasks.some((task) => task.userId !== req.user!.id)
    if (unauthorized) {
      return res.status(403).json({ message: 'Not authorized' })
    }

    await prisma.task.deleteMany({
      where: {
        id: { in: ids },
        userId: req.user!.id,
      },
    })

    res.status(204).send()
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tasks' })
  }
}

export const searchTasks = async (req: AuthRequest, res: Response) => {
  try {
    const { q, priority, category, completed } = req.query
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    const where: Prisma.TaskWhereInput = {
      userId: req.user!.id,
      ...(q && {
        OR: [
          {
            title: {
              contains: String(q),
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
          {
            description: {
              contains: String(q),
              mode: 'insensitive' as Prisma.QueryMode,
            },
          },
        ],
      }),
      ...(priority && { priority: String(priority) as Priority }),
      ...(category && { category: String(category) }),
      ...(completed !== undefined && { completed: Boolean(completed) }),
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    })

    const total = await prisma.task.count({ where })

    res.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    res.status(500).json({ message: 'Error searching tasks' })
  }
}
