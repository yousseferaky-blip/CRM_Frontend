import { Route, Routes } from 'react-router-dom'
import './App.css'
import PublicLayout from  './Layouts/PublicLayout/PublicLayout'
import Home from './Pages/Home/Home'
import Dashboard from './Pages/Dashboard/Dashboard'
import DashboardLayout from './Layouts/DashboardLayout/DashboardLayout'
import Deals from './Pages/Deals/Deals'
import Login from './Pages/Login/Login'
import Register from './Pages/Register/Register'
import Users from './Pages/Users/Users'
import Client from './Pages/Client/Client'
import Employee from './Pages/Employee/Employee'
import ProtectedRoute from './Layouts/ProtectedRoute/ProtectedRoute'
import Tasks from './Pages/Tasks/Tasks'
import Reports from './Pages/Reports/Reports'
import Profile from './Pages/Profile/Profile'

function App() {

  return (
    <>
      <Routes>
          <Route path='/' element={<PublicLayout />}>
            <Route index element={<Home />}/>
          </Route>
           <Route element={<ProtectedRoute allowedRoles={["admin", "employee", "client"]} />}>
            <Route path='/dashboard' element={<DashboardLayout />}>
              <Route index element={<Dashboard />} />
              

              <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
                <Route path='/dashboard/users' element={<Users />} />
                <Route path='/dashboard/clients' element={<Client />} />
                <Route path='/dashboard/employees' element={<Employee />} />
                <Route path='/dashboard/tasks' element={<Tasks />} />
                <Route path='/dashboard/reports' element={<Reports />} />
                <Route path='/dashboard/deals' element={<Deals />} />
              </Route>

              <Route path='/dashboard/profile' element={<Profile />}  allowedRoles={[ "employee", "client"]}/>
             
            </Route>
          </Route>
          <Route path="/register" element={<Register />}/>
          <Route path="/login" element={<Login />}/>
      </Routes>
    </>
  )
}

export default App
