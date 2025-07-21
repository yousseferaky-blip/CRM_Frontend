import { AlignCenter, Home, Moon, Sun, User } from 'lucide-react'
import React, { useContext, useState } from 'react'
import { AuthContext } from '../../Context/UserContext'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const Topbar = ({setActiveSidebar,activeSidebar}) => {
 const [activeInfo,setActiveInfo] = useState(false)
 const [darkMode,setDarMode] = useState(false)
 const {user,logout} = useContext(AuthContext)
 const {t} = useTranslation()
 const dir = document.documentElement.dir;

  const swichDarkMode = ()=>{
    if(!darkMode){
      document.body.classList.add("dark")
    }else{
      document.body.classList.remove("dark")
    }
    setDarMode(!darkMode)
  }

  return (
    <nav className='topbar'>
        <div className='topbar_Container'>
          <div onClick={()=>setActiveSidebar(!activeSidebar)}  className='topbar_tab'>
              <AlignCenter size={24}/>
          </div>
          <div className='topbar_content'>
            <button onClick={ swichDarkMode} className='dark'> 
              {darkMode ? <Moon size={18}/>  : <Sun size={18}/>} 
            </button>
            <div className={`topbar_info`}>
               <span onClick={()=>setActiveInfo(!activeInfo)}>{user?.name ? user.name.slice(0,1).toUpperCase() : "" }</span>
                <div className={`topbar_info_dis ${activeInfo ? "activeInfo" : ""}`}
                  style={{
                    [dir === "rtl" ? "left" : "right"]: 0,
                    top: activeInfo ? "45px" : "-300px"
                  }}>
                   <Link to={"/"} className='topbar_info_dis_link'><Home size={14}/>{t("ho")}</Link>
                   <Link to={"/dashboard/profile"} className='topbar_info_dis_link'><User size={14}/>{t("pro")}</Link>
                   <button onClick={logout}>{t("logout")}</button>
                </div>
            </div>
          </div>
        </div>
    </nav>
  )
}

export default Topbar