import React, { createContext, useContext, useState } from 'react'
import { Task } from '@/types/task'
import type { TaskContextType } from '@/contexts/taskTypes'

const TaskContext = createContext<TaskContextType | undefined>(undefined)

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substring(7),
      createdAt: new Date().toISOString(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const updateTask = (id: string, updatedFields: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const deleteTasks = (ids: string[]) => {
    setTasks((prev) => prev.filter((task) => !ids.includes(task.id)))
  }

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    )
  }

  const toggleTaskStarred = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, starred: !task.starred } : task
      )
    )
  }

  const duplicateTask = (id: string) => {
    const taskToDuplicate = tasks.find((task) => task.id === id)
    if (taskToDuplicate) {
      const duplicatedTask: Task = {
        ...taskToDuplicate,
        id: Math.random().toString(36).substring(7),
        title: `${taskToDuplicate.title} (copy)`,
        createdAt: new Date().toISOString(),
        completed: false,
      }
      setTasks((prev) => [duplicatedTask, ...prev])
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
