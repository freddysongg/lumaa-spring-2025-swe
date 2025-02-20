export type TaskPriority = 'High' | 'Medium' | 'Low'
export type TaskCategory = 'Work' | 'Personal' | 'Shopping' | 'Health' | 'Other'

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  priority?: TaskPriority
  category?: TaskCategory
  completed: boolean
  starred: boolean
  createdAt: string
}
