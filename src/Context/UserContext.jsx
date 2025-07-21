import React, { createContext, useEffect, useState } from 'react'

export const AuthContext = createContext()

const UserContext = ({ children }) => {
  const [user,setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  // Get User
  useEffect(()=>{
    const storedLogin = JSON.parse(localStorage.getItem("crm_current_user"))
    if(storedLogin){
      setUser(storedLogin)
    }
    setLoading(false)
  },[])
  // Login
  const login = (userData)=>{
    setUser(userData)
    localStorage.setItem("crm_current_user", JSON.stringify(userData));

  }
  // Logout
  const logout = ()=>{
    setUser(null)
    localStorage.removeItem("crm_current_user")
  }

  return (
    <AuthContext.Provider  value={{login,logout,user,loading }}>
        {children}
    </AuthContext.Provider>
  )
}

export default UserContext