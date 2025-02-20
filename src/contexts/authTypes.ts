export interface User {
  id: string
  username: string
}

export interface AuthContextType {
  user: User | null
  login: (token: string, user: User) => void
  logout: () => void
  isAuthenticated: boolean
}
