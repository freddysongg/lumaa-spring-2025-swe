import React, { createContext, useState, useEffect } from 'react'
import { Task } from '@/types/task'
import type { TaskContextType } from '@/types/taskTypes'
import api from '@/lib/api'
import { useAuth } from '@/hooks/useAuth'

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])
  const { isAuthenticated } = useAuth()

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks')
      console.log('Fetched tasks:', data)
      setTasks(data.tasks)
    } catch (error) {
      console.error('Error fetching tasks:', error)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks()
    }
  }, [isAuthenticated])

  const addTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    try {
      const { data } = await api.post('/tasks', task)
      setTasks((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error adding task:', error)
      throw error
    }
  }

  const updateTask = async (id: string, updatedFields: Partial<Task>) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, updatedFields)
      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)))
      return data
    } catch (error) {
      console.error('Error updating task:', error)
      throw error
    }
  }

  const deleteTask = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks((prev) => prev.filter((task) => task.id !== id))
    } catch (error) {
      console.error('Error deleting task:', error)
      throw error
    }
  }

  const deleteTasks = async (ids: string[]) => {
    try {
      await api.delete('/tasks', { data: { ids } })
      setTasks((prev) => prev.filter((task) => !ids.includes(task.id)))
    } catch (error) {
      console.error('Error deleting tasks:', error)
      throw error
    }
  }

  const toggleTaskComplete = async (id: string) => {
    try {
      const { data } = await api.post(`/tasks/${id}/complete`)
      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)))
      return data
    } catch (error) {
      console.error('Error toggling task completion:', error)
      throw error
    }
  }

  const toggleTaskStarred = async (id: string) => {
    try {
      const { data } = await api.post(`/tasks/${id}/star`)
      setTasks((prev) => prev.map((task) => (task.id === id ? data : task)))
      return data
    } catch (error) {
      console.error('Error toggling task star:', error)
      throw error
    }
  }

  const duplicateTask = async (id: string) => {
    try {
      const { data } = await api.post(`/tasks/${id}/duplicate`)
      setTasks((prev) => [data, ...prev])
      return data
    } catch (error) {
      console.error('Error duplicating task:', error)
      throw error
    }
  }

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        deleteTasks,
        toggleTaskComplete,
        toggleTaskStarred,
        duplicateTask,
      }}
    >
      {children}
    </TaskContext.Provider>
  )
}

export { TaskContext }
