import { createContext, useContext, useState } from 'react'
import {run} from '../api/mongo'

const UserContext = createContext(null);

export function UserProvider({children}){
    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    async function fetchUser(userEmail){
        setLoading(true)
        setError(null)

        run(userEmail);

        setLoading(false);
    }

      const value = {
            user,
            setUser,
            loading,
            error
        }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export function useUserContext() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider')
  }
  return context
}