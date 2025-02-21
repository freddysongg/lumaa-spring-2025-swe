import { useContext, useState } from 'react'
import { TaskContext } from '@/contexts/TaskContext'
import { TaskPriority, TaskCategory } from '@/types/task'
import { Plus, Star, Trash2, Copy, CheckCircle2, RotateCcw } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

const Index = () => {
  const { logout } = useAuth()
  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    deleteTasks,
    toggleTaskComplete,
    toggleTaskStarred,
    duplicateTask,
  } = useContext(TaskContext)
  const [selectedTasks, setSelectedTasks] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'category'>(
    'dueDate'
  )
  const [searchTerm, setSearchTerm] = useState('')
  const { toast } = useToast()

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: '' as TaskPriority,
    category: '' as TaskCategory,
  })

  const getPriorityWeight = (priority?: TaskPriority) => {
    switch (priority) {
      case 'High':
        return 3
      case 'Medium':
        return 2
      case 'Low':
        return 1
      default:
        return 0
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) {
      toast({
        title: 'Error',
        description: 'Task title is required',
        variant: 'destructive',
      })
      return
    }

    try {
      const taskData = {
        ...newTask,
        dueDate: newTask.dueDate || null,
        priority: newTask.priority || null,
        category: newTask.category || null,
        completed: false,
        starred: false,
      }

      await addTask(taskData)

      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: '' as TaskPriority,
        category: '' as TaskCategory,
      })

      toast({
        title: 'Success',
        description: 'Task added successfully',
      })
    } catch (error) {
      console.error('Error adding task:', error)
      toast({
        title: 'Error',
        description: 'Failed to add task',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteSelected = () => {
    if (selectedTasks.length === 0) return
    deleteTasks(selectedTasks)
    setSelectedTasks([])
    toast({
      title: 'Success',
      description: `${selectedTasks.length} tasks deleted`,
    })
  }

  const filteredTasks = tasks
    .filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return (a.dueDate || '') > (b.dueDate || '') ? 1 : -1
        case 'priority':
          return (getPriorityWeight(a.priority) || 0) <
            (getPriorityWeight(b.priority) || 0)
            ? 1
            : -1
        case 'category':
          return (a.category || '') > (b.category || '') ? 1 : -1
        default:
          return 0
      }
    })

  const activeTasks = filteredTasks.filter((task) => !task.completed)
  const completedTasks = filteredTasks.filter((task) => task.completed)

  return (
    <div className="min-h-screen bg-terminal-bg p-4 text-terminal-fg">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-terminal-accent">
            task-tracker
          </h1>
          <button
            onClick={logout}
            className="rounded border border-terminal-border px-4 py-2 text-sm hover:bg-terminal-border/20"
          >
            logout
          </button>
        </div>

        {/* Task Creation Form */}
        <form
          onSubmit={handleAddTask}
          className="rounded-lg border border-terminal-border bg-terminal-bg/50 p-6 backdrop-blur"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
            />
            <input
              type="text"
              placeholder="Description (optional)"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
            />
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
            />
            <select
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  priority: e.target.value as TaskPriority,
                })
              }
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg focus:border-terminal-accent focus:outline-none"
            >
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <select
              value={newTask.category}
              onChange={(e) =>
                setNewTask({
                  ...newTask,
                  category: e.target.value as TaskCategory,
                })
              }
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg focus:border-terminal-accent focus:outline-none"
            >
              <option value="">Select Category</option>
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded bg-terminal-accent px-4 py-2 text-black transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </form>

        {/* Task Management Controls */}
        <div className="flex flex-col items-center justify-between gap-4 rounded-lg border border-terminal-border bg-terminal-bg/50 p-6 backdrop-blur md:flex-row">
          <div className="flex w-full items-center gap-4 md:w-auto">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none md:w-auto"
            />
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'dueDate' | 'priority' | 'category')
              }
              className="rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg focus:border-terminal-accent focus:outline-none"
            >
              <option value="dueDate">Sort by Due Date</option>
              <option value="priority">Sort by Priority</option>
              <option value="category">Sort by Category</option>
            </select>
          </div>
          {selectedTasks.length > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="flex w-full items-center justify-center gap-2 rounded bg-terminal-error px-4 py-2 text-white transition-opacity hover:opacity-90 md:w-auto"
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedTasks.length})
            </button>
          )}
        </div>

        {/* Active Tasks */}
        <div className="space-y-4 rounded-lg border border-terminal-border bg-terminal-bg/50 p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-terminal-accent">
            Active Tasks
          </h2>
          <div className="space-y-2">
            {activeTasks.map((task) => (
              <div
                key={task.id}
                className={`group relative flex items-start gap-4 rounded border border-terminal-border p-4 transition-colors hover:bg-terminal-border/10 ${
                  selectedTasks.includes(task.id) ? 'bg-terminal-border/20' : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedTasks.includes(task.id)}
                  onChange={(e) => {
                    setSelectedTasks(
                      e.target.checked
                        ? [...selectedTasks, task.id]
                        : selectedTasks.filter((id) => id !== task.id)
                    )
                  }}
                  className="mt-1 rounded border-terminal-border"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{task.title}</h3>
                    {task.priority && (
                      <span
                        className={`rounded px-2 py-0.5 text-xs ${
                          task.priority === 'High'
                            ? 'bg-terminal-error/20 text-terminal-error'
                            : task.priority === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-500'
                              : 'bg-blue-500/20 text-blue-500'
                        }`}
                      >
                        {task.priority}
                      </span>
                    )}
                    {task.category && (
                      <span className="rounded bg-terminal-border/50 px-2 py-0.5 text-xs">
                        {task.category}
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className="mt-1 text-sm text-terminal-fg/75">
                      {task.description}
                    </p>
                  )}
                  {task.dueDate && (
                    <p className="mt-1 text-xs text-terminal-fg/50">
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleTaskStarred(task.id)}
                    className={`rounded p-1 hover:bg-terminal-border/20 ${
                      task.starred ? 'text-yellow-500' : 'text-terminal-fg/50'
                    }`}
                  >
                    <Star className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => duplicateTask(task.id)}
                    className="rounded p-1 text-terminal-fg/50 hover:bg-terminal-border/20"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="rounded p-1 text-terminal-fg/50 hover:bg-terminal-border/20"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="space-y-4 rounded-lg border border-terminal-border bg-terminal-bg/50 p-6 backdrop-blur">
            <h2 className="text-xl font-bold text-terminal-accent/75">
              Completed Tasks
            </h2>
            <div className="space-y-2 opacity-75">
              {completedTasks.map((task) => (
                <div
                  key={task.id}
                  className="group relative flex items-start gap-4 rounded border border-terminal-border p-4 transition-colors hover:bg-terminal-border/10"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium line-through">{task.title}</h3>
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-terminal-fg/75 line-through">
                        {task.description}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className="rounded p-1 text-terminal-fg/50 hover:bg-terminal-border/20"
                    title="Restore task"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Index
