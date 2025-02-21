import { Router } from 'express'
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  toggleTaskStarred,
  duplicateTask,
  deleteTasks,
  searchTasks,
} from '../controllers/task.controller'
import { auth } from '../middleware/auth'

const router = Router()

router.use(auth)

router.post('/', createTask)
router.get('/', getTasks)
router.get('/search', searchTasks)
router.put('/:id', updateTask)
router.delete('/:id', deleteTask)
router.delete('/', deleteTasks)
router.post('/:id/complete', toggleTaskComplete)
router.post('/:id/star', toggleTaskStarred)
router.post('/:id/duplicate', duplicateTask)

export default router
