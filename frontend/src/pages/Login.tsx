import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/hooks/useAuth'

const Login = () => {
  const [isRegister, setIsRegister] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login, register, isAuthenticated } = useAuth()

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/tasks')
    }
  }, [isAuthenticated, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isRegister) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match')
        }
        await register(username, password)
        toast({
          title: 'Success',
          description: 'Account created successfully',
        })
      }
      await login(username, password)
      navigate('/tasks')
    } catch (error: unknown) {
      const e = error as { response?: { data?: { message?: string } } }
      toast({
        title: 'Error',
        description: 'response' in e ? e.response?.data?.message : error instanceof Error ? error.message : 'Authentication failed',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-terminal-bg p-4">
      <div className="w-full max-w-md space-y-8 rounded border border-terminal-border bg-terminal-bg/50 p-8 backdrop-blur">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-terminal-accent">
            task-tracker
          </h1>
          <p className="mt-2 text-terminal-fg opacity-75">
            {isRegister ? 'create an account' : 'login to continue'}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="sr-only">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full rounded border border-terminal-border bg-transparent px-4 py-2 text-terminal-fg placeholder-terminal-muted focus:border-terminal-accent focus:outline-none"
                  placeholder="confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded bg-terminal-accent py-2 text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading
              ? 'authenticating...'
              : isRegister
              ? 'create account'
              : 'login'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister)
                setUsername('')
                setPassword('')
                setConfirmPassword('')
              }}
              className="text-sm text-terminal-fg/75 hover:text-terminal-accent"
            >
              {isRegister
                ? 'Already have an account? Login'
                : "Don't have an account? Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
