export interface User {
  id: string
  username: string
}

export interface AuthContextType {
  user: User | null
  login: (username: string, password: string) => Promise<{ user: User; token: string }>
  register: (username: string, password: string) => Promise<{ user: User; token: string }>
  logout: () => void
  isAuthenticated: boolean
}
