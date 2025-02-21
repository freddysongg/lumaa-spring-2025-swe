import { Task } from '@/types/task'

export interface TaskContextType {
  tasks: Task[]
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => Promise<Task>
  updateTask: (id: string, task: Partial<Task>) => Promise<Task>
  deleteTask: (id: string) => Promise<void>
  deleteTasks: (ids: string[]) => Promise<void>
  toggleTaskComplete: (id: string) => Promise<Task>
  toggleTaskStarred: (id: string) => Promise<Task>
  duplicateTask: (id: string) => Promise<Task>
}
