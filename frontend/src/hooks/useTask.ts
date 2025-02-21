import { useContext } from 'react'
import { TaskContext } from '../contexts/TaskContext'
import type { TaskContextType } from '../contexts/taskTypes'

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider')
  }
  return context
}
