import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../../Component/Sidebar/Sidebar'
import Topbar from '../../Component/Navbar/Topbar'
import { Outlet, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../Context/UserContext'

const DashboardLayout = () => {
  const { user , loading  } = useContext(AuthContext) 
  const navigate = useNavigate()
  const [activeSidebar , setActiveSidebar] = useState(false)
   useEffect(() => {
    if (!loading && !user) {
      navigate("/register")
    }
  }, [user, loading , navigate])

  if (loading) return <p>Loading...</p> 
  if (!user) return null
  
return (
    <div className='dashboardLayout'>
        <Sidebar setActiveSidebar={setActiveSidebar} activeSidebar={activeSidebar}/>
        <div className='dashboard_content'>
            <Topbar setActiveSidebar={setActiveSidebar} activeSidebar={activeSidebar}/>
            <Outlet />
        </div>
    </div>
  )
}

export default DashboardLayout