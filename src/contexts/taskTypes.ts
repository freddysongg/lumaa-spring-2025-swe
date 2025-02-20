import { Task } from '@/types/task'

export interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  updateTask: (id: string, updatedFields: Partial<Task>) => void
  deleteTask: (id: string) => void
  deleteTasks: (ids: string[]) => void
  toggleTaskComplete: (id: string) => void
  toggleTaskStarred: (id: string) => void
  duplicateTask: (id: string) => void
}
