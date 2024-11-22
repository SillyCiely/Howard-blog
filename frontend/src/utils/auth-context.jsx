import { createContext, useState, useEffect } from 'react'

const getUserAuthState = () => {
  const user = sessionStorage.getItem('user')
  return user ? JSON.parse(user) : null
}

// createContext gives .provider and .consumer components
const AuthContext = createContext({})

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(getUserAuthState)

  useEffect(() => {
    sessionStorage.setItem('user', JSON.stringify(user))
  }, [user])

  const login = (user) => {
    setUser(user)
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export { AuthContext, AuthContextProvider }
